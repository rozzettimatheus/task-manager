import { Metadata } from 'next'
import { auth } from '@clerk/nextjs'

import { OrgControl } from './_components/org-control'
import { stringUtils } from '@/utils/string'

export async function generateMetadata(): Promise<Metadata> {
  const { orgSlug } = auth()
  return {
    title: stringUtils.capitalize(orgSlug ?? 'organization')
  }
}

// dynamically change the organization based on URL
export default function OrganizationIdLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <OrgControl />
      {children}
    </>
  )
}
