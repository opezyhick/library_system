const {
  models: { User, Book },
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
const bcryptjs = require("bcryptjs");
const jwtTokenProvider = require("../config/jwt-token-provider");

const {
  loginValidationSchema,
  registrationValidationSchema,
} = require("../config/validation-schema");
const { UserTypeEnum } = require("../config/constants");
const { IMAGE_ROOT_DIR } = require("../utility/utils");
const path = require("path");

exports.addNewBook = async function addNewBook(adminId, payload) {
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

    const { cover_page_image } = payload;

    const book = Book.build({
      ...payload,
      added_by: adminId,
      cover_page_image: cover_page_image?.path
        ? path.relative(IMAGE_ROOT_DIR, cover_page_image?.path)
        : cover_page_image,
    });
    await book.save();
    console.log(book);

    return { message: "Book Added" };
  } catch (error) {
    logger.error(error?.message);
    if (error instanceof yup.ValidationError) {
      throw new InvalidPayloadError(error.errors[0], {
        cause: error,
      });
    }
    if (error instanceof InvalidPayloadError) {
      throw error;
    }
    if (error instanceof AuthenticationError) {
      throw error;
    }
    if (error instanceof UnAuthorizedError) {
      throw error;
    }
    throw new InternalServerError(undefined, { cause: error });
  }
};

exports.getAllBooks = async function getAllBooks(adminId) {
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
    const books = await Book.findAll();
    return {
      data: books,
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

exports.updateBook = async function updateBook(adminId, queryParams, payload) {
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

    const { cover_page_image } = payload;

    const update = await Book.update(
      {
        ...payload,
        cover_page_image: cover_page_image?.path
          ? path.relative(IMAGE_ROOT_DIR, cover_page_image?.path)
          : cover_page_image,
      },
      {
        where: {
          book_id: queryParams.book_id,
        },
      }
    );
    console.log(update);

    return { message: `Bood with ${queryParams.book_id} Updated` };
  } catch (error) {
    logger.error(error?.message);
    if (error instanceof yup.ValidationError) {
      throw new InvalidPayloadError(error.errors[0], {
        cause: error,
      });
    }
    if (error instanceof InvalidPayloadError) {
      throw error;
    }
    if (error instanceof AuthenticationError) {
      throw error;
    }
    if (error instanceof UnAuthorizedError) {
      throw error;
    }
    throw new InternalServerError(undefined, { cause: error });
  }
};
