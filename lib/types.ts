export interface Ticket {
  id: string
  title: string
  description: string
  status: "open" | "in-progress" | "resolved" | "closed"
  priority: "low" | "medium" | "high" | "urgent"
  assignee?: string
  reporter: string
  createdAt: string
  updatedAt: string
  tags: string[]
}

export interface CreateTicketRequest {
  title: string
  description: string
  priority: "low" | "medium" | "high" | "urgent"
  assignee?: string
  reporter: string
  tags?: string[]
}

export interface UpdateTicketRequest {
  title?: string
  description?: string
  status?: "open" | "in-progress" | "resolved" | "closed"
  priority?: "low" | "medium" | "high" | "urgent"
  assignee?: string
  tags?: string[]
}

export interface QueueJob {
  id: string
  type: "email-notification" | "status-update" | "assignment-notification"
  data: any
  status: "pending" | "processing" | "completed" | "failed"
  createdAt: string
  processedAt?: string
}
