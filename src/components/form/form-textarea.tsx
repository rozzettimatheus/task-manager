'use client'

import { forwardRef } from 'react'
import { useFormStatus } from 'react-dom'

import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'

import { FormErrors } from './form-errors'
import { Textarea } from '../ui/textarea'

type FormTextAreaProps = {
  id: string
  label?: string
  placeholder?: string
  required?: boolean
  disabled?: boolean
  errors?: Record<string, string[] | undefined>
  className?: string
  onBlur?: () => void
  onClick?: () => void
  onKeyDown?: React.KeyboardEventHandler<HTMLTextAreaElement>
  defaultValue?: string
}

export const FormTextArea = forwardRef<HTMLTextAreaElement, FormTextAreaProps>(
  (
    {
      id,
      label,
      placeholder,
      required,
      disabled,
      errors,
      className,
      defaultValue = '',
      onBlur,
      onClick,
      onKeyDown
    },
    ref
  ) => {
    const { pending } = useFormStatus()

    return (
      <div className="space-y-2 w-full">
        <div className="space-y-1 w-full">
          {label ? (
            <Label
              htmlFor={id}
              className="text-xs font-semibold text-neutral-700"
            >
              {label}
            </Label>
          ) : null}
          <Textarea
            onBlur={onBlur}
            onKeyDown={onKeyDown}
            onClick={onClick}
            defaultValue={defaultValue}
            ref={ref}
            required={required}
            id={id}
            name={id}
            placeholder={placeholder}
            disabled={pending || disabled}
            className={cn(
              'resize-none focus-visible:ring-0 focus-visible:ring-offset-0 ring-0 focus:ring-0 outline-none shadow-sm',
              className
            )}
            aria-describedby={`${id}-error`}
          />
        </div>
        <FormErrors id={id} errors={errors} />
      </div>
    )
  }
)

FormTextArea.displayName = 'FormTextArea'
