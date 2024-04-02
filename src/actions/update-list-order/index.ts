'use server'

import { revalidatePath } from 'next/cache'
import { auth } from '@clerk/nextjs'

import { db } from '@/lib/prisma'
import { createSafeAction } from '@/lib/create-safe-action'
import { InputType, ReturnType } from './types'
import { updateListOrderSchema } from './schema'

const handler = async (data: InputType): Promise<ReturnType> => {
  const { userId, orgId } = auth()
  if (!userId || !orgId) {
    return {
      error: 'Unauthorized'
    }
  }
  const { boardId, items } = data
  let lists
  try {
    const transaction = items.map(list =>
      db.list.update({
        where: {
          id: list.id,
          board: {
            orgId
          }
        },
        data: {
          order: list.order
        }
      })
    )

    lists = await db.$transaction(transaction)
  } catch (err) {
    console.log(err)
    return {
      error: 'Failed to update order'
    }
  }
  revalidatePath(`/board/${boardId}`)
  return { data: lists }
}

export const updateListOrder = createSafeAction(updateListOrderSchema, handler)
