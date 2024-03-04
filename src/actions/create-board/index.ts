'use server'

import { revalidatePath } from 'next/cache'
import { auth } from '@clerk/nextjs'

import { db } from '@/lib/prisma'
import { createSafeAction } from '@/lib/create-safe-action'
import { InputType, ReturnType } from './types'
import { createBoardSchema } from './schema'

const handler = async (data: InputType): Promise<ReturnType> => {
  const { userId } = auth()
  if (!userId) {
    return {
      error: 'Unauthorized'
    }
  }
  const { title } = data
  let board
  try {
    board = await db.board.create({
      data: {
        title
      }
    })
  } catch (err) {
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
