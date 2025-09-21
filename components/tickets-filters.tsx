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
  onSearch: () => void
}

export function TicketsFilters({ onFiltersChange, onSearch }: TicketsFiltersProps) {
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

    // Convert to backend format and remove "all" values
    const cleanFilters: any = {}
    
    if (filters.status && filters.status !== "all") {
      cleanFilters.status = filters.status
    }
    
    if (filters.priority && filters.priority !== "all") {
      cleanFilters.priority = filters.priority
    }
    
    if (filters.search && filters.search.trim() !== "") {
      cleanFilters.search = filters.search.trim()
    }

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
    // Update the search filter value but don't trigger API call
    handleFiltersChange({ search: value })
  }

  const handleSearchKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      onSearch()
    }
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
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="search"
                placeholder="Search tickets..."
                value={search}
                onChange={(e) => handleSearchChange(e.target.value)}
                onKeyDown={handleSearchKeyDown}
                className="pl-10"
              />
            </div>
            <Button 
              type="button" 
              variant="outline" 
              size="icon"
              onClick={onSearch}
              disabled={!search.trim()}
            >
              <Search className="h-4 w-4" />
            </Button>
          </div>
          {search && (
            <p className="text-xs text-muted-foreground">
              Press Enter or click the search button to search for "{search}"
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="status">Status</Label>
          <Select value={status} onValueChange={handleStatusChange}>
            <SelectTrigger>
              <SelectValue placeholder="All statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All statuses</SelectItem>
              <SelectItem value="OPEN">Open</SelectItem>
              <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
              <SelectItem value="RESOLVED">Resolved</SelectItem>
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
              <SelectItem value="LOW">Low</SelectItem>
              <SelectItem value="MEDIUM">Medium</SelectItem>
              <SelectItem value="HIGH">High</SelectItem>
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
