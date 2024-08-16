import { z } from 'zod';

const UserSignUpRequestSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

const UserSignUpResponseSchema = z.object({
  data: z.object({
    success: z.boolean(),
  }),
});

export namespace UserSignUpContractCommand {
  export const RequestSchema = UserSignUpRequestSchema;
  export type Request = z.infer<typeof RequestSchema>;

  export const ResponseSchema = UserSignUpResponseSchema;
  export type Response = z.infer<typeof ResponseSchema>;
}
