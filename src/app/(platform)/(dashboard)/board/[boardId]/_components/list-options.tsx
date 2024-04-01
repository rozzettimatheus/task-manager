'use client'

import { List } from '@prisma/client'

import * as Popover from '@/components/ui/popover'
import { Button } from '@/components/ui/button'
import { MoreHorizontal, X } from 'lucide-react'
import { FormSubmit } from '@/components/form/form-submit'
import { Separator } from '@/components/ui/separator'
import { useAction } from '@/hooks/use-action'
import { deleteList } from '@/actions/delete-list'
import { toast } from 'sonner'
import { ElementRef, useRef } from 'react'
import { copyList } from '@/actions/copy-list'

type ListOptionsProps = {
  data: List
  onAddCard: () => void
}

export function ListOptions({ data, onAddCard }: ListOptionsProps) {
  const closeRef = useRef<ElementRef<'button'>>(null)
  const { execute: executeCopy, isLoading: isLoadingCopy } = useAction(
    copyList,
    {
      onSuccess: data => {
        toast.success(`List "${data.title}" copied`)
        closeRef.current?.click()
      },
      onError: error => {
        toast.error(error)
      }
    }
  )
  const { execute: executeDelete, isLoading: isLoadingDelete } = useAction(
    deleteList,
    {
      onSuccess: data => {
        toast.success(`List "${data.title}" deleted`)
        closeRef.current?.click()
      },
      onError: error => {
        toast.error(error)
      }
    }
  )

  function onDelete(formData: FormData) {
    const id = formData.get('id') as string
    const boardId = formData.get('boardId') as string
    executeDelete({ id, boardId })
  }

  function onCopy(formData: FormData) {
    const id = formData.get('id') as string
    const boardId = formData.get('boardId') as string
    executeCopy({ id, boardId })
  }

  return (
    <Popover.Popover>
      <Popover.PopoverTrigger asChild>
        <Button className="h-auto w-auto p-2" variant="ghost">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </Popover.PopoverTrigger>
      <Popover.PopoverContent
        className="relative px-0 py-3"
        side="bottom"
        align="start"
      >
        <span className="block text-sm font-medium text-center text-neutral-600 pb-4">
          List actions
        </span>
        <Popover.PopoverClose ref={closeRef} asChild>
          <Button
            className="h-auto w-auto p-2 absolute top-2 right-2"
            variant="ghost"
          >
            <X className="w-4 h-4" />
          </Button>
        </Popover.PopoverClose>
        <Button
          onClick={onAddCard}
          className="rounded-none w-full h-auto py-2 px-5 justify-start font-normal text-sm"
          variant="ghost"
        >
          Add card
        </Button>
        <form action={onCopy}>
          <input hidden name="id" id="id" defaultValue={data.id} />
          <input
            hidden
            name="boardId"
            id="boardId"
            defaultValue={data.boardId}
          />
          <FormSubmit
            variant="ghost"
            className="rounded-none w-full h-auto py-2 px-5 justify-start font-normal text-sm"
            disable={isLoadingCopy}
          >
            Copy list
          </FormSubmit>
        </form>
        <Separator />
        <form action={onDelete}>
          <input hidden name="id" id="id" defaultValue={data.id} />
          <input
            hidden
            name="boardId"
            id="boardId"
            defaultValue={data.boardId}
          />
          <FormSubmit
            variant="ghost"
            disabled={isLoadingDelete}
            className="rounded-none w-full h-auto py-2 px-5 justify-start font-normal text-sm"
          >
            Delete list
          </FormSubmit>
        </form>
      </Popover.PopoverContent>
    </Popover.Popover>
  )
}
