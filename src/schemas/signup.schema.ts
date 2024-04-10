import { z } from "zod";

export const usernameValidation = z.string()
    .min(2, "Make sure your username is more than 2 characters")
    .max(20, "Make sure your username is not more than 20 characters")
    .regex(/^[a-zA-Z0-9]+$/, "Make sure your username does not contain any special characters");

const signUpSchema = z.object({
    username: usernameValidation,
    email: z.string().email("Please provide a valid email"),
    password: z.string().min(6, "Make sure your password is more than 6 characters")
});

export default signUpSchema;