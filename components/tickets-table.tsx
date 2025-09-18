"use client"

import { useState } from "react"
import Link from "next/link"
import { formatDistanceToNow } from "date-fns"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { TicketStatusBadge } from "./ticket-status-badge"
import { TicketPriorityBadge } from "./ticket-priority-badge"
import type { Ticket } from "@/lib/types"
import { Eye, Edit, Trash2 } from "lucide-react"

interface TicketsTableProps {
  tickets: Ticket[]
  onDelete?: (id: string) => void
}

export function TicketsTable({ tickets, onDelete }: TicketsTableProps) {
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const handleDelete = async (id: string) => {
    if (!onDelete) return

    setDeletingId(id)
    try {
      await onDelete(id)
    } finally {
      setDeletingId(null)
    }
  }

  if (tickets.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No tickets found.</p>
      </div>
    )
  }

  return (
    <div className="border rounded-lg">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-20">ID</TableHead>
            <TableHead>Title</TableHead>
            <TableHead className="w-32">Status</TableHead>
            <TableHead className="w-32">Priority</TableHead>
            <TableHead className="w-48">Assignee</TableHead>
            <TableHead className="w-32">Created</TableHead>
            <TableHead className="w-32">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tickets.map((ticket) => (
            <TableRow key={ticket.id} className="hover:bg-muted/50">
              <TableCell className="font-mono text-sm">#{ticket.id}</TableCell>
              <TableCell>
                <div>
                  <Link href={`/tickets/${ticket.id}`} className="font-medium hover:text-primary transition-colors">
                    {ticket.title}
                  </Link>
                  <p className="text-sm text-muted-foreground mt-1 line-clamp-1">{ticket.description}</p>
                  {ticket.tags.length > 0 && (
                    <div className="flex gap-1 mt-2">
                      {ticket.tags.slice(0, 3).map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                      {ticket.tags.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{ticket.tags.length - 3}
                        </Badge>
                      )}
                    </div>
                  )}
                </div>
              </TableCell>
              <TableCell>
                <TicketStatusBadge status={ticket.status} />
              </TableCell>
              <TableCell>
                <TicketPriorityBadge priority={ticket.priority} />
              </TableCell>
              <TableCell>
                {ticket.assignee ? (
                  <div className="text-sm">
                    <p className="font-medium">{ticket.assignee.split("@")[0]}</p>
                    <p className="text-muted-foreground">{ticket.assignee}</p>
                  </div>
                ) : (
                  <span className="text-muted-foreground">Unassigned</span>
                )}
              </TableCell>
              <TableCell className="text-sm text-muted-foreground">
                {formatDistanceToNow(new Date(ticket.createdAt), { addSuffix: true })}
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm" asChild>
                    <Link href={`/tickets/${ticket.id}`}>
                      <Eye className="h-4 w-4" />
                    </Link>
                  </Button>
                  <Button variant="ghost" size="sm" asChild>
                    <Link href={`/tickets/${ticket.id}/edit`}>
                      <Edit className="h-4 w-4" />
                    </Link>
                  </Button>
                  {onDelete && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(ticket.id)}
                      disabled={deletingId === ticket.id}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
