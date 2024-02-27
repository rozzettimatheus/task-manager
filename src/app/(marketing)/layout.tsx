export default function MarketingLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <div className="h-full bg-zinc-100">
      <main className="pt-40 pb-20 bg-zinc-100">{children}</main>
    </div>
  )
}
