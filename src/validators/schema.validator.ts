import Joi, {  ObjectSchema } from "@hapi/joi";
import { PriorityStatus, taskInterfac } from "../interfac/task/taskInterfac";
const PASSWORD_REGEX = new RegExp(
    "^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!.@#$%^&*])(?=.{8,})"
);

const authRegister = Joi.object().keys({
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().pattern(PASSWORD_REGEX).min(8).required(),
});


const authLogin = Joi.object().keys({
    email: Joi.string().required(),
    password: Joi.string().required(),
});

const createTaskValidate = Joi.object<taskInterfac>({
    title: Joi.string().min(1).max(50).required(),
    description: Joi.string().min(1).max(200).required(),
    time: Joi.date().required(),
    priority: Joi.string().valid(...Object.values(PriorityStatus)).required(),
    dueDate: Joi.date().required(),
    completed: Joi.boolean().required(),

});

export default {
    "/auth/register": authRegister,
    "/auth/login": authLogin,
    "/task/create-task": createTaskValidate
} as { [key: string]: ObjectSchema }
