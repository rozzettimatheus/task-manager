'use client'

import { MoreHorizontal, X } from 'lucide-react'
import { toast } from 'sonner'

import { deleteBoard } from '@/actions/delete-board'
import { Button } from '@/components/ui/button'
import * as Popover from '@/components/ui/popover'
import { useAction } from '@/hooks/use-action'

export function BoardOptions({ id }: { id: string }) {
  const { execute, isLoading } = useAction(deleteBoard, {
    onError: error => {
      toast.error(error)
    }
  })

  const onDelete = () => {
    execute({ id })
  }

  return (
    <Popover.Popover>
      <Popover.PopoverTrigger asChild>
        <Button className="h-auto w-auto p-2" variant="transparent">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </Popover.PopoverTrigger>
      <Popover.PopoverContent
        className="relative px-0 pt-3"
        side="bottom"
        align="start"
      >
        <span className="block text-sm font-medium text-center text-neutral-600 pb-4">
          Board actions
        </span>
        <Popover.PopoverClose asChild>
          <Button
            className="h-auto w-auto p-2 absolute top-2 right-2 text-neutral-600"
            variant="ghost"
          >
            <X className="h-4 w-4" />
          </Button>
        </Popover.PopoverClose>
        <Button
          variant="ghost"
          className="rounded-none w-full h-auto p-2 px-5 justify-start font-normal text-sm"
          onClick={onDelete}
          disabled={isLoading}
        >
          Delete this board
        </Button>
      </Popover.PopoverContent>
    </Popover.Popover>
  )
}
