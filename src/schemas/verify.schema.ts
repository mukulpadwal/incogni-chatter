import { z } from "zod";

const verifySchema = z.object({
    verifyOtp: z.string().length(6, "Please enter your 6 digit OTP")
});

export default verifySchema;