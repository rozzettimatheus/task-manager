import { Footer } from './_components/footer'
import { Navbar } from './_components/navbar'

export default function MarketingLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <div className="h-full bg-zinc-100">
      <Navbar />
      <main className="h-full pt-40 pb-20 bg-zinc-100">{children}</main>
      <Footer />
    </div>
  )
}
