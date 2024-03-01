import { OrgControl } from './_components/org-control'

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
