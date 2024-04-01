import { Plus, X } from 'lucide-react'
import { useParams } from 'next/navigation'
import { forwardRef, useRef } from 'react'
import { toast } from 'sonner'
import { useEventListener, useOnClickOutside } from 'usehooks-ts'

import { createCard } from '@/actions/create-card'
import { FormSubmit } from '@/components/form/form-submit'
import { FormTextArea } from '@/components/form/form-textarea'
import { Button } from '@/components/ui/button'
import { useAction } from '@/hooks/use-action'

type CardFormProps = {
  listId: string
  isEditing: boolean
  enableEditing: () => void
  disableEditing: () => void
}

type Params = {
  boardId: string
}

export const CardForm = forwardRef<HTMLTextAreaElement, CardFormProps>(
  ({ disableEditing, enableEditing, isEditing, listId }, ref) => {
    const formRef = useRef<React.ElementRef<'form'>>(null)
    const { boardId } = useParams<Params>()
    const { execute, fieldErrors } = useAction(createCard, {
      onSuccess: data => {
        console.log(data)
        toast.success(`Card "${data.title}" created`)
        formRef.current?.reset()
      },
      onError: error => {
        toast.error(error)
      }
    })

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        disableEditing()
      }
    }

    useOnClickOutside(formRef, disableEditing)
    useEventListener('keydown', onKeyDown)

    const onTextAreaKeyDown: React.KeyboardEventHandler<
      HTMLTextAreaElement
    > = e => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault()
        formRef.current?.requestSubmit()
      }
    }

    function onSubmit(formData: FormData) {
      const title = formData.get('title') as string
      const listId = formData.get('listId') as string
      execute({ title, boardId, listId })
    }

    if (isEditing) {
      return (
        <form
          ref={formRef}
          action={onSubmit}
          className="m-1 py-0.5 px-1 space-y-4"
        >
          <FormTextArea
            id="title"
            ref={ref}
            placeholder="Enter a title for this card..."
            onKeyDown={onTextAreaKeyDown}
            errors={fieldErrors}
          />
          <input hidden id="listId" name="listId" value={listId} />
          <div className="flex items-center gap-x-1">
            <FormSubmit>Add a card</FormSubmit>
            <Button onClick={disableEditing} size="sm" variant="ghost">
              <X className="h-5 w-5" />
            </Button>
          </div>
        </form>
      )
    }

    return (
      <div className="pt-2 px-2">
        <Button
          onClick={enableEditing}
          className="h-auto px-2 py-1.5 w-full justify-start text-muted-foreground"
          size="sm"
          variant="ghost"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add a card
        </Button>
      </div>
    )
  }
)

CardForm.displayName = 'CardForm'
