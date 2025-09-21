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
import { Eye, Edit, Trash2, ChevronUp, ChevronDown, ChevronsUpDown } from "lucide-react"

interface TicketsTableProps {
  tickets: Ticket[]
  onDelete?: (id: string) => void
  onSort?: (column: string) => void
  sortBy?: string
  sortOrder?: string
}

export function TicketsTable({ tickets, onDelete, onSort, sortBy, sortOrder }: TicketsTableProps) {
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

  const getSortIcon = (column: string) => {
    if (sortBy !== column) {
      return <ChevronsUpDown className="h-4 w-4 text-muted-foreground" />
    }
    return sortOrder === 'DESC' 
      ? <ChevronDown className="h-4 w-4" />
      : <ChevronUp className="h-4 w-4" />
  }

  const SortableHeader = ({ column, children, className }: { 
    column: string, 
    children: React.ReactNode, 
    className?: string 
  }) => (
    <TableHead 
      className={`${className} ${onSort ? 'cursor-pointer hover:bg-muted/50 select-none' : ''}`}
      onClick={() => onSort?.(column)}
    >
      <div className="flex items-center gap-2">
        {children}
        {onSort && getSortIcon(column)}
      </div>
    </TableHead>
  )

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
            <SortableHeader column="status" className="w-32">Status</SortableHeader>
            <SortableHeader column="priority" className="w-32">Priority</SortableHeader>
            <SortableHeader column="created_at" className="w-32">Created</SortableHeader>
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
                </div>
              </TableCell>
              <TableCell>
                <TicketStatusBadge status={ticket.status} />
              </TableCell>
              <TableCell>
                <TicketPriorityBadge priority={ticket.priority} />
              </TableCell>
              <TableCell className="text-sm text-muted-foreground">
                {formatDistanceToNow(new Date(ticket.created_at), { addSuffix: true })}
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
