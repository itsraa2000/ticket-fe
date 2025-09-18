"use client"

import { useState, useEffect } from "react"
import type { QueueJob } from "@/lib/types"

interface UseQueueOptions {
  status?: string
  autoRefresh?: boolean
  refreshInterval?: number
}

export function useQueue(options: UseQueueOptions = {}) {
  const [jobs, setJobs] = useState<QueueJob[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchJobs = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams()

      if (options.status) params.append("status", options.status)

      const response = await fetch(`/api/queue?${params.toString()}`)
      const data = await response.json()

      if (data.success) {
        setJobs(data.data)
        setError(null)
      } else {
        setError(data.error || "Failed to fetch queue jobs")
      }
    } catch (err) {
      setError("Failed to fetch queue jobs")
      console.error("Error fetching queue jobs:", err)
    } finally {
      setLoading(false)
    }
  }

  const clearCompletedJobs = async () => {
    try {
      const response = await fetch("/api/queue", {
        method: "DELETE",
      })

      if (response.ok) {
        fetchJobs()
      }
    } catch (err) {
      console.error("Error clearing completed jobs:", err)
    }
  }

  useEffect(() => {
    fetchJobs()

    if (options.autoRefresh) {
      const interval = setInterval(fetchJobs, options.refreshInterval || 5000)
      return () => clearInterval(interval)
    }
  }, [options.status, options.autoRefresh, options.refreshInterval])

  return {
    jobs,
    loading,
    error,
    refetch: fetchJobs,
    clearCompleted: clearCompletedJobs,
  }
}
