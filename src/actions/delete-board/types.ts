import { z } from 'zod'

import { ActionState } from '@/lib/create-safe-action'
import { deleteBoardSchema } from './schema'

export type InputType = z.infer<typeof deleteBoardSchema>
export type ReturnType = ActionState<InputType, never>
