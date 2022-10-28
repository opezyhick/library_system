const {
  models: { User, Book, Check },
} = require("../config/database");
const logger = require("../config/logging").getLogger("BOOK:SERVICE");
const {
  InvalidPayloadError,
  InternalServerError,
  UnAuthorizedError,
  DatabaseError,
  AuthenticationError,
} = require("../config/errors");
const yup = require("yup");
const { Op } = require("sequelize");

const {
  loginValidationSchema,
  registrationValidationSchema,
} = require("../config/validation-schema");
const { UserTypeEnum, CheckTypeEnum } = require("../config/constants");

exports.getAllCheckouts = async function getAllCheckouts(adminId) {
  try {
    const user = await User.findAll({
      where: {
        user_id: adminId,
      },
    });

    if (!user[0]) {
      throw new AuthenticationError("Oops ! !, You cannot access this route");
    }
    const isLiberian = user[0].type === UserTypeEnum.LIBRARIAN;
    if (!isLiberian) throw new UnAuthorizedError("Low ACL ");
    const data = await Check.findAll();
    return {
      data,
    };
  } catch (error) {
    logger.error(error?.message);
    if (error instanceof yup.ValidationError) {
      throw new InvalidPayloadError(error.errors[0], {
        cause: error,
      });
    }
    if (error instanceof UnAuthorizedError) {
      throw error;
    }
    if (error instanceof AuthenticationError) {
      throw error;
    }
    if (error instanceof InvalidPayloadError) {
      throw error;
    }
    throw new InternalServerError(undefined, { cause: error });
  }
};

exports.checkOutBook = async function checkOutBook(userId, queryParams) {
  try {
    const user = await User.findOne({
      where: {
        user_id: userId,
      },
    });
    if (user == null || !user) {
      throw new AuthenticationError("Oops ! !, You cannot access this route");
    }
    const isUser = user.type === UserTypeEnum.USER;
    if (!isUser) throw new InvalidPayloadError("Only User can Check-Out Book ");

    const { espected_return_date, book_id } = queryParams;

    const check = Check.build({
      espected_return_date,
      book_id: book_id,
      type: CheckTypeEnum.OUT,
      check_out_by: user.user_id,
    });
    await check.save();
    return {
      message: `Book ${book_id} checked-out `,
    };
  } catch (error) {
    logger.error(error?.message);
    if (error instanceof yup.ValidationError) {
      throw new InvalidPayloadError(error.errors[0], {
        cause: error,
      });
    }
    if (error instanceof UnAuthorizedError) {
      throw error;
    }
    if (error instanceof AuthenticationError) {
      throw error;
    }
    if (error instanceof InvalidPayloadError) {
      throw error;
    }
    throw new InternalServerError(undefined, { cause: error });
  }
};

exports.checkInBook = async function checkInBook(adminId, queryParams) {
  try {
    const user = await User.findOne({
      where: {
        user_id: adminId,
      },
    });
    if (!user || user === null) {
      throw new AuthenticationError("Oops ! !, You cannot access this route");
    }
    const isLiberian = user.type === UserTypeEnum.LIBRARIAN;
    if (!isLiberian) throw new UnAuthorizedError("Low ACL ");

    const { book_id } = queryParams;

    const update = await Check.update(
      {
        check_in_by: adminId,
        check_in_at: Date.now(),
        type: CheckTypeEnum.IN,
      },
      {
        where: {
          book_id: book_id,
        },
      }
    );

    return {
      message: `Book ${book_id} checked-in `,
    };
  } catch (error) {
    logger.error(error?.message);
    if (error instanceof yup.ValidationError) {
      throw new InvalidPayloadError(error.errors[0], {
        cause: error,
      });
    }
    if (error instanceof UnAuthorizedError) {
      throw error;
    }
    if (error instanceof AuthenticationError) {
      throw error;
    }
    if (error instanceof InvalidPayloadError) {
      throw error;
    }
    throw new InternalServerError(undefined, { cause: error });
  }
};
