'use server'

import { revalidatePath } from 'next/cache'
import { auth } from '@clerk/nextjs'
import { ENTITY_TYPE, ACTION } from '@prisma/client'

import { db } from '@/lib/prisma'
import { createSafeAction } from '@/lib/create-safe-action'
import { createAuditLog } from '@/lib/create-audit-log'

import { InputType, ReturnType } from './types'
import { updateListSchema } from './schema'

const handler = async (data: InputType): Promise<ReturnType> => {
  const { userId, orgId } = auth()
  if (!userId || !orgId) {
    return {
      error: 'Unauthorized'
    }
  }
  const { title, boardId, id } = data
  let list
  try {
    list = await db.list.update({
      where: {
        id,
        boardId,
        board: {
          orgId
        }
      },
      data: {
        title
      }
    })
    await createAuditLog({
      entityId: list.id,
      entityTitle: list.title,
      entityType: ENTITY_TYPE.LIST,
      action: ACTION.UPDATE
    })
  } catch (err) {
    console.log(err)
    return {
      error: 'Failed to update'
    }
  }
  revalidatePath(`/board/${boardId}`)
  return {
    data: list
  }
}

export const updateList = createSafeAction(updateListSchema, handler)
