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
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, X, Plus } from "lucide-react";
import type {
  Ticket,
  CreateTicketRequest,
  UpdateTicketRequest,
} from "@/lib/types";
import { useToast } from "@/hooks/use-toast";

interface TicketFormProps {
  ticket?: Ticket;
  mode: "create" | "edit";
}

type Priority = Ticket["priority"]; // "low" | "medium" | "high" | "urgent"
type Status = Ticket["status"]; // "open" | "in-progress" | "resolved" | "closed"

type FormData = {
  title: string;
  description: string;
  priority: Priority;
  assignee: string;
  reporter: string;
  status: Status;
  tags: string[];
};

export function TicketForm({ ticket, mode }: TicketFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [newTag, setNewTag] = useState("");
  const { toast } = useToast();

  const [formData, setFormData] = useState<FormData>(() => ({
    title: ticket?.title ?? "",
    description: ticket?.description ?? "",
    priority: (ticket?.priority ?? "medium") as Priority,
    assignee: ticket?.assignee ?? "",
    reporter: ticket?.reporter ?? "",
    status: (ticket?.status ?? "open") as Status,
    tags: ticket?.tags ?? [],
  }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const url =
        mode === "create" ? "/api/tickets" : `/api/tickets/${ticket?.id}`;
      const method = mode === "create" ? "POST" : "PUT";

      const payload: CreateTicketRequest | UpdateTicketRequest =
        mode === "create"
          ? {
              title: formData.title,
              description: formData.description,
              priority: formData.priority,
              assignee: formData.assignee || undefined,
              reporter: formData.reporter,
              tags: formData.tags,
            }
          : {
              title: formData.title,
              description: formData.description,
              priority: formData.priority,
              assignee: formData.assignee || undefined,
              status: formData.status,
              tags: formData.tags,
            };

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (data.success) {
        toast({
          title: mode === "create" ? "Ticket created" : "Ticket updated",
          description:
            mode === "create"
              ? "Your ticket has been created successfully."
              : "Your changes have been saved.",
          className: "text-green-600 border-green-700",
          duration: 2500,
        });
        router.push("/");
        router.refresh();
      } else {
        const msg = data.error || `Failed to ${mode} ticket`;
        setError(msg);
        toast({
          variant: "destructive",
          title: "Something went wrong",
          description: msg,
          className: "text-red-600 border-red-700",
          duration: 5000,
        });
      }
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : `Failed to ${mode} ticket`;
      setError(msg);
      toast({
        variant: "destructive",
        title: "Network or server error",
        description: msg,
        className: "text-red-600 border-red-700",
        duration: 5000,
      });
      console.error(`Error ${mode}ing ticket:`, err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddTag = () => {
    const t = newTag.trim();
    if (t && !formData.tags.includes(t)) {
      setFormData((prev) => ({ ...prev, tags: [...prev.tags, t] }));
      setNewTag("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }));
  };

  const handleKeyDown: React.KeyboardEventHandler<HTMLInputElement> = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddTag();
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
              placeholder="Brief description of the issue"
              required
            />
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
              placeholder="Detailed description of the issue..."
              rows={4}
              required
            />
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
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="urgent">Urgent</SelectItem>
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
                    <SelectItem value="open">Open</SelectItem>
                    <SelectItem value="in-progress">In Progress</SelectItem>
                    <SelectItem value="resolved">Resolved</SelectItem>
                    <SelectItem value="closed">Closed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="reporter">Reporter *</Label>
              <Input
                id="reporter"
                type="email"
                value={formData.reporter}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, reporter: e.target.value }))
                }
                placeholder="reporter@example.com"
                required
                disabled={mode === "edit"}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="assignee">Assignee</Label>
              <Input
                id="assignee"
                type="email"
                value={formData.assignee}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, assignee: e.target.value }))
                }
                placeholder="assignee@example.com (optional)"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Tags</Label>
            <div className="flex gap-2 mb-2">
              <Input
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Add a tag..."
                className="flex-1"
              />
              <Button
                type="button"
                variant="outline"
                onClick={handleAddTag}
                disabled={!newTag.trim()}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            {formData.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {formData.tags.map((tag) => (
                  <Badge
                    key={tag}
                    variant="secondary"
                    className="flex items-center gap-1"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      className="ml-1 hover:text-destructive"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
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
