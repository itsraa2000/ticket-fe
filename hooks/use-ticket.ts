"use client"

import { useState, useEffect } from "react"
import type { Ticket } from "@/lib/types"
import { API_ENDPOINTS } from "@/lib/config"

export function useTicket(id: string) {
  const [ticket, setTicket] = useState<Ticket | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchTicket = async () => {
    try {
      setLoading(true)
      const response = await fetch(`${API_ENDPOINTS.TICKETS}/${id}`)
      const data = await response.json()

      if (response.ok) {
        setTicket(data)
        setError(null)
      } else {
        setError(data.message || "Failed to fetch ticket")
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
