import { ActivityIcon } from 'lucide-react'
import { AuditLog } from '@prisma/client'

import { Skeleton } from '@/components/ui/skeleton'
import { ActivityItem } from '@/components/activity-item'

type ActivityProps = {
  data: AuditLog[]
}

export function Activity({ data }: ActivityProps) {
  return (
    <div className="flex items-start gap-x-3 w-full">
      <ActivityIcon className="h-5 w-5 mt-0.5 text-neutral-700" />
      <div className="w-full">
        <p className="font-semibold text-neutral-700 mb-2">Activity</p>
        <ol className="mt-2 space-y-4">
          {data.map(item => (
            <ActivityItem key={item.id} data={item} />
          ))}
        </ol>
      </div>
    </div>
  )
}

Activity.Skeleton = function ActivitySkeleton() {
  return (
    <div className="flex items-start gap-x-3 w-full">
      <Skeleton className="bg-neutral-200 w-6 h-6" />
      <div className="w-full">
        <Skeleton className="w-24 h-6 mb-2 bg-neutral-200" />
        <Skeleton className="w-full h-10 mb-2 bg-neutral-200" />
      </div>
    </div>
  )
}
