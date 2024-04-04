'use server'

import { revalidatePath } from 'next/cache'
import { auth } from '@clerk/nextjs'
import { ACTION, ENTITY_TYPE } from '@prisma/client'

import { db } from '@/lib/prisma'
import { createSafeAction } from '@/lib/create-safe-action'
import { createAuditLog } from '@/lib/create-audit-log'
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
          orgId
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
    await createAuditLog({
      entityId: card.id,
      entityTitle: card.title,
      entityType: ENTITY_TYPE.CARD,
      action: ACTION.CREATE
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
