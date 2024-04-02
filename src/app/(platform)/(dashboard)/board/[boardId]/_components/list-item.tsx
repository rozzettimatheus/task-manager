'use client'

import { useRef, useState } from 'react'
import { Draggable, Droppable } from '@hello-pangea/dnd'

import { ListWithCards } from '@/types'
import { cn } from '@/lib/utils'

import { ListHeader } from './list-header'
import { CardForm } from './card-form'
import { CardItem } from './card-item'

type ListItemProps = {
  data: ListWithCards
  index: number
}

export function ListItem({ data, index }: ListItemProps) {
  const [isEditing, setIsEditing] = useState(false)
  const textAreaRef = useRef<React.ElementRef<'textarea'>>(null)

  function disableEditing() {
    setIsEditing(false)
  }

  function enableEditing() {
    setIsEditing(true)
    setTimeout(() => {
      textAreaRef.current?.focus()
    })
  }

  return (
    <Draggable draggableId={data.id} index={index}>
      {provided => (
        <li
          {...provided.draggableProps}
          ref={provided.innerRef}
          className="shrink-0 h-full w-[272px] select-none"
        >
          <div
            {...provided.dragHandleProps}
            className="w-full rounded-md bg-[#f1f2f4] shadow-sm pb-2"
          >
            <ListHeader data={data} onAddCard={enableEditing} />
            <Droppable droppableId={data.id} type="card">
              {provided => (
                <ol
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className={cn(
                    'mx-1 px-1 py-0.5 flex flex-col gap-y-2',
                    data?.cards?.length > 0 ? 'mt-2' : 'mt-0'
                  )}
                >
                  {data.cards?.map((card, index) => (
                    <CardItem index={index} key={card.id} data={card} />
                  ))}
                  {provided.placeholder}
                </ol>
              )}
            </Droppable>
            <CardForm
              listId={data.id}
              ref={textAreaRef}
              isEditing={isEditing}
              enableEditing={enableEditing}
              disableEditing={disableEditing}
            />
          </div>
        </li>
      )}
    </Draggable>
  )
}
