import { useParams } from 'next/navigation'
import { Copy, Trash } from 'lucide-react'

import { copyCard } from '@/actions/copy-card'
import { deleteCard } from '@/actions/delete-card'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { useAction } from '@/hooks/use-action'
import { CardWithList } from '@/types'
import { toast } from 'sonner'
import { useCardModal } from '@/hooks/use-card-modal'

type ActionsProps = {
  data: CardWithList
}

type Params = {
  boardId: string
}

export function Actions({ data }: ActionsProps) {
  const params = useParams<Params>()
  const onCloseModal = useCardModal(state => state.onClose)
  const { execute: executeDelete, isLoading: isLoadingDelete } = useAction(
    deleteCard,
    {
      onSuccess: data => {
        toast.success(`Card "${data.title}" deleted`)
        onCloseModal()
      },
      onError: error => {
        toast.error(error)
      }
    }
  )
  const { execute: executeCopy, isLoading: isLoadingCopy } = useAction(
    copyCard,
    {
      onSuccess: data => {
        toast.success(`Card "${data.title}" copied`)
        onCloseModal()
      },
      onError: error => {
        toast.error(error)
      }
    }
  )

  function onCopy() {
    executeCopy({ id: data.id, boardId: params.boardId })
  }

  function onDelete() {
    executeDelete({ id: data.id, boardId: params.boardId })
  }

  return (
    <div className="space-y-2 mt-2">
      <span className="block text-xs font-semibold">Actions</span>
      <Button
        onClick={onCopy}
        disabled={isLoadingCopy}
        variant="gray"
        className="w-full justify-start"
        size="inline"
      >
        <Copy className="w-4 h-4 mr-2" />
        Copy
      </Button>
      <Button
        onClick={onDelete}
        disabled={isLoadingDelete}
        variant="gray"
        className="w-full justify-start"
        size="inline"
      >
        <Trash className="w-4 h-4 mr-2" />
        Delete
      </Button>
    </div>
  )
}

Actions.Skeleton = function ActionsSkeleton() {
  return (
    <div className="space-y-2 mt-2">
      <Skeleton className="w-20 h-4 bg-neutral-200" />
      <Skeleton className="w-full h-8 bg-neutral-200" />
      <Skeleton className="w-full h-8 bg-neutral-200" />
    </div>
  )
}
