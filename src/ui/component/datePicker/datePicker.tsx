import { useState, type FC, useCallback, useEffect, useRef } from 'react'
import type { DayPickerProps } from '@/ui/component/dayPicker/dayPicker'
import { DayPicker } from '@/ui/component/dayPicker/dayPicker'
import { Popover } from '@/ui/component/popover/popover'
import { DateInput } from '@/ui/component/dateInput/dateInput'

export const DatePicker: FC<DayPickerProps> = dayPickerProps => {
  const { selected, onSelect } = dayPickerProps
  const [open, setOpen] = useState(false)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const handleOpenChange = useCallback(() => {
    setOpen(state => !state)
  }, [])

  useEffect(
    () => () => {
      timerRef.current && clearTimeout(timerRef.current)
    },
    []
  )

  const handleSelect = useCallback(
    (date?: Date) => {
      onSelect(date)

      timerRef.current = setTimeout(() => {
        handleOpenChange()
      }, 600)
    },
    [onSelect, handleOpenChange]
  )

  return (
    <Popover
      content={<DayPicker {...dayPickerProps} onSelect={handleSelect} />}
      onOpenChange={handleOpenChange}
      open={open}
      trigger={<DateInput date={selected} />}
    />
  )
}
