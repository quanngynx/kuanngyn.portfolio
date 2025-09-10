"use client"

import * as React from "react"
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react"
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  isSameMonth,
  isSameDay,
  addMonths,
  subMonths,
} from "date-fns"
import { toZonedTime, fromZonedTime, formatInTimeZone } from "date-fns-tz"
import { vi } from "date-fns/locale/vi"
import { cn } from "@/common/utils/ui"
import { Button } from "@/common/components/atoms/button"

export interface CalendarProps {
  className?: string
  selected?: Date | Date[]
  onSelect?: (date: Date | Date[] | undefined) => void
  disabled?: (date: Date) => boolean
  mode?: "single" | "multiple" | "range"
  timezone?: string
}

function Calendar({
  className,
  selected,
  onSelect,
  disabled,
  mode = "single",
  timezone = Intl.DateTimeFormat().resolvedOptions().timeZone,
}: CalendarProps) {
  const getInitialDate = () => {
    const baseDate = (Array.isArray(selected) ? selected[0] : selected) || new Date()
    return toZonedTime(baseDate, timezone)
  }

  const [currentMonth, setCurrentMonth] = React.useState(getInitialDate())

  const isDateSelectedTz = (date: Date) => {
    if (!selected) return false

    if (mode === "single") {
      if (!(selected instanceof Date)) return false
      const selectedTz = toZonedTime(selected, timezone)
      const dateTz = toZonedTime(date, timezone)
      return isSameDay(dateTz, selectedTz)
    } else if (mode === "multiple") {
      if (!Array.isArray(selected)) return false
      return selected.some((d) => {
        const selectedTz = toZonedTime(d, timezone)
        const dateTz = toZonedTime(date, timezone)
        return isSameDay(dateTz, selectedTz)
      })
    } else if (mode === "range") {
      if (!Array.isArray(selected) || selected.length === 0) return false
      if (selected.length === 1) {
        const selectedTz = toZonedTime(selected[0], timezone)
        const dateTz = toZonedTime(date, timezone)
        return isSameDay(dateTz, selectedTz)
      }
      return selected.some((d) => {
        const selectedTz = toZonedTime(d, timezone)
        const dateTz = toZonedTime(date, timezone)
        return isSameDay(dateTz, selectedTz)
      })
    }
    return false
  }

  const isDateInRange = (date: Date) => {
    if (mode !== "range" || !Array.isArray(selected) || selected.length !== 2) return false
    const [start, end] = selected.map((d) => toZonedTime(d, timezone)).sort((a, b) => a.getTime() - b.getTime())
    const dateTz = toZonedTime(date, timezone)
    return dateTz >= start && dateTz <= end
  }

  const handleDateClick = (date: Date) => {
    if (disabled && disabled(date)) return
    if (!onSelect) return

    const utcDate = fromZonedTime(date, timezone)

    if (mode === "single") {
      onSelect(utcDate)
    } else if (mode === "multiple") {
      const currentSelected = Array.isArray(selected) ? selected : []
      const isAlreadySelected = currentSelected.some((d) => {
        const selectedTz = toZonedTime(d, timezone)
        const dateTz = toZonedTime(date, timezone)
        return isSameDay(dateTz, selectedTz)
      })

      if (isAlreadySelected) {
        onSelect(
          currentSelected.filter((d) => {
            const selectedTz = toZonedTime(d, timezone)
            const dateTz = toZonedTime(date, timezone)
            return !isSameDay(dateTz, selectedTz)
          }),
        )
      } else {
        onSelect([...currentSelected, utcDate])
      }
    } else if (mode === "range") {
      const currentSelected = Array.isArray(selected) ? selected : []

      if (currentSelected.length === 0 || currentSelected.length === 2) {
        onSelect([utcDate])
      } else if (currentSelected.length === 1) {
        onSelect([currentSelected[0], utcDate])
      }
    }
  }

  const monthStartTz = toZonedTime(startOfMonth(currentMonth), timezone)
  const monthEndTz = toZonedTime(endOfMonth(monthStartTz), timezone)
  const startDate = startOfWeek(monthStartTz, { locale: vi })
  const endDate = endOfWeek(monthEndTz, { locale: vi })

  const dateFormat = "d"
  const rows = []
  let days = []
  let day = startDate
  let formattedDate = ""

  // Generate calendar grid
  while (day <= endDate) {
    for (let i = 0; i < 7; i++) {
      formattedDate = format(day, dateFormat)
      const cloneDay = day
      const isCurrentMonth = isSameMonth(day, monthStartTz)
      const isSelected = isDateSelectedTz(day)
      const isInRange = isDateInRange(day)
      const isDisabled = disabled && disabled(day)
      const isTodayDate = isSameDay(toZonedTime(new Date(), timezone), day)

      days.push(
        <div
          key={day.toString()}
          className={cn(
            "relative p-0 text-center text-sm focus-within:relative focus-within:z-20",
            isSelected && "bg-accent rounded-md",
          )}
        >
          <Button
            variant="ghost"
            className={cn(
              "h-10 w-10 p-0 font-normal hover:bg-accent transition-all duration-200",
              !isCurrentMonth && "text-muted-foreground opacity-40",
              isSelected && "bg-blue-600 text-white hover:bg-blue-700 shadow-sm",
              isInRange && !isSelected && mode === "range" && "bg-blue-100 dark:bg-blue-900/30",
              isTodayDate &&
                !isSelected &&
                "bg-accent text-accent-foreground font-semibold ring-2 ring-blue-200 dark:ring-blue-800",
              isDisabled && "text-muted-foreground opacity-30 cursor-not-allowed",
            )}
            onClick={() => handleDateClick(cloneDay)}
            disabled={isDisabled}
          >
            {formattedDate}
          </Button>
        </div>,
      )
      day = addDays(day, 1)
    }
    rows.push(
      <div className="flex w-full mt-1" key={day.toString()}>
        {days}
      </div>,
    )
    days = []
  }

  const weekDays = ["T2", "T3", "T4", "T5", "T6", "T7", "CN"]

  return (
    <div className={cn("p-4", className)}>
      <div className="space-y-4">
        {/* Header with navigation */}
        <div className="flex justify-center pt-1 relative items-center mb-4">
          <Button
            variant="outline"
            className="h-8 w-8 bg-transparent p-0 opacity-70 hover:opacity-100 hover:bg-accent transition-all duration-200 absolute left-1"
            onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
          >
            <ChevronLeftIcon className="h-4 w-4" />
          </Button>

          <div className="text-base font-semibold text-foreground">
            {formatInTimeZone(currentMonth, timezone, "MMMM yyyy", { locale: vi })}
          </div>

          <Button
            variant="outline"
            className="h-8 w-8 bg-transparent p-0 opacity-70 hover:opacity-100 hover:bg-accent transition-all duration-200 absolute right-1"
            onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
          >
            <ChevronRightIcon className="h-4 w-4" />
          </Button>
        </div>

        {/* Calendar grid */}
        <div className="w-full border-collapse space-y-1">
          {/* Weekday headers */}
          <div className="flex mb-2">
            {weekDays.map((day) => (
              <div
                key={day}
                className="text-muted-foreground rounded-md w-10 h-8 font-medium text-xs text-center flex items-center justify-center"
              >
                {day}
              </div>
            ))}
          </div>

          {/* Calendar rows */}
          {rows}
        </div>
      </div>
    </div>
  )
}

Calendar.displayName = "Calendar"

export { Calendar }
