"use client"

import { useState, useEffect, useRef } from "react"
import type { Ticket } from "@/lib/types"
import { API_ENDPOINTS } from "@/lib/config"

interface UseTicketsOptions {
  status?: string
  priority?: string
  search?: string
  page?: number
  pageSize?: number
  sortBy?: string
  sortOrder?: string
}

export function useTickets(options: UseTicketsOptions = {}) {
  const [tickets, setTickets] = useState<Ticket[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  const fetchTickets = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams()

      if (options.status) params.append("status", options.status)
      if (options.priority) params.append("priority", options.priority)
      if (options.search) params.append("search", options.search)
      if (options.page) params.append("page", options.page.toString())
      if (options.pageSize) params.append("pageSize", options.pageSize.toString())
      if (options.sortBy) params.append("sortBy", options.sortBy)
      if (options.sortOrder) params.append("sortOrder", options.sortOrder)

      const response = await fetch(`${API_ENDPOINTS.TICKETS}?${params.toString()}`)
      const data = await response.json()

      if (response.ok) {
        setTickets(data.tickets || [])
        setTotal(data.total || 0)
        setError(null)
      } else {
        setError(data.message || "Failed to fetch tickets")
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
  }, [])

  useEffect(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current)
      searchTimeoutRef.current = null
    }
    fetchTickets()
  }, [options.status, options.priority, options.page, options.pageSize, options.sortBy, options.sortOrder])

  useEffect(() => {
    if (options.search === '') {
      fetchTickets()
    }
  }, [options.search])

  const performSearch = () => {
    fetchTickets()
  }

  return {
    tickets,
    total,
    loading,
    error,
    refetch: fetchTickets,
    performSearch,
  }
}
