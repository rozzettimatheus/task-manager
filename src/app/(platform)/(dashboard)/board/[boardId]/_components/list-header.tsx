'use client'

import { useState, useRef, type ElementRef } from 'react'
import { useEventListener } from 'usehooks-ts'
import { toast } from 'sonner'
import { List } from '@prisma/client'

import { FormInput } from '@/components/form/form-input'
import { useAction } from '@/hooks/use-action'
import { updateList } from '@/actions/update-list'
import { ListOptions } from './list-options'

type ListHeaderProps = {
  data: List
}

export function ListHeader({ data }: ListHeaderProps) {
  const [title, setTitle] = useState(data.title)
  const [isEditing, setIsEditing] = useState(false)
  const inputRef = useRef<ElementRef<'input'>>(null)
  const formRef = useRef<ElementRef<'form'>>(null)
  const { execute } = useAction(updateList, {
    onSuccess: data => {
      toast.success(`List renamed to "${data.title}"`)
      setTitle(data.title)
      disableEditing()
    },
    onError: error => {
      toast.error(error)
    }
  })

  function enableEditing() {
    setIsEditing(true)
    setTimeout(() => {
      inputRef.current?.focus()
      inputRef.current?.select()
    })
  }

  function disableEditing() {
    setIsEditing(false)
  }

  function onKeyDown(e: KeyboardEvent) {
    if (e.key === 'Escape') {
      formRef.current?.requestSubmit()
    }
  }

  function onSubmit(formData: FormData) {
    const title = formData.get('title') as string
    const id = formData.get('id') as string
    const boardId = formData.get('boardId') as string
    if (title === data.title) return disableEditing()
    execute({ title, id, boardId })
  }

  function onBlur() {
    formRef.current?.requestSubmit()
  }

  useEventListener('keydown', onKeyDown)

  return (
    <div className="pt-2 px-2 text-sm font-semibold flex justify-between items-start gap-x 2">
      {isEditing ? (
        <form ref={formRef} action={onSubmit} className="flex-1 px-[2px]">
          <input hidden id="id" name="id" value={data.id} />
          <input hidden id="boardId" name="boardId" value={data.boardId} />
          <FormInput
            ref={inputRef}
            id="title"
            placeholder="Enter list title"
            defaultValue={title}
            onBlur={onBlur}
            className="text-sm px-[7px] py-1 h-7 font-medium border-transparent hover:border-input focus:border-input transition truncate bg-transparent focus:bg-white "
          />
          <button type="submit" hidden />
        </form>
      ) : (
        <span
          onClick={enableEditing}
          className="block w-full text-sm px-2.5 py-1 h-7 font-medium border-transparent"
        >
          {title}
        </span>
      )}
      <ListOptions data={data} onAddCard={() => {}} />
    </div>
  )
}
