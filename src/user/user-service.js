const {
  models: { User, Check },
} = require("../config/database");
const logger = require("../config/logging").getLogger("USER:SERVICE");
const {
  InvalidPayloadError,
  InternalServerError,
  UnAuthorizedError,
  DatabaseError,
} = require("../config/errors");
const yup = require("yup");
const bcryptjs = require("bcryptjs");
const jwtTokenProvider = require("../config/jwt-token-provider");

const {
  loginValidationSchema,
  registrationValidationSchema,
} = require("../config/validation-schema");
const path = require("path");

const { IMAGE_ROOT_DIR } = require("../utility/utils");
const { UserTypeEnum } = require("../config/constants");

exports.login = async function login(payload) {
  try {
    loginValidationSchema.validateSync(payload);
    const { email, password } = payload;
    const user = await User.findAll({
      where: {
        email: email,
      },
    });
    if (!user) {
      throw new InvalidPayloadError("Invalid Credentials");
    }

    if (user && bcryptjs.compareSync(password, user[0].password)) {
      const profile = user[0];
      delete profile.password;
      return {
        access_token: jwtTokenProvider.signJwt(profile.user_id.toString()),
        profile,
      };
    }
    throw new InvalidPayloadError("Invalid Credentials Detected");
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
    throw new DatabaseError(undefined, { cause: error });
  }
};

exports.register = async function register(payload) {
  try {
    registrationValidationSchema.validateSync(payload);
    const user = User.build({
      ...payload,
      password: bcryptjs.hashSync(payload?.password),
    });
    await user.save();
    return { message: "Account Created", status: 201 };
  } catch (error) {
    logger.error(error?.message);

    if (error instanceof yup.ValidationError) {
      throw new InvalidPayloadError(error.errors[0], {
        cause: error,
      });
    }
    if (
      error instanceof InvalidPayloadError ||
      error instanceof UnAuthorizedError
    ) {
      throw error;
    }
    throw new InternalServerError(undefined, { cause: error });
  }
};

exports.getAllUser = async function getAllUser(adminId) {
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
    if (!isLiberian) throw new UnAuthorizedError("Access not granted");

    const users = await User.findAll();

    return {
      data: users,
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
    if (error instanceof InvalidPayloadError) {
      throw error;
    }
    throw new DatabaseError(undefined, { cause: error });
  }
};

exports.updateProfilePhoto = async function updateProfilePhoto(
  userId,
  payload
) {
  try {
    const user = await User.findAll({
      where: {
        user_id: userId,
      },
    });

    if (!user[0]) {
      throw new AuthenticationError("Oops ! ! , Invalid Authorization ");
    }

    const { profile_photo } = payload;

    const update = await User.update(
      {
        profile_photo: profile_photo?.path
          ? path.relative(IMAGE_ROOT_DIR, profile_photo?.path)
          : profile_photo,
      },
      {
        where: {
          user_id: userId,
        },
      }
    );

    return { message: "Picture Uploaded" };
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

exports.getAllUserCheckOut = async function getAllUserCheckOut(
  adminId,
  queryParams
) {
  try {
    const user = await User.findOne({
      where: {
        user_id: adminId,
      },
    });

    if (!user || user === null) {
      throw new AuthenticationError("Oops ! !, Invalid Bearer Token");
    }
    const isLiberian = user.type === UserTypeEnum.LIBRARIAN;
    if (!isLiberian) throw new UnAuthorizedError("Access not granted");

    const data = await User.findAll({
      include: [{ model: Check, as: "check" }],
    });

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
    if (error instanceof InvalidPayloadError) {
      throw error;
    }
    throw new DatabaseError(undefined, { cause: error });
  }
};
