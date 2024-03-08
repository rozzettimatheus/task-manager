'use server'

import { revalidatePath } from 'next/cache'
import { auth } from '@clerk/nextjs'

import { db } from '@/lib/prisma'
import { createSafeAction } from '@/lib/create-safe-action'
import { InputType, ReturnType } from './types'
import { deleteBoardSchema } from './schema'
import { redirect } from 'next/navigation'

const handler = async (data: InputType): Promise<ReturnType> => {
  const { userId, orgId } = auth()
  if (!userId || !orgId) {
    return {
      error: 'Unauthorized'
    }
  }
  const { id } = data
  try {
    await db.board.delete({
      where: {
        id,
        orgId
      }
    })
  } catch (err) {
    console.log(err)
    return {
      error: 'Failed to delete'
    }
  }
  revalidatePath(`/organization/${orgId}`)
  redirect(`/organization/${orgId}`)
}

export const deleteBoard = createSafeAction(deleteBoardSchema, handler)
