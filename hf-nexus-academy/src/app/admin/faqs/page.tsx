"use client";

import * as React from "react";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, Loader2, ChevronUp, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { PortalSectionHeader } from "@/components/portal/shared/section-header";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";

interface Faq { id: string; question: string; answer: string; placement: string; isPublished: boolean; displayOrder: number; }

function FaqForm({ faq, onSuccess }: { faq?: Faq; onSuccess: () => void }) {
  const [question, setQuestion] = React.useState(faq?.question ?? "");
  const [answer, setAnswer] = React.useState(faq?.answer ?? "");
  const [placement, setPlacement] = React.useState(faq?.placement ?? "general");
  const [isPublished, setIsPublished] = React.useState(faq?.isPublished ?? true);
  const [saving, setSaving] = React.useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const url = faq ? `/api/admin/faqs/${faq.id}` : "/api/admin/faqs";
      const res = await fetch(url, {
        method: faq ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question, answer, placement, isPublished }),
      });
      const data = await res.json();
      if (!res.ok) { toast.error(data.error || "Could not save."); return; }
      toast.success(faq ? "FAQ updated." : "FAQ created.");
      onSuccess();
    } catch { toast.error("Something went wrong."); }
    finally { setSaving(false); }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-2">
      <div className="flex flex-col gap-1.5">
        <Label>Question</Label>
        <Input value={question} onChange={(e) => setQuestion(e.target.value)} required placeholder="e.g. How do live classes work?" />
      </div>
      <div className="flex flex-col gap-1.5">
        <Label>Answer</Label>
        <textarea value={answer} onChange={(e) => setAnswer(e.target.value)} required rows={4}
          className="rounded-sm border border-ink-300/30 bg-white px-3 py-2 text-sm resize-y focus:outline-none focus:ring-2 focus:ring-gold-500"
          placeholder="Write the answer here..." />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-1.5">
          <Label>Page Placement</Label>
          <Select value={placement} onValueChange={setPlacement}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="general">Home Page</SelectItem>
              <SelectItem value="pricing">Pricing Page</SelectItem>
              <SelectItem value="courses">Courses Page</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex flex-col gap-1.5 justify-end">
          <label className="flex items-center gap-2 text-sm cursor-pointer">
            <Switch checked={isPublished} onCheckedChange={setIsPublished} />
            Published (visible on site)
          </label>
        </div>
      </div>
      <Button type="submit" disabled={saving} className="w-fit">
        {saving && <Loader2 className="h-4 w-4 animate-spin" />}
        {faq ? "Save Changes" : "Add FAQ"}
      </Button>
    </form>
  );
}

export default function AdminFaqsPage() {
  const [faqs, setFaqs] = React.useState<Faq[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [openCreate, setOpenCreate] = React.useState(false);
  const [editingFaq, setEditingFaq] = React.useState<Faq | null>(null);
  const [deleting, setDeleting] = React.useState<string | null>(null);

  async function load() {
    try {
      const res = await fetch("/api/admin/faqs");
      const data = await res.json();
      if (res.ok) setFaqs(data.faqs);
    } catch { toast.error("Could not load FAQs."); }
    finally { setLoading(false); }
  }

  React.useEffect(() => { load(); }, []);

  async function handleDelete(faq: Faq) {
    if (!confirm(`Delete "${faq.question}"?`)) return;
    setDeleting(faq.id);
    try {
      const res = await fetch(`/api/admin/faqs/${faq.id}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) { toast.error(data.error || "Could not delete."); return; }
      toast.success("FAQ deleted.");
      load();
    } catch { toast.error("Something went wrong."); }
    finally { setDeleting(null); }
  }

  async function togglePublish(faq: Faq) {
    try {
      await fetch(`/api/admin/faqs/${faq.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isPublished: !faq.isPublished }),
      });
      load();
    } catch { toast.error("Something went wrong."); }
  }

  const groupedFaqs = faqs.reduce<Record<string, Faq[]>>((acc, faq) => {
    if (!acc[faq.placement]) acc[faq.placement] = [];
    acc[faq.placement].push(faq);
    return acc;
  }, {});

  const placementLabels: Record<string, string> = {
    general: "Home Page FAQs",
    pricing: "Pricing Page FAQs",
    courses: "Courses Page FAQs",
  };

  return (
    <div>
      <PortalSectionHeader
        title="FAQs"
        description="Add, edit, or remove frequently asked questions shown on the public site."
        action={
          <Dialog open={openCreate} onOpenChange={setOpenCreate}>
            <DialogTrigger asChild>
              <Button size="sm"><Plus className="h-4 w-4" /> Add FAQ</Button>
            </DialogTrigger>
            <DialogContent className="max-w-xl">
              <DialogHeader><DialogTitle>Add New FAQ</DialogTitle></DialogHeader>
              <FaqForm onSuccess={() => { setOpenCreate(false); load(); }} />
            </DialogContent>
          </Dialog>
        }
      />

      {loading ? (
        <p className="text-sm text-ink-500">Loading FAQs...</p>
      ) : faqs.length === 0 ? (
        <div className="rounded-lg border border-ink-300/15 bg-white p-10 text-center">
          <p className="text-sm text-ink-500 mb-4">No FAQs yet. Add the first one.</p>
          <Button size="sm" onClick={() => setOpenCreate(true)}><Plus className="h-4 w-4" /> Add FAQ</Button>
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          {Object.entries(groupedFaqs).map(([placement, items]) => (
            <div key={placement}>
              <h2 className="font-display text-sm text-ink-500 uppercase tracking-widest mb-3">
                {placementLabels[placement] ?? placement}
              </h2>
              <div className="flex flex-col gap-2">
                {items.map((faq) => (
                  <div key={faq.id} className="rounded-lg border border-ink-300/15 bg-white p-4 flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant={faq.isPublished ? "success" : "outline"}>
                          {faq.isPublished ? "Live" : "Draft"}
                        </Badge>
                        <p className="text-sm font-medium text-navy-950 truncate">{faq.question}</p>
                      </div>
                      <p className="text-xs text-ink-400 line-clamp-2">{faq.answer}</p>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <Button variant="outline" size="sm" onClick={() => togglePublish(faq)}>
                        {faq.isPublished ? "Unpublish" : "Publish"}
                      </Button>
                      <Dialog open={editingFaq?.id === faq.id} onOpenChange={(o) => { if (!o) setEditingFaq(null); }}>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm" onClick={() => setEditingFaq(faq)}>
                            <Pencil className="h-3.5 w-3.5" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-xl">
                          <DialogHeader><DialogTitle>Edit FAQ</DialogTitle></DialogHeader>
                          {editingFaq?.id === faq.id && (
                            <FaqForm faq={editingFaq} onSuccess={() => { setEditingFaq(null); load(); }} />
                          )}
                        </DialogContent>
                      </Dialog>
                      <Button variant="outline" size="sm" disabled={deleting === faq.id}
                        onClick={() => handleDelete(faq)} className="text-destructive hover:bg-destructive/10">
                        {deleting === faq.id ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Trash2 className="h-3.5 w-3.5" />}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
