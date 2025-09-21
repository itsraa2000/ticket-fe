import { Badge } from "@/components/ui/badge"
import type { Ticket } from "@/lib/types"

interface TicketStatusBadgeProps {
  status: Ticket["status"]
}

export function TicketStatusBadge({ status }: TicketStatusBadgeProps) {
  const variants = {
    OPEN: "bg-blue-100 text-blue-800 hover:bg-blue-100",
    IN_PROGRESS: "bg-yellow-100 text-yellow-800 hover:bg-yellow-100",
    RESOLVED: "bg-green-100 text-green-800 hover:bg-green-100",
  }

  const displayText = {
    OPEN: "Open",
    IN_PROGRESS: "In Progress",
    RESOLVED: "Resolved",
  }

  return (
    <Badge variant="secondary" className={variants[status]}>
      {displayText[status]}
    </Badge>
  )
}
