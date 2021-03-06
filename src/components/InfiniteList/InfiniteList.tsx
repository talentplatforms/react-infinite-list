import React, { useState } from 'react'

type Props = React.HTMLAttributes<HTMLUListElement> & {
  children: React.ReactNodeArray
  itemHeight: number
  itemsToAddAmount?: number
  cleanUpThreshold?: number
}

type ItemsToRenderReducer = {
  payload?: JSX.Element[]
  action: 'push' | 'set' | 'unshift'
}

const InfiniteList = ({
  children,
  itemHeight,
  itemsToAddAmount = 10,
  cleanUpThreshold = 30,
  ...props
}: Props): JSX.Element => {
  const [mappedItems, setMappedItems] = React.useState<Array<JSX.Element>>([])
  const itemsToRenderReducer = (
    state: Array<JSX.Element>,
    { payload, action }: ItemsToRenderReducer
  ): Array<JSX.Element> => {
    switch (action) {
      case 'push':
        return [...state, ...(payload || [])]
      case 'unshift':
        return [...(payload || []), ...state]
      case 'set':
        return payload || []
      default:
        throw new Error('Unsupported reducer action.')
    }
  }
  const [itemsToRender, itemsToRenderDispatch] = React.useReducer(itemsToRenderReducer, [])
  const bottomTriggerRef = React.useRef<HTMLLIElement>(null)
  const topTriggerRef = React.useRef<HTMLLIElement>(null)
  const listRef = React.useRef<HTMLUListElement>(null)
  const [lastOperation, setLastOperation] = useState<'append' | 'prepend'>('append')

  const pushNextItemsToRender = React.useCallback(() => {
    const nextKey = parseInt(itemsToRender[itemsToRender.length - 1].key as string, itemsToAddAmount) + 1
    const nextLimit =
      nextKey + itemsToAddAmount > mappedItems.length - 1 ? mappedItems.length : nextKey + itemsToAddAmount
    itemsToRenderDispatch({ action: 'push', payload: mappedItems.slice(nextKey, nextLimit) })
    setLastOperation('append')
  }, [mappedItems, itemsToRender, itemsToAddAmount])

  const pushPreviousItemsToRender = React.useCallback(() => {
    const startKey = parseInt(itemsToRender[0].key as string, itemsToAddAmount)
    const endKey = startKey - itemsToAddAmount < 0 ? 0 : startKey - itemsToAddAmount

    if (startKey == 0 && endKey == 0) {
      return
    }

    const payload = mappedItems.slice(endKey, startKey)
    itemsToRenderDispatch({ action: 'unshift', payload })

    if (listRef.current) {
      listRef.current.scrollTo({ top: payload.length * itemHeight })
    }

    setLastOperation('prepend')
  }, [mappedItems, itemsToRender, listRef, itemsToAddAmount, itemHeight])

  const handleIntersect = React.useCallback(
    (entries: IntersectionObserverEntry[]) => {
      entries.forEach(entry => {
        const target = entry.target as HTMLElement
        if (target.dataset.listTrigger == 'bottom' && entry.isIntersecting) {
          pushNextItemsToRender()
        }

        if (target.dataset.listTrigger == 'top' && entry.isIntersecting) {
          pushPreviousItemsToRender()
        }
      })
    },
    [mappedItems, itemsToRender, listRef, itemsToAddAmount]
  )

  React.useEffect(() => {
    const mappedChildren = children.map((child, index) => {
      return <li key={index}>{child}</li>
    })

    setMappedItems(mappedChildren)
    itemsToRenderDispatch({ action: 'push', payload: mappedChildren.slice(0, itemsToAddAmount) })
  }, [children, itemsToAddAmount])

  React.useEffect(() => {
    const options = {
      root: null,
      rootMargin: '0px',
      threshold: 0.25,
    }

    const observer = new IntersectionObserver(handleIntersect, options)
    if (bottomTriggerRef.current) {
      observer.observe(bottomTriggerRef.current)
    }

    if (topTriggerRef.current) {
      observer.observe(topTriggerRef.current)
    }

    return (): void => {
      observer.disconnect()
    }
  }, [topTriggerRef, bottomTriggerRef, mappedItems, itemsToRender, listRef, itemsToAddAmount])

  React.useEffect(() => {
    if (itemsToRender.length > cleanUpThreshold) {
      if (lastOperation == 'append' && listRef.current) {
        const lastIndex = parseInt((itemsToRender[itemsToRender.length - 1].key as string) || '0', itemsToAddAmount)
        itemsToRenderDispatch({ action: 'set', payload: itemsToRender.slice(itemsToAddAmount, lastIndex) })
      }

      if (lastOperation == 'prepend') {
        itemsToRenderDispatch({ action: 'set', payload: itemsToRender.slice(0, itemsToAddAmount * 2) })
      }
    }
  }, [lastOperation, itemsToRender, listRef, itemHeight, itemsToAddAmount, cleanUpThreshold])

  return (
    <ul ref={listRef} {...props}>
      <li ref={topTriggerRef} data-list-trigger="top"></li>
      {itemsToRender}
      <li ref={bottomTriggerRef} data-list-trigger="bottom"></li>
    </ul>
  )
}

export default InfiniteList
