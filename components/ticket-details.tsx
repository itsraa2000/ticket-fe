"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { formatDistanceToNow, format } from "date-fns"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { TicketStatusBadge } from "./ticket-status-badge"
import { TicketPriorityBadge } from "./ticket-priority-badge"
import type { Ticket } from "@/lib/types"
import { Edit, Trash2, ArrowLeft, User, Clock, Tag } from "lucide-react"

interface TicketDetailsProps {
  ticket: Ticket
}

export function TicketDetails({ ticket }: TicketDetailsProps) {
  const router = useRouter()
  const [deleting, setDeleting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this ticket? This action cannot be undone.")) {
      return
    }

    setDeleting(true)
    setError(null)

    try {
      const response = await fetch(`/api/tickets/${ticket.id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        router.push("/")
        router.refresh()
      } else {
        const data = await response.json()
        setError(data.error || "Failed to delete ticket")
      }
    } catch (err) {
      setError("Failed to delete ticket")
      console.error("Error deleting ticket:", err)
    } finally {
      setDeleting(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Tickets
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-balance">{ticket.title}</h1>
            <p className="text-sm text-muted-foreground">Ticket #{ticket.id}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" asChild>
            <Link href={`/tickets/${ticket.id}/edit`}>
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Link>
          </Button>
          <Button variant="destructive" onClick={handleDelete} disabled={deleting}>
            <Trash2 className="h-4 w-4 mr-2" />
            {deleting ? "Deleting..." : "Delete"}
          </Button>
        </div>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Description */}
          <Card>
            <CardHeader>
              <CardTitle>Description</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose prose-sm max-w-none">
                <p className="whitespace-pre-wrap text-foreground leading-relaxed">{ticket.description}</p>
              </div>
            </CardContent>
          </Card>

          {/* Tags */}
          {ticket.tags.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Tag className="h-4 w-4" />
                  Tags
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {ticket.tags.map((tag) => (
                    <Badge key={tag} variant="outline">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Status & Priority */}
          <Card>
            <CardHeader>
              <CardTitle>Status & Priority</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Status</span>
                <TicketStatusBadge status={ticket.status} />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Priority</span>
                <TicketPriorityBadge priority={ticket.priority} />
              </div>
            </CardContent>
          </Card>

          {/* People */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-4 w-4" />
                People
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="text-sm font-medium mb-1">Reporter</div>
                <div className="text-sm text-muted-foreground">{ticket.reporter}</div>
              </div>
              <Separator />
              <div>
                <div className="text-sm font-medium mb-1">Assignee</div>
                <div className="text-sm text-muted-foreground">{ticket.assignee || "Unassigned"}</div>
              </div>
            </CardContent>
          </Card>

          {/* Timestamps */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Timeline
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="text-sm font-medium mb-1">Created</div>
                <div className="text-sm text-muted-foreground">{format(new Date(ticket.createdAt), "PPP 'at' p")}</div>
                <div className="text-xs text-muted-foreground">
                  {formatDistanceToNow(new Date(ticket.createdAt), { addSuffix: true })}
                </div>
              </div>
              <Separator />
              <div>
                <div className="text-sm font-medium mb-1">Last Updated</div>
                <div className="text-sm text-muted-foreground">{format(new Date(ticket.updatedAt), "PPP 'at' p")}</div>
                <div className="text-xs text-muted-foreground">
                  {formatDistanceToNow(new Date(ticket.updatedAt), { addSuffix: true })}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
