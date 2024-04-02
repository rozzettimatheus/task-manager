'use server'

import { revalidatePath } from 'next/cache'
import { auth } from '@clerk/nextjs'

import { db } from '@/lib/prisma'
import { createSafeAction } from '@/lib/create-safe-action'
import { InputType, ReturnType } from './types'
import { updateCardSchema } from './schema'

const handler = async (data: InputType): Promise<ReturnType> => {
  const { userId, orgId } = auth()
  if (!userId || !orgId) {
    return {
      error: 'Unauthorized'
    }
  }
  const { id, boardId, ...values } = data
  let card
  card = await db.card.update({
    where: {
      id,
      list: {
        board: {
          orgId
        }
      }
    },
    data: {
      ...values
    }
  })
  try {
  } catch (err) {
    console.log(err)
    return {
      error: 'Failed to update'
    }
  }
  revalidatePath(`/board/${boardId}`)
  return {
    data: card
  }
}

export const updateCard = createSafeAction(updateCardSchema, handler)
