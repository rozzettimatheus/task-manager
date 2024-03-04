import { create } from '@/actions/create-board'
import { Button } from '@/components/ui/button'
import { db } from '@/lib/prisma'

export default async function OrganizationIdPage() {
  const boards = await db.board.findMany()
  return (
    <div>
      <form action={create}>
        <input
          type="text"
          id="title"
          name="title"
          placeholder="Enter a border title"
          className="border-black border p-1"
          required
        />
        <Button type="submit">Submit</Button>
      </form>
      <div className="space-y-2">
        {boards?.map(board => (
          <div key={board.id}>{board.title}</div>
        ))}
      </div>
    </div>
  )
}
