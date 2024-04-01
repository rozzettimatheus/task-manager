'use server'

import { revalidatePath } from 'next/cache'
import { auth } from '@clerk/nextjs'

import { db } from '@/lib/prisma'
import { createSafeAction } from '@/lib/create-safe-action'
import { InputType, ReturnType } from './types'
import { createCardSchema } from './schema'

const handler = async (data: InputType): Promise<ReturnType> => {
  const { userId, orgId } = auth()
  if (!userId || !orgId) {
    return {
      error: 'Unauthorized'
    }
  }
  const { title, boardId, listId } = data
  let card
  try {
    const list = await db.list.findUnique({
      where: {
        id: listId,
        board: {
          id: boardId
        }
      }
    })
    if (!list) {
      return {
        error: 'List not found!'
      }
    }
    // get last card order
    const lastCard = await db.card.findFirst({
      where: {
        listId
      },
      orderBy: {
        order: 'desc'
      },
      select: {
        order: true
      }
    })
    const newOrder = lastCard ? lastCard.order + 1 : 1
    card = await db.card.create({
      data: {
        title,
        listId,
        order: newOrder
      }
    })
  } catch (err) {
    console.log(err)
    return {
      error: 'Failed to create'
    }
  }
  revalidatePath(`/board/${boardId}`)
  return {
    data: card
  }
}

export const createCard = createSafeAction(createCardSchema, handler)
