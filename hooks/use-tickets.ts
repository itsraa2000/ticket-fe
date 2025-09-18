"use client"

import { useState, useEffect } from "react"
import type { Ticket } from "@/lib/types"

interface UseTicketsOptions {
  status?: string
  priority?: string
  search?: string
}

export function useTickets(options: UseTicketsOptions = {}) {
  const [tickets, setTickets] = useState<Ticket[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchTickets = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams()

      if (options.status) params.append("status", options.status)
      if (options.priority) params.append("priority", options.priority)
      if (options.search) params.append("search", options.search)

      const response = await fetch(`/api/tickets?${params.toString()}`)
      const data = await response.json()

      if (data.success) {
        setTickets(data.data)
        setError(null)
      } else {
        setError(data.error || "Failed to fetch tickets")
      }
    } catch (err) {
      setError("Failed to fetch tickets")
      console.error("Error fetching tickets:", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTickets()
  }, [options.status, options.priority, options.search])

  return {
    tickets,
    loading,
    error,
    refetch: fetchTickets,
  }
}
