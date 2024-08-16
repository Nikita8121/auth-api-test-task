import { z } from 'zod';

const UserSignInRequestSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

const UserSignInResponseSchema = z.object({
  data: z.object({
    accessToken: z.string(),
    refreshToken: z.string(),
  }),
});

export namespace UserSignInContractCommand {
  export const RequestSchema = UserSignInRequestSchema;
  export type Request = z.infer<typeof RequestSchema>;

  export const ResponseSchema = UserSignInResponseSchema;
  export type Response = z.infer<typeof ResponseSchema>;
}
