import { z } from 'zod';

export const FileSchema = z.object({
  id: z.number(),
  name: z.string(),
  url: z.string(),
  mimeType: z.string(),
  size: z.number(),
  s3Key: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
});
