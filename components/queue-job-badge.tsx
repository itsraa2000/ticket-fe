import { Badge } from "@/components/ui/badge"
import type { QueueJob } from "@/lib/types"

interface QueueJobBadgeProps {
  status: QueueJob["status"]
}

export function QueueJobBadge({ status }: QueueJobBadgeProps) {
  const variants = {
    pending: "bg-gray-100 text-gray-800 hover:bg-gray-100",
    processing: "bg-blue-100 text-blue-800 hover:bg-blue-100",
    completed: "bg-green-100 text-green-800 hover:bg-green-100",
    failed: "bg-red-100 text-red-800 hover:bg-red-100",
  }

  return (
    <Badge variant="secondary" className={variants[status]}>
      {status}
    </Badge>
  )
}
