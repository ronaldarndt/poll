import { z } from "zod";

const envVariables = z.object({
  DATABASE_URL: z.string()
});

declare global {
  namespace NodeJS {
    interface ProcessEnv extends z.infer<typeof envVariables> {}
  }
}
