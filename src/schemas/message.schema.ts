import { z } from "zod";

const messageSchema = z.object({
    message: z.string().min(10, "Make sure your message is atleast 10 characters").max(300, "Make sure your message not more than 300 characters")
});

export default messageSchema;