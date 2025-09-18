import { Badge } from "@/components/ui/badge"
import type { Ticket } from "@/lib/types"

interface TicketPriorityBadgeProps {
  priority: Ticket["priority"]
}

export function TicketPriorityBadge({ priority }: TicketPriorityBadgeProps) {
  const variants = {
    low: "bg-gray-100 text-gray-800 hover:bg-gray-100",
    medium: "bg-blue-100 text-blue-800 hover:bg-blue-100",
    high: "bg-orange-100 text-orange-800 hover:bg-orange-100",
    urgent: "bg-red-100 text-red-800 hover:bg-red-100",
  }

  return (
    <Badge variant="secondary" className={variants[priority]}>
      {priority}
    </Badge>
  )
}
