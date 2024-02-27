import Image from 'next/image'
import Link from 'next/link'
import LocalFont from 'next/font/local'

import { cn } from '@/lib/utils'

const headingFont = LocalFont({
  src: '../../public/fonts/font.woff2'
})

export function Logo() {
  return (
    <Link href="/">
      <div className="hover:opacity-75 transition items-center gap-x-2 hidden md:flex">
        <Image src="/logo.svg" alt="Logo" height={30} width={30} />
        <span
          className={cn(
            'inline-block text-lg text-neutral-700 pb-1',
            headingFont.className
          )}
        >
          Taskify
        </span>
      </div>
    </Link>
  )
}
