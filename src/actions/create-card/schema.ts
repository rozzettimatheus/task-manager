import { z } from 'zod'

export const createCardSchema = z.object({
  title: z
    .string({
      required_error: 'Title is required',
      invalid_type_error: 'Title is required'
    })
    .min(3, {
      message: 'Title is too short'
    })
    .max(40, 'Title can contain up to 40 characters'),
  boardId: z.string(),
  listId: z.string()
})
