import { Badge } from "@/components/ui/badge"
import type { QueueJob } from "@/lib/types"

type StatusConfig = {
  label: string
  className: string
}

const STATUS_STYLES = {
  waiting:   { label: "waiting",   className: "bg-gray-100 text-gray-800 hover:bg-gray-100" },
  delayed:   { label: "delayed",   className: "bg-amber-100 text-amber-900 hover:bg-amber-100" },
  completed: { label: "completed", className: "bg-green-100 text-green-800 hover:bg-green-100" },
} satisfies Record<QueueJob["status"], StatusConfig>

interface QueueJobBadgeProps {
  status: QueueJob["status"]
}

export function QueueJobBadge({ status }: QueueJobBadgeProps) {
  const cfg = STATUS_STYLES[status]
  return (
    <Badge variant="secondary" className={cfg.className}>
      {cfg.label}
    </Badge>
  )
}
