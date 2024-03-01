'use client'

import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import { Menu } from 'lucide-react'

import { useMobileSidebar } from '@/hooks/use-mobile-sidebar'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent } from '@/components/ui/sheet'
import { Sidebar } from './sidebar'

export function MobileSidebar() {
  const pathname = usePathname()
  // helps React hidration (even with useclient, the component can be rendered in server at first, check if is mounted)
  const [isMounted, setIsMounted] = useState(false)
  const onOpen = useMobileSidebar(state => state.onOpen)
  const onClose = useMobileSidebar(state => state.onClose)
  const isOpen = useMobileSidebar(state => state.isOpen)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  // every pathname changes!
  useEffect(() => {
    onClose()
  }, [pathname, onClose])

  if (!isMounted) {
    return null
  }

  return (
    <>
      <Button
        className="block md:hidden mr-2"
        variant="ghost"
        size="sm"
        onClick={onOpen}
      >
        <Menu className="h-4 w-4" />
      </Button>
      <Sheet open={isOpen} onOpenChange={onClose}>
        <SheetContent side="left" className="p-2 pt-10">
          <Sidebar storageKey="tm-sidebar-mobile-state" />
        </SheetContent>
      </Sheet>
    </>
  )
}
