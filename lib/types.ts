export interface Ticket {
  id: string
  title: string
  description: string
  status: "OPEN" | "IN_PROGRESS" | "RESOLVED"
  priority: "LOW" | "MEDIUM" | "HIGH"
  created_at: string
  updated_at: string
}

export interface CreateTicketRequest {
  title: string
  description: string
  priority: "LOW" | "MEDIUM" | "HIGH"
}

export interface UpdateTicketRequest {
  title?: string
  description?: string
  status?: "OPEN" | "IN_PROGRESS" | "RESOLVED"
  priority?: "LOW" | "MEDIUM" | "HIGH"
}

export interface QueueJob {
  id: string
  job_id: string
  job_type: "TicketNotifyJob" | "TicketSlaJob"
  ticket_id: string
  status: "waiting" | "completed" | "delayed"
  attempts: number
  max_attempts: number
  delay_until?: string
  data?: any
  error_message?: string
  created_at: string
  updated_at: string
  completed_at?: string
}
