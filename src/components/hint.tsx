import * as Tooltip from '@/components/ui/tooltip'

type HintProps = {
  children: React.ReactNode
  description: string
  side?: 'left' | 'right' | 'top' | 'bottom'
  sideOffset?: number
}

export function Hint({
  children,
  description,
  side = 'bottom',
  sideOffset = 0
}: HintProps) {
  return (
    <Tooltip.TooltipProvider>
      <Tooltip.Tooltip delayDuration={0}>
        <Tooltip.TooltipTrigger>{children}</Tooltip.TooltipTrigger>
        <Tooltip.TooltipContent
          side={side}
          sideOffset={sideOffset}
          className="text-xs max-w-[220px] break-words"
        >
          {description}
        </Tooltip.TooltipContent>
      </Tooltip.Tooltip>
    </Tooltip.TooltipProvider>
  )
}
