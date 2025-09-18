import { type NextRequest, NextResponse } from "next/server"
import { TicketStore } from "@/lib/ticket-store"
import type { CreateTicketRequest } from "@/lib/types"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get("status")
    const priority = searchParams.get("priority")
    const search = searchParams.get("search")

    let tickets

    if (search) {
      tickets = TicketStore.searchTickets(search)
    } else if (status) {
      tickets = TicketStore.getTicketsByStatus(status)
    } else if (priority) {
      tickets = TicketStore.getTicketsByPriority(priority)
    } else {
      tickets = TicketStore.getAllTickets()
    }

    return NextResponse.json({
      success: true,
      data: tickets,
      count: tickets.length,
    })
  } catch (error) {
    console.error("Error fetching tickets:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch tickets" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body: CreateTicketRequest = await request.json()

    // Validate required fields
    if (!body.title || !body.description || !body.reporter) {
      return NextResponse.json(
        { success: false, error: "Missing required fields: title, description, reporter" },
        { status: 400 },
      )
    }

    const newTicket = TicketStore.createTicket(body)

    return NextResponse.json(
      {
        success: true,
        data: newTicket,
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Error creating ticket:", error)
    return NextResponse.json({ success: false, error: "Failed to create ticket" }, { status: 500 })
  }
}
