import { Metadata } from 'next'
import { notFound, redirect } from 'next/navigation'
import { auth } from '@clerk/nextjs'

import { db } from '@/lib/prisma'
import { BoardNavbar } from './_components/board-navbar'

export async function generateMetadata({
  params
}: {
  params: { boardId: string }
}): Promise<Metadata> {
  const { orgId } = auth()
  if (!orgId) {
    return {
      title: 'Board'
    }
  }
  const board = await db.board.findUnique({
    where: {
      id: params.boardId,
      orgId
    }
  })

  return {
    title: board?.title ?? 'Board'
  }
}

export default async function BoardIdLayout({
  children,
  params
}: {
  children: React.ReactNode
  params: { boardId: string }
}) {
  const { orgId } = auth()
  if (!orgId) {
    return redirect('/select-org')
  }
  const board = await db.board.findUnique({
    where: {
      id: params.boardId,
      orgId
    }
  })
  if (!board) {
    notFound()
  }
  return (
    <div
      className="relative h-full bg-no-repeat bg-cover bg-center"
      style={{ backgroundImage: `url(${board.imageFullUrl})` }}
    >
      <BoardNavbar board={board} />
      <div className="absolute inset-0 bg-black/15" />
      <main className="relative pt-28 h-full">{children}</main>
    </div>
  )
}
