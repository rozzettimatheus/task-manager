'use client'

import { useQuery } from '@tanstack/react-query'
import { AuditLog } from '@prisma/client'

import { Dialog, DialogContent } from '@/components/ui/dialog'
import { useCardModal } from '@/hooks/use-card-modal'
import { apiFetch } from '@/lib/fetch'
import { CardWithList } from '@/types'

import { Header } from './header'
import { Description } from './description'
import { Actions } from './actions'
import { Activity } from './activity'

export function CardModal() {
  const id = useCardModal(state => state.id)
  const isOpen = useCardModal(state => state.isOpen)
  const onClose = useCardModal(state => state.onClose)
  const { data: cardData } = useQuery<CardWithList>({
    queryKey: ['card', id],
    queryFn: () => apiFetch(`/api/cards/${id}`),
    enabled: !!id
  })
  const { data: auditLogs } = useQuery<AuditLog[]>({
    queryKey: ['card-logs', id],
    queryFn: () => apiFetch(`/api/cards/${id}/logs`),
    enabled: !!id
  })

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        {!cardData ? <Header.Skeleton /> : <Header data={cardData} />}
        <div className="grid grid-cols-1 gap-1 md:grid-cols-4 md:gap-4">
          <div className="col-span-3">
            <div className="w-full space-y-6">
              {!cardData ? (
                <Description.Skeleton />
              ) : (
                <Description data={cardData} />
              )}
              {!auditLogs ? (
                <Activity.Skeleton />
              ) : (
                <Activity data={auditLogs} />
              )}
            </div>
          </div>
          {!cardData ? <Actions.Skeleton /> : <Actions data={cardData} />}
        </div>
      </DialogContent>
    </Dialog>
  )
}
