import { z } from "zod";

const acceptingMessageSchema = z.object({
    isAcceptingMessage: z.boolean()
});

export default acceptingMessageSchema;