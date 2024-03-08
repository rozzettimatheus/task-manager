'use client'

import { ElementRef, useRef, useState } from 'react'
import { toast } from 'sonner'
import { Board } from '@prisma/client'

import { Button } from '@/components/ui/button'
import { FormInput } from '@/components/form/form-input'
import { useAction } from '@/hooks/use-action'
import { updateBoard } from '@/actions/update-board'

export function BoardTitleForm({ data }: { data: Board }) {
  const { execute } = useAction(updateBoard, {
    onSuccess: data => {
      toast.success(`Board "${data.title}" updated`)
      setTitle(data.title)
      disableEditing()
    },
    onError: error => {
      toast.error(error)
    }
  })
  const formRef = useRef<ElementRef<'form'>>(null)
  const inputRef = useRef<ElementRef<'input'>>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [title, setTitle] = useState(data.title)

  function disableEditing() {
    setIsEditing(false)
  }

  function enableEditing() {
    setIsEditing(true)
    setTimeout(() => {
      inputRef.current?.focus()
      inputRef.current?.select()
    })
  }

  function onSubmit(formData: FormData) {
    const title = formData.get('title') as string
    execute({ title, id: data.id })
  }

  function onBlur() {
    formRef.current?.requestSubmit()
  }

  if (isEditing) {
    return (
      <form
        ref={formRef}
        action={onSubmit}
        className="flex items-center gap-x-2"
      >
        <FormInput
          ref={inputRef}
          id="title"
          onBlur={onBlur}
          defaultValue={title}
          className="text-lg font-bold px-[7px] py-1 h-7 bg-transparent focus-visible:outline-none focus-visible:ring-transparent border-none"
        />
      </form>
    )
  }

  return (
    <Button
      variant="transparent"
      className="font-bold text-lg h-auto w-auto py-1 px-2"
      onClick={enableEditing}
    >
      {title}
    </Button>
  )
}
