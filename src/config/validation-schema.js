const yup = require("yup");

const loginValidationSchema = yup.object({
  username: yup.string().label("Username").required(),
  password: yup.string().label("Password").required(),
});
exports.loginValidationSchema = loginValidationSchema;
