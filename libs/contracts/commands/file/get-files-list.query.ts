import { z } from 'zod';
import { FileSchema } from '../../schemas';

const GetFileListRequestSchema = z.object({
  page: z.coerce.number().default(1),
  count: z.coerce.number().default(10),
});

const GetFileListResponseSchema = z.object({
  data: z.object({
    list: FileSchema.array(),
    total: z.number(),
  }),
});

export namespace GetFileListContractQuery {
  export const RequestSchema = GetFileListRequestSchema;
  export type Request = z.infer<typeof RequestSchema>;

  export const ResponseSchema = GetFileListResponseSchema;
  export type Response = z.infer<typeof ResponseSchema>;
}
