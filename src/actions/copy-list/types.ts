import { z } from 'zod'

import { ListWithCards } from '@/types'
import { ActionState } from '@/lib/create-safe-action'
import { copyListSchema } from './schema'

export type InputType = z.infer<typeof copyListSchema>
export type ReturnType = ActionState<InputType, ListWithCards>
