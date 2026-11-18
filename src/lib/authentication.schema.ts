import { z } from "zod";

export const emailPasswordCredentialsSchema = z.object({
  email: z.string().trim().email(),
  password: z.string().min(1),
});

export type EmailPasswordCredentials = z.infer<typeof emailPasswordCredentialsSchema>;
