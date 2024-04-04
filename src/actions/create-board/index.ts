'use server'

import { revalidatePath } from 'next/cache'
import { auth } from '@clerk/nextjs'
import { ACTION, ENTITY_TYPE } from '@prisma/client'

import { db } from '@/lib/prisma'
import { createSafeAction } from '@/lib/create-safe-action'
import { createAuditLog } from '@/lib/create-audit-log'

import { InputType, ReturnType } from './types'
import { createBoardSchema } from './schema'

const handler = async (data: InputType): Promise<ReturnType> => {
  const { userId, orgId } = auth()
  if (!userId || !orgId) {
    return {
      error: 'Unauthorized'
    }
  }
  const { title, image } = data
  const [imageId, imageThumbUrl, imageFullUrl, imageLinkHtml, imageUsername] =
    image.split('|')
  if (
    !imageId ||
    !imageThumbUrl ||
    !imageFullUrl ||
    !imageLinkHtml ||
    !imageUsername
  ) {
    return {
      error: 'Missing fields. Failed to create board'
    }
  }
  let board
  try {
    board = await db.board.create({
      data: {
        title,
        orgId,
        imageId,
        imageThumbUrl,
        imageFullUrl,
        imageLinkHtml,
        imageUsername
      }
    })
    await createAuditLog({
      entityId: board.id,
      entityTitle: board.title,
      entityType: ENTITY_TYPE.BOARD,
      action: ACTION.CREATE
    })
  } catch (err) {
    console.log(err)
    return {
      error: 'Failed to create'
    }
  }
  revalidatePath(`/board/${board.id}`)
  return {
    data: board
  }
}

export const createBoard = createSafeAction(createBoardSchema, handler)
