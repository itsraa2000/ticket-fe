import { TicketForm } from "@/components/ticket-form"

export default function NewTicketPage() {
  return (
    <div className="container mx-auto py-8">
      <TicketForm mode="create" />
    </div>
  )
}
