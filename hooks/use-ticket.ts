"use client"

import { useState, useEffect } from "react"
import type { Ticket } from "@/lib/types"

export function useTicket(id: string) {
  const [ticket, setTicket] = useState<Ticket | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchTicket = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/tickets/${id}`)
      const data = await response.json()

      if (data.success) {
        setTicket(data.data)
        setError(null)
      } else {
        setError(data.error || "Failed to fetch ticket")
      }
    } catch (err) {
      setError("Failed to fetch ticket")
      console.error("Error fetching ticket:", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (id) {
      fetchTicket()
    }
  }, [id])

  return {
    ticket,
    loading,
    error,
    refetch: fetchTicket,
  }
}
