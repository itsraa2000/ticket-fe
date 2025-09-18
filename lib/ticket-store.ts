import type { Ticket, CreateTicketRequest, UpdateTicketRequest } from "./types"

// In-memory storage for tickets (in production, this would be a database)
let tickets: Ticket[] = [
  {
    id: "1",
    title: "Login page not loading",
    description: "Users are unable to access the login page. The page returns a 500 error.",
    status: "open",
    priority: "high",
    assignee: "john.doe@example.com",
    reporter: "jane.smith@example.com",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    tags: ["bug", "frontend", "urgent"],
  },
  {
    id: "2",
    title: "Add dark mode support",
    description: "Implement dark mode theme across the application for better user experience.",
    status: "in-progress",
    priority: "medium",
    assignee: "alice.johnson@example.com",
    reporter: "bob.wilson@example.com",
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    updatedAt: new Date().toISOString(),
    tags: ["feature", "ui", "enhancement"],
  },
]

export class TicketStore {
  static getAllTickets(): Ticket[] {
    return tickets
  }

  static getTicketById(id: string): Ticket | undefined {
    return tickets.find((ticket) => ticket.id === id)
  }

  static createTicket(data: CreateTicketRequest): Ticket {
    const newTicket: Ticket = {
      id: Date.now().toString(),
      title: data.title,
      description: data.description,
      status: "open",
      priority: data.priority,
      assignee: data.assignee,
      reporter: data.reporter,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      tags: data.tags || [],
    }

    tickets.push(newTicket)
    return newTicket
  }

  static updateTicket(id: string, data: UpdateTicketRequest): Ticket | null {
    const ticketIndex = tickets.findIndex((ticket) => ticket.id === id)
    if (ticketIndex === -1) return null

    const updatedTicket = {
      ...tickets[ticketIndex],
      ...data,
      updatedAt: new Date().toISOString(),
    }

    tickets[ticketIndex] = updatedTicket
    return updatedTicket
  }

  static deleteTicket(id: string): boolean {
    const initialLength = tickets.length
    tickets = tickets.filter((ticket) => ticket.id !== id)
    return tickets.length < initialLength
  }

  static getTicketsByStatus(status: string): Ticket[] {
    return tickets.filter((ticket) => ticket.status === status)
  }

  static getTicketsByPriority(priority: string): Ticket[] {
    return tickets.filter((ticket) => ticket.priority === priority)
  }

  static searchTickets(query: string): Ticket[] {
    const lowercaseQuery = query.toLowerCase()
    return tickets.filter(
      (ticket) =>
        ticket.title.toLowerCase().includes(lowercaseQuery) ||
        ticket.description.toLowerCase().includes(lowercaseQuery) ||
        ticket.tags.some((tag) => tag.toLowerCase().includes(lowercaseQuery)),
    )
  }
}
