'use client'

import { toast } from 'sonner'

import { stripeRedirect } from '@/actions/stripe-redirect'
import { Button } from '@/components/ui/button'
import { useAction } from '@/hooks/use-action'
import { useProModal } from '@/hooks/use-pro-modal'

type SubscriptionButtonProps = {
  isPro: boolean
}

export function SubscriptionButton({ isPro }: SubscriptionButtonProps) {
  const onOpenProModal = useProModal(state => state.onOpen)
  const { execute, isLoading } = useAction(stripeRedirect, {
    onSuccess: url => {
      window.location.href = url
    },
    onError: error => {
      toast.error(error)
    }
  })

  function onStripeAction() {
    if (isPro) {
      execute({})
    } else {
      onOpenProModal()
    }
  }

  return (
    <Button onClick={onStripeAction} disabled={isLoading} variant="primary">
      {isPro ? 'Manage subscription' : 'Upgrade to pro'}
    </Button>
  )
}
