"use client"

import { useState, useEffect } from "react"
import type { QueueJob } from "@/lib/types"
import { API_ENDPOINTS } from "@/lib/config"

interface UseQueueOptions {
  status?: string
  autoRefresh?: boolean
  refreshInterval?: number
  page?: number
  pageSize?: number
}

interface QueueStats {
  waiting: number
  active: number
  completed: number
  failed: number
  delayed: number
}

export function useQueue(options: UseQueueOptions = {}) {
  const [jobs, setJobs] = useState<QueueJob[]>([])
  const [total, setTotal] = useState(0)
  const [stats, setStats] = useState<QueueStats>({ waiting: 0, active: 0, completed: 0, failed: 0, delayed: 0 })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchJobs = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams()

      if (options.status) params.append("status", options.status)
      if (options.page) params.append("page", options.page.toString())
      if (options.pageSize) params.append("pageSize", options.pageSize.toString())

      const url = `${API_ENDPOINTS.QUEUE_JOBS}?${params.toString()}`;
      const response = await fetch(url);
      
      if (response.ok) {
        const data = await response.json();
        setJobs(data.jobs || []);
        setTotal(data.total || 0);
        setError(null);
      } else {
        setError("Failed to fetch queue jobs");
      }
    } catch (err) {
      setError("Failed to fetch queue jobs")
      console.error("Error fetching queue jobs:", err)
    } finally {
      setLoading(false)
    }
  }

  const fetchStats = async () => {
    try {
      const response = await fetch(`${API_ENDPOINTS.ADMIN_QUEUE_STATS}/notify/stats`)
      
      if (response.ok) {
        const data = await response.json()
        setStats(data)
      }
    } catch (err) {
      console.error("Error fetching queue stats:", err)
    }
  }

  const clearCompletedJobs = async () => {
    try {
      const response = await fetch(`${API_ENDPOINTS.QUEUE_JOBS}/clear`, {
        method: "DELETE",
      })

      if (response.ok) {
        fetchJobs()
        fetchStats()
      }
    } catch (err) {
      console.error("Error clearing completed jobs:", err)
    }
  }

  useEffect(() => {
    fetchJobs()
    fetchStats()

    if (options.autoRefresh) {
      const interval = setInterval(() => {
        fetchJobs()
        fetchStats()
      }, options.refreshInterval || 3000)
      return () => clearInterval(interval)
    }
  }, [options.status, options.autoRefresh, options.refreshInterval, options.page, options.pageSize])

  return {
    jobs,
    total,
    stats,
    loading,
    error,
    refetch: fetchJobs,
    clearCompleted: clearCompletedJobs,
  }
}
