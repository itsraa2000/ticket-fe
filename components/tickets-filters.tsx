"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Search, X } from "lucide-react"

interface TicketsFiltersProps {
  onFiltersChange: (filters: {
    status?: string
    priority?: string
    search?: string
  }) => void
}

export function TicketsFilters({ onFiltersChange }: TicketsFiltersProps) {
  const [status, setStatus] = useState<string>("all")
  const [priority, setPriority] = useState<string>("all")
  const [search, setSearch] = useState<string>("")

  const handleFiltersChange = (newFilters: {
    status?: string
    priority?: string
    search?: string
  }) => {
    const filters = {
      status: newFilters.status || status,
      priority: newFilters.priority || priority,
      search: newFilters.search !== undefined ? newFilters.search : search,
    }

    // Remove empty values
    const cleanFilters = Object.fromEntries(Object.entries(filters).filter(([_, value]) => value !== ""))

    onFiltersChange(cleanFilters)
  }

  const handleStatusChange = (value: string) => {
    setStatus(value)
    handleFiltersChange({ status: value })
  }

  const handlePriorityChange = (value: string) => {
    setPriority(value)
    handleFiltersChange({ priority: value })
  }

  const handleSearchChange = (value: string) => {
    setSearch(value)
    handleFiltersChange({ search: value })
  }

  const clearFilters = () => {
    setStatus("all")
    setPriority("all")
    setSearch("")
    onFiltersChange({})
  }

  const hasActiveFilters = status !== "all" || priority !== "all" || search

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Filters</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="search">Search</Label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="search"
              placeholder="Search tickets..."
              value={search}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="status">Status</Label>
          <Select value={status} onValueChange={handleStatusChange}>
            <SelectTrigger>
              <SelectValue placeholder="All statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All statuses</SelectItem>
              <SelectItem value="open">Open</SelectItem>
              <SelectItem value="in-progress">In Progress</SelectItem>
              <SelectItem value="resolved">Resolved</SelectItem>
              <SelectItem value="closed">Closed</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="priority">Priority</Label>
          <Select value={priority} onValueChange={handlePriorityChange}>
            <SelectTrigger>
              <SelectValue placeholder="All priorities" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All priorities</SelectItem>
              <SelectItem value="low">Low</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="high">High</SelectItem>
              <SelectItem value="urgent">Urgent</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {hasActiveFilters && (
          <Button variant="outline" onClick={clearFilters} className="w-full bg-transparent" size="sm">
            <X className="h-4 w-4 mr-2" />
            Clear Filters
          </Button>
        )}
      </CardContent>
    </Card>
  )
}
