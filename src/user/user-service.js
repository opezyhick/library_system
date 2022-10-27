const { User } = require("./user-model");
const logger = require("../config/logging").getLogger("USER:SERVICE");
const {
  InvalidPayloadError,
  InternalServerError,
  UnAuthorizedError,
} = require("../config/errors");
const yup = require("yup");
const { loginValidationSchema } = require("../config/validation-schema");
async function login(payload) {
  try {
    loginValidationSchema.validateSync(payload);
    const { username, password } = payload;
    console.log(payload);
    // const user = await UserModel.findOne({
    //   $or: [
    //     { old_frcn: username },
    //     { email: username },
    //     { frcn: username },
    //     { username },
    //   ],
    // }).lean(false);
    // if (user && bcryptjs.compareSync(password, user.password)) {
    //   const profile = {
    //     ...user.toObject({ virtuals: true, minimize: false }),
    //   };
    //   delete profile.password;
    //   delete profile.__t;
    //   delete profile.__v;

    //   return {
    //     access_token: jwtTokenProvider.signJwt(
    //       profile.id.toString(),
    //       user?.frcn ? AppPortalEnum.USER : AppPortalEnum.REGISTRATION
    //     ),
    //     profile,
    //   };
    // }
    // throw new InvalidPayloadError();
  } catch (error) {
    logger.error(error?.message);
    if (
      error instanceof yup.ValidationError ||
      error instanceof InvalidPayloadError
    ) {
      throw new InvalidPayloadError("Invalid Username or Password", {
        cause: error,
      });
    }
    throw new DatabaseError(undefined, { cause: error });
  }
}

exports.login = login;
