"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Loader2, Trash2, NotebookPen } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { PortalEmptyState } from "@/components/portal/shared/empty-state";
import { formatDate } from "@/lib/utils";

const schema = z.object({
  title: z.string().min(1, "Add a title."),
  content: z.string().min(1, "Write something to save."),
});

type Values = z.infer<typeof schema>;

export interface NoteData {
  id: string;
  title: string;
  content: string;
  createdAt: string | Date;
}

export function StudentNotesManager({ initialNotes }: { initialNotes: NoteData[] }) {
  const [notes, setNotes] = React.useState<NoteData[]>(initialNotes);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [deletingId, setDeletingId] = React.useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<Values>({ resolver: zodResolver(schema) });

  async function onSubmit(values: Values) {
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/student/notes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || "Could not save note.");
        return;
      }

      setNotes((prev) => [data.note, ...prev]);
      reset();
      toast.success("Note saved.");
    } catch {
      toast.error("Something went wrong.");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleDelete(id: string) {
    setDeletingId(id);
    try {
      const res = await fetch(`/api/student/notes/${id}`, { method: "DELETE" });
      if (!res.ok) {
        toast.error("Could not delete note.");
        return;
      }
      setNotes((prev) => prev.filter((n) => n.id !== id));
    } catch {
      toast.error("Something went wrong.");
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className="grid lg:grid-cols-[1fr_1.3fr] gap-6">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-4 rounded-lg border border-ink-300/15 bg-white p-6 h-fit"
      >
        <h3 className="font-display text-base text-navy-950">New Note</h3>
        <div className="flex flex-col gap-1.5">
          <Input placeholder="Note title" error={!!errors.title} {...register("title")} />
          {errors.title && <p className="text-xs text-destructive">{errors.title.message}</p>}
        </div>
        <div className="flex flex-col gap-1.5">
          <Textarea placeholder="Write your note..." error={!!errors.content} {...register("content")} />
          {errors.content && <p className="text-xs text-destructive">{errors.content.message}</p>}
        </div>
        <Button type="submit" disabled={isSubmitting} size="sm">
          {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
          Save Note
        </Button>
      </form>

      <div className="flex flex-col gap-3">
        {notes.length === 0 ? (
          <PortalEmptyState
            icon={NotebookPen}
            title="No notes yet"
            description="Use the form to jot down anything you want to remember from your lessons."
          />
        ) : (
          notes.map((note) => (
            <div key={note.id} className="rounded-lg border border-ink-300/15 bg-white p-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-medium text-navy-950 text-sm">{note.title}</p>
                  <p className="text-xs text-ink-300 mt-0.5">{formatDate(note.createdAt)}</p>
                </div>
                <button
                  onClick={() => handleDelete(note.id)}
                  disabled={deletingId === note.id}
                  aria-label="Delete note"
                  className="text-ink-300 hover:text-destructive transition-colors"
                >
                  {deletingId === note.id ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Trash2 className="h-4 w-4" />
                  )}
                </button>
              </div>
              <p className="text-sm text-ink-500 mt-2 whitespace-pre-wrap">{note.content}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
