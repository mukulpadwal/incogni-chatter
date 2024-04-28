import { Message } from "@/models/user.model";


export default interface ApiResponse {
    success: boolean,
    message: string,
    isAcceptingMessage?: boolean,
    messages?: Array<Message>
}