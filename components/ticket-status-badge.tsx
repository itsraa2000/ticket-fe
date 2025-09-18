import { Badge } from "@/components/ui/badge"
import type { Ticket } from "@/lib/types"

interface TicketStatusBadgeProps {
  status: Ticket["status"]
}

export function TicketStatusBadge({ status }: TicketStatusBadgeProps) {
  const variants = {
    open: "bg-blue-100 text-blue-800 hover:bg-blue-100",
    "in-progress": "bg-yellow-100 text-yellow-800 hover:bg-yellow-100",
    resolved: "bg-green-100 text-green-800 hover:bg-green-100",
    closed: "bg-gray-100 text-gray-800 hover:bg-gray-100",
  }

  return (
    <Badge variant="secondary" className={variants[status]}>
      {status.replace("-", " ")}
    </Badge>
  )
}
