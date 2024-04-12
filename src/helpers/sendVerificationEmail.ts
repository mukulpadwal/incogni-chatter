import { resend } from "@/lib/resend";
import VerificationEmail from "../../emails/VerificationEmail";
import ApiResponse from "@/types/ApiResponse";

export default async function sendVerificationEmail(email: string, username: string, otp: string): Promise<ApiResponse> {
    try {

        await resend.emails.send({
            from: 'onboarding@resend.dev',
            to: email,
            subject: 'Incogni-Chatter | Verification Code',
            react: VerificationEmail({ username, otp }),
        });

        return { success: true, message: "Verification email sent successfully." }

    } catch (emailError: any) {
        console.error(`Error while sending verification email : ERROR : ${emailError.message}`)
        return { success: false, message: "Failed to send verification email." }
    }
}