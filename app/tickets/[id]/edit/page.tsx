"use client"

import { TicketForm } from "@/components/ticket-form"
import { useTicket } from "@/hooks/use-ticket"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { AlertCircle, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { useParams } from "next/navigation"

export default function EditTicketPage() {
  const {id} = useParams<{id : string }>();
  return <EditTicketPageClient id={id} />
}

function EditTicketPageClient({ id }: { id: string }) {
  const { ticket, loading, error, refetch } = useTicket(id)

  if (loading) {
    return (
      <div className="container mx-auto py-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="mt-2 text-muted-foreground">Loading ticket...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error || !ticket) {
    return (
      <div className="container mx-auto py-8">
        <div className="max-w-md mx-auto">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error || "Ticket not found"}</AlertDescription>
          </Alert>
          <div className="flex gap-2 mt-4">
            <Button onClick={refetch} variant="outline">
              Try Again
            </Button>
            <Button asChild>
              <Link href="/">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Tickets
              </Link>
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8">
      <TicketForm ticket={ticket} mode="edit" />
    </div>
  )
}
