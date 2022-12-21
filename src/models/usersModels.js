import joi from "joi";


export const userSchema = joi.object({
    email: joi.string().email().required().min(3),
    password: joi.string().required().min(3),
});

export const userRegisterSchema = joi.object({
  name: joi.string().required().min(3),
  email: joi.string().email().required().min(5),
  password: joi.string().required().min(3),
  confirmPassword: joi.string().required().min(3),
});