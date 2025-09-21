"use client";

import type React from "react";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type {
  Ticket,
  CreateTicketRequest,
  UpdateTicketRequest,
} from "@/lib/types";
import { API_ENDPOINTS } from "@/lib/config";

interface TicketFormProps {
  ticket?: Ticket;
  mode: "create" | "edit";
}

type Priority = Ticket["priority"]; // "LOW" | "MEDIUM" | "HIGH"
type Status = Ticket["status"]; // "OPEN" | "IN_PROGRESS" | "RESOLVED"

type FormState = {
  title: string;
  description: string;
  priority: Priority;
  status: Status;
};

export function TicketForm({ ticket, mode }: TicketFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState<FormState>({
    title: ticket?.title ?? "",
    description: ticket?.description ?? "",
    priority: ticket?.priority ?? "MEDIUM",
    status: ticket?.status ?? "OPEN",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const url =
        mode === "create" ? API_ENDPOINTS.TICKETS : `${API_ENDPOINTS.TICKETS}/${ticket?.id}`;
      const method = mode === "create" ? "POST" : "PATCH";

      const payload: CreateTicketRequest | UpdateTicketRequest =
        mode === "create"
          ? {
              title: formData.title,
              description: formData.description,
              priority: formData.priority as "LOW" | "MEDIUM" | "HIGH",
            }
          : {
              title: formData.title,
              description: formData.description,
              priority: formData.priority as "LOW" | "MEDIUM" | "HIGH",
              status: formData.status as "OPEN" | "IN_PROGRESS" | "RESOLVED",
            };

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      let data;
      try {
        data = await response.json();
      } catch (jsonError) {
        data = {};
      }

      if (response.ok) {
        // Show success toast
        toast({
          title: "Success!",
          description: mode === "create" 
            ? "Ticket created successfully" 
            : "Ticket updated successfully",
          variant: "default",
        });
        
        setTimeout(() => {
          window.location.href = "/";
        }, 1000);
      } else {
        const errorMessage = data.message || `Failed to ${mode} ticket`;
        setError(errorMessage);
        
        toast({
          title: "Error",
          description: errorMessage,
          variant: "destructive",
        });
      }
    } catch (err) {
      const errorMessage = `Failed to ${mode} ticket`;
      setError(errorMessage);
      console.error(`Error ${mode}ing ticket:`, err);
      
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl">
          {mode === "create" ? "Create New Ticket" : "Edit Ticket"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, title: e.target.value }))
              }
              placeholder="Brief description of the issue (minimum 5 characters)"
              required
              minLength={5}
            />
            <p className="text-sm text-muted-foreground">
              Minimum 5 characters required
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
              placeholder="Detailed description of the issue (maximum 5000 characters)"
              rows={6}
              required
              maxLength={5000}
            />
            <p className="text-sm text-muted-foreground">
              {formData.description.length}/5000 characters
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="priority">Priority</Label>
              <Select
                value={formData.priority}
                onValueChange={(value) =>
                  setFormData((prev) => ({
                    ...prev,
                    priority: value as Priority,
                  }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="LOW">Low</SelectItem>
                  <SelectItem value="MEDIUM">Medium</SelectItem>
                  <SelectItem value="HIGH">High</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {mode === "edit" && (
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) =>
                    setFormData((prev) => ({
                      ...prev,
                      status: value as Status,
                    }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="OPEN">Open</SelectItem>
                    <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                    <SelectItem value="RESOLVED">Resolved</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>

          <div className="flex gap-4 pt-4">
            <Button type="submit" disabled={loading} className="flex-1">
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {mode === "create" ? "Create Ticket" : "Update Ticket"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
            >
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
