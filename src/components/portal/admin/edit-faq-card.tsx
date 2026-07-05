"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2, Pencil, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { PublishToggle } from "@/components/portal/admin/publish-toggle";
import { DeleteButton } from "@/components/portal/admin/delete-button";

export function EditFaqCard({
  faq,
}: {
  faq: { id: string; question: string; answer: string; placement: string; isPublished: boolean };
}) {
  const router = useRouter();
  const [isEditing, setIsEditing] = React.useState(false);
  const [question, setQuestion] = React.useState(faq.question);
  const [answer, setAnswer] = React.useState(faq.answer);
  const [isSaving, setIsSaving] = React.useState(false);

  async function handleSave() {
    setIsSaving(true);
    try {
      const res = await fetch(`/api/admin/faqs/${faq.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question, answer }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error || "Could not save.");
        return;
      }
      toast.success("FAQ updated.");
      setIsEditing(false);
      router.refresh();
    } catch {
      toast.error("Something went wrong.");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className="rounded-lg border border-ink-300/15 bg-white p-5">
      <div className="flex items-center justify-between mb-2">
        <Badge variant="outline">{faq.placement}</Badge>
        <div className="flex items-center gap-3">
          <PublishToggle
            initialPublished={faq.isPublished}
            endpoint={`/api/admin/faqs/${faq.id}`}
            field="isPublished"
            label="Published"
          />
          <button
            onClick={() => setIsEditing((v) => !v)}
            aria-label="Edit"
            className="text-ink-300 hover:text-gold-600 transition-colors"
          >
            {isEditing ? <X className="h-4 w-4" /> : <Pencil className="h-4 w-4" />}
          </button>
          <DeleteButton endpoint={`/api/admin/faqs/${faq.id}`} confirmMessage="Delete this FAQ permanently?" />
        </div>
      </div>

      {isEditing ? (
        <div className="flex flex-col gap-3">
          <Input value={question} onChange={(e) => setQuestion(e.target.value)} />
          <Textarea value={answer} onChange={(e) => setAnswer(e.target.value)} className="min-h-[100px]" />
          <Button size="sm" onClick={handleSave} disabled={isSaving} className="w-fit">
            {isSaving && <Loader2 className="h-4 w-4 animate-spin" />}
            Save
          </Button>
        </div>
      ) : (
        <div>
          <p className="text-sm font-medium text-navy-950 mb-1">{faq.question}</p>
          <p className="text-sm text-ink-500 leading-relaxed">{faq.answer}</p>
        </div>
      )}
    </div>
  );
}
