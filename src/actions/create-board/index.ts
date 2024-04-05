'use server'

import { revalidatePath } from 'next/cache'
import { auth } from '@clerk/nextjs'
import { ACTION, ENTITY_TYPE } from '@prisma/client'

import { db } from '@/lib/prisma'
import { createSafeAction } from '@/lib/create-safe-action'
import { createAuditLog } from '@/lib/create-audit-log'
import { incrementAvailableCount, hasAvailableCount } from '@/lib/org-limit'
import { checkSubscription } from '@/lib/subscription'
import { MAX_FREE_BOARDS } from '@/constants/boards'

import { InputType, ReturnType } from './types'
import { createBoardSchema } from './schema'

const handler = async (data: InputType): Promise<ReturnType> => {
  const { userId, orgId } = auth()
  if (!userId || !orgId) {
    return {
      error: 'Unauthorized'
    }
  }
  const canCreate = await hasAvailableCount()
  const isPro = await checkSubscription()
  if (!canCreate && !isPro) {
    return {
      error: `You have reached your limit of ${MAX_FREE_BOARDS} free board. Please upgrade to create more`
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
    if (!isPro) {
      await incrementAvailableCount()
    }
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
