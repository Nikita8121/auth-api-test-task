import { z } from 'zod';

const GetUserInfoResponseSchema = z.object({
  data: z.object({
    email: z.string(),
  }),
});

export namespace GetUserInfoContractQuery {
  export const ResponseSchema = GetUserInfoResponseSchema;
  export type Response = z.infer<typeof ResponseSchema>;
}
