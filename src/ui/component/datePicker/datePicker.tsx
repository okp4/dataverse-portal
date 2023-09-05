import { useState, type FC, useCallback } from 'react'
import type { DayPickerProps } from '@/ui/component/dayPicker/dayPicker'
import { DayPicker } from '@/ui/component/dayPicker/dayPicker'
import { Popover } from '@/ui/component/popover/popover'
import { DateInput } from '@/ui/component/dateInput/dateInput'

export const DatePicker: FC<DayPickerProps> = dayPickerProps => {
  const { selected, onSelect } = dayPickerProps
  const [open, setOpen] = useState(false)

  const handleOpenChange = useCallback(() => {
    setOpen(state => !state)
  }, [])

  const handleSelect = useCallback(
    (date?: Date) => {
      onSelect(date)

      handleOpenChange()
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
