import { Card } from '@prisma/client'

type CardItemProps = {
  data: Card
  index: number
}

export function CardItem({ data }: CardItemProps) {
  return (
    <div className="truncate border-2 border-transparent hover:border-black py-2 px-3 text-sm bg-white rounded-md shadow-sm">
      {data.title}
    </div>
  )
}
