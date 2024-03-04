'use server'

import { revalidatePath } from 'next/cache'
import { z } from 'zod'

import { db } from '@/lib/prisma'

const createBoard = z.object({
  title: z.string()
})

export async function create(formData: FormData) {
  const { title } = createBoard.parse({
    title: formData.get('title')
  })
  await db.board.create({
    data: {
      title
    }
  })
  revalidatePath('/')
}
