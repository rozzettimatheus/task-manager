'use server'

import { revalidatePath } from 'next/cache'
import { auth } from '@clerk/nextjs'

import { db } from '@/lib/prisma'
import { createSafeAction } from '@/lib/create-safe-action'
import { InputType, ReturnType } from './types'
import { updateBoardSchema } from './schema'

const handler = async (data: InputType): Promise<ReturnType> => {
  const { userId, orgId } = auth()
  if (!userId || !orgId) {
    return {
      error: 'Unauthorized'
    }
  }
  const { title, id } = data
  let board
  try {
    board = await db.board.update({
      where: {
        id,
        orgId
      },
      data: {
        title
      }
    })
  } catch (err) {
    console.log(err)
    return {
      error: 'Failed to update'
    }
  }
  revalidatePath(`/board/${id}`)
  return {
    data: board
  }
}

export const updateBoard = createSafeAction(updateBoardSchema, handler)
