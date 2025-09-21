import { Badge } from "@/components/ui/badge"
import type { Ticket } from "@/lib/types"

interface TicketPriorityBadgeProps {
  priority: Ticket["priority"]
}

export function TicketPriorityBadge({ priority }: TicketPriorityBadgeProps) {
  const variants = {
    LOW: "bg-gray-100 text-gray-800 hover:bg-gray-100",
    MEDIUM: "bg-blue-100 text-blue-800 hover:bg-blue-100",
    HIGH: "bg-red-100 text-red-800 hover:bg-red-100",
  }

  const displayText = {
    LOW: "Low",
    MEDIUM: "Medium",
    HIGH: "High",
  }

  return (
    <Badge variant="secondary" className={variants[priority]}>
      {displayText[priority]}
    </Badge>
  )
}
