import { type NextRequest, NextResponse } from "next/server"
import { TicketStore } from "@/lib/ticket-store"
import type { UpdateTicketRequest } from "@/lib/types"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const ticket = TicketStore.getTicketById(params.id)

    if (!ticket) {
      return NextResponse.json({ success: false, error: "Ticket not found" }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      data: ticket,
    })
  } catch (error) {
    console.error("Error fetching ticket:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch ticket" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body: UpdateTicketRequest = await request.json()
    const updatedTicket = TicketStore.updateTicket(params.id, body)

    if (!updatedTicket) {
      return NextResponse.json({ success: false, error: "Ticket not found" }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      data: updatedTicket,
    })
  } catch (error) {
    console.error("Error updating ticket:", error)
    return NextResponse.json({ success: false, error: "Failed to update ticket" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const deleted = TicketStore.deleteTicket(params.id)

    if (!deleted) {
      return NextResponse.json({ success: false, error: "Ticket not found" }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      message: "Ticket deleted successfully",
    })
  } catch (error) {
    console.error("Error deleting ticket:", error)
    return NextResponse.json({ success: false, error: "Failed to delete ticket" }, { status: 500 })
  }
}
