'use client'

import { X } from 'lucide-react'

import { useAction } from '@/hooks/use-action'
import { createBoard } from '@/actions/create-board'
import * as Popover from '@/components/ui/popover'
import { Button } from '@/components/ui/button'

import { FormInput } from './form-input'
import { FormSubmit } from './form-submit'
import { toast } from 'sonner'

type FormPopoverProps = {
  children: React.ReactNode
  side?: 'left' | 'right' | 'top' | 'bottom'
  align?: 'start' | 'center' | 'end'
  sideOffset?: number
}

export function FormPopover({
  children,
  align,
  side = 'bottom',
  sideOffset = 0
}: FormPopoverProps) {
  const { execute, fieldErrors } = useAction(createBoard, {
    onSuccess: data => {
      console.log({ data })
      toast.success('Board created')
    },
    onError: error => {
      toast.error(error)
    }
  })

  function onSubmit(formData: FormData) {
    const title = formData.get('title') as string
    execute({ title })
  }

  return (
    <Popover.Popover>
      <Popover.PopoverTrigger asChild>{children}</Popover.PopoverTrigger>
      <Popover.PopoverContent
        side={side}
        align={align}
        sideOffset={sideOffset}
        className="w-80 mt-3"
      >
        <div className="text-sm font-medium text-center text-neutral-600 pb-4">
          Create board
        </div>
        <Popover.PopoverClose asChild>
          <Button
            className="h-auto w-auto p-2 absolute top-6 right-2 text-neutral-600"
            variant="ghost"
          >
            <X className="h-4 w-4" />
          </Button>
        </Popover.PopoverClose>
        <form action={onSubmit} className="space-y-4">
          <div className="space-y-4">
            <FormInput
              id="title"
              label="Board title"
              type="text"
              errors={fieldErrors}
            />
          </div>
          <FormSubmit className="w-full">Create</FormSubmit>
        </form>
      </Popover.PopoverContent>
    </Popover.Popover>
  )
}
