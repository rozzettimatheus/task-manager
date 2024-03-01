'use client'

import { useEffect } from 'react'
import { useParams } from 'next/navigation'
import { useOrganizationList } from '@clerk/nextjs'

type Params = {
  organizationId: string
}

// Will not return a component, but manage the current active organization
export function OrgControl() {
  const params = useParams<Params>()
  const { setActive } = useOrganizationList()

  useEffect(() => {
    if (!setActive) return
    setActive({
      organization: params.organizationId as string
    })
  }, [setActive, params.organizationId])

  return null
}
