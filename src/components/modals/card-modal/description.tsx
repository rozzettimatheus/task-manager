import { useRef, useState } from 'react'
import { useParams } from 'next/navigation'
import { AlignLeft } from 'lucide-react'
import { useQueryClient } from '@tanstack/react-query'

import { Skeleton } from '@/components/ui/skeleton'
import { CardWithList } from '@/types'
import { useEventListener, useOnClickOutside } from 'usehooks-ts'
import { FormTextArea } from '@/components/form/form-textarea'
import { FormSubmit } from '@/components/form/form-submit'
import { Button } from '@/components/ui/button'
import { useAction } from '@/hooks/use-action'
import { updateCard } from '@/actions/update-card'
import { toast } from 'sonner'

type DescriptionProps = {
  data: CardWithList
}

type Params = {
  boardId: string
}

export function Description({ data }: DescriptionProps) {
  const [description, setDescription] = useState(data.description)
  const [isEditing, setIsEditing] = useState(false)
  const textAreaRef = useRef<React.ElementRef<'textarea'>>(null)
  const formRef = useRef<React.ElementRef<'form'>>(null)
  const queryClient = useQueryClient()
  const params = useParams<Params>()
  const { execute, fieldErrors } = useAction(updateCard, {
    onSuccess: data => {
      queryClient.invalidateQueries({
        queryKey: ['card', data.id]
      })
      queryClient.invalidateQueries({
        queryKey: ['card-logs', data.id]
      })
      toast.success(`Card "${data.title}" updated`)
      setDescription(data.description)
      disableEditing()
    },
    onError: error => {
      toast.error(error)
    }
  })

  function disableEditing() {
    setIsEditing(false)
  }

  function enableEditing() {
    setIsEditing(true)
    setTimeout(() => {
      textAreaRef.current?.focus()
    })
  }

  function onKeyDown(e: KeyboardEvent) {
    if (e.key === 'Escape') {
      disableEditing()
    }
  }

  function onSubmit(formData: FormData) {
    const desc = formData.get('description') as string
    if (desc === data.description) return
    execute({ description: desc, boardId: params.boardId, id: data.id })
  }

  useEventListener('keydown', onKeyDown)
  useOnClickOutside(formRef, disableEditing)

  return (
    <div className="flex items-start gap-x-3 w-full">
      <AlignLeft className="w-5 h-5 mt-0.5 text-neutral-700 flex-shrink-0" />
      <div className="w-full">
        <p className="font-semibold text-neutral-700 mb-2">Description</p>
        {isEditing ? (
          <form ref={formRef} action={onSubmit} className="space-y-2">
            <FormTextArea
              ref={textAreaRef}
              id="description"
              className="w-full mt-2"
              placeholder="Add a more detailed description"
              defaultValue={description ?? ''}
              errors={fieldErrors}
            />
            <div className="flex items-center gap-x-2">
              <FormSubmit>Save</FormSubmit>
              <Button
                type="button"
                onClick={disableEditing}
                size="sm"
                variant="ghost"
              >
                Cancel
              </Button>
            </div>
          </form>
        ) : (
          <div
            onClick={enableEditing}
            role="button"
            className="bg-neutral-200 min-h-[78px] text-sm font-medium py-3 px-3.5 rounded-md"
          >
            {description ?? 'Add a more detailed description'}
          </div>
        )}
      </div>
    </div>
  )
}

Description.Skeleton = function DescriptionSkeleton() {
  return (
    <div className="flex items-start gap-x-3 w-full">
      <Skeleton className="h-6 w-6 bg-neutral-200" />
      <div className="w-full">
        <Skeleton className="w-24 h-6 mb-2 bg-neutral-200" />
        <Skeleton className="w-full h-[78px] bg-neutral-200" />
      </div>
    </div>
  )
}
