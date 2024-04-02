'use client'

import { useEffect, useState } from 'react'
import { DragDropContext, Droppable } from '@hello-pangea/dnd'

import { useAction } from '@/hooks/use-action'
import { updateListOrder } from '@/actions/update-list-order'
import { ListWithCards } from '@/types'

import { ListForm } from './list-form'
import { ListItem } from './list-item'
import { toast } from 'sonner'
import { updateCardOrder } from '@/actions/update-card-order'

type ListContainerProps = {
  data: ListWithCards[]
  boardId: string
}

function reorder<T>(list: T[], startIndex: number, endIndex: number) {
  const result = Array.from(list)
  const [removed] = result.splice(startIndex, 1)
  result.splice(endIndex, 0, removed)
  return result
}

export function ListContainer({ boardId, data }: ListContainerProps) {
  const [orderedData, setOrderedData] = useState(data)
  const { execute: executeUpdateListOrder } = useAction(updateListOrder, {
    onSuccess: () => {
      toast.success('List reordered')
    },
    onError: error => {
      toast.error(error)
    }
  })
  const { execute: executeUpdateCardOrder } = useAction(updateCardOrder, {
    onSuccess: () => {
      toast.success('Card reordered')
    },
    onError: error => {
      toast.error(error)
    }
  })

  function onDragEnd(result: any) {
    const { destination, source, type } = result
    if (!destination) {
      return
    }
    // dropped in same position
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return
    }
    // user moves a list
    if (type === 'list') {
      const items = reorder(orderedData, source.index, destination.index).map(
        (data, index) => ({
          ...data,
          order: index
        })
      )
      setOrderedData(items)
      executeUpdateListOrder({ items, boardId })
    }

    if (type === 'card') {
      let newOrderData = [...orderedData]
      // source and destination list
      const sourceList = newOrderData.find(
        list => list.id === source.droppableId
      )
      const destList = newOrderData.find(
        list => list.id === destination.droppableId
      )

      if (!sourceList || !destList) {
        return
      }

      if (!sourceList.cards) {
        sourceList.cards = []
      }
      if (!destList.cards) {
        destList.cards = []
      }

      // Moving the card in the same list
      if (source.droppableId === destination.droppableId) {
        const reorderedCards = reorder(
          sourceList.cards,
          source.index,
          destination.index
        )
        reorderedCards.forEach((card, idx) => {
          card.order = idx
        })
        sourceList.cards = reorderedCards
        setOrderedData(newOrderData)
        executeUpdateCardOrder({
          boardId,
          items: reorderedCards
        })
      } else {
        // another list
        // Remove card from the source list
        const [movedCard] = sourceList.cards.splice(source.index, 1)

        // Assign the new listId to the moved card
        movedCard.listId = destination.droppableId

        // Add card to the destination list
        destList.cards.splice(destination.index, 0, movedCard)

        // Reorder the cards order
        sourceList.cards.forEach((card, idx) => {
          card.order = idx
        })

        destList.cards.forEach((card, idx) => {
          card.order = idx
        })

        setOrderedData(newOrderData)
        executeUpdateCardOrder({
          boardId,
          items: destList.cards
        })
      }
    }
  }

  useEffect(() => {
    setOrderedData(data)
  }, [data])

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="lists" type="list" direction="horizontal">
        {provided => (
          <ol
            {...provided.droppableProps}
            ref={provided.innerRef}
            className="flex gap-x-3 h-full"
          >
            {orderedData.map((list, index) => {
              return <ListItem key={list.id} index={index} data={list} />
            })}
            {provided.placeholder}
            <ListForm />
            <div className="flex-shrink-0 w-1"></div>
          </ol>
        )}
      </Droppable>
    </DragDropContext>
  )
}
