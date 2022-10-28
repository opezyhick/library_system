const yup = require("yup");

const loginValidationSchema = yup.object({
  email: yup.string().label("Email").required(),
  password: yup.string().label("Password").required(),
});
exports.loginValidationSchema = loginValidationSchema;


const registrationValidationSchema = yup.object({
  email: yup.string().label("Email").required(),
  password: yup.string().label("Password").required(),
});
exports.registrationValidationSchema = registrationValidationSchema;
