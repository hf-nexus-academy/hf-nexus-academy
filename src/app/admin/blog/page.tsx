import Link from "next/link";
import { Newspaper } from "lucide-react";

import { getAllBlogPosts } from "@/lib/data/admin";
import { PortalSectionHeader } from "@/components/portal/shared/section-header";
import { PortalEmptyState } from "@/components/portal/shared/empty-state";
import { CreateBlogPostDialog } from "@/components/portal/admin/create-blog-post-dialog";
import { DeleteButton } from "@/components/portal/admin/delete-button";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";

export const metadata = { title: "Manage Blog" };

const STATUS_VARIANT: Record<string, "success" | "outline" | "default"> = {
  PUBLISHED: "success",
  DRAFT: "outline",
  ARCHIVED: "default",
};

export default async function AdminBlogPage() {
  const posts = await getAllBlogPosts();

  return (
    <div>
      <PortalSectionHeader
        title="Manage Blog"
        description={`${posts.length} post${posts.length === 1 ? "" : "s"} total.`}
        action={<CreateBlogPostDialog />}
      />

      {posts.length === 0 ? (
        <PortalEmptyState
          icon={Newspaper}
          title="No blog posts yet"
          description="Use the New Post button to publish your first article."
        />
      ) : (
        <div className="rounded-lg border border-ink-300/15 bg-white divide-y divide-ink-300/10">
          {posts.map((post) => (
            <div key={post.id} className="flex items-center justify-between gap-4 p-5">
              <Link href={`/admin/blog/${post.id}`} className="min-w-0 flex-1">
                <p className="text-sm font-medium text-navy-950 truncate hover:text-gold-700">{post.title}</p>
                <p className="text-xs text-ink-500 truncate">
                  By {post.authorName} ·{" "}
                  {post.publishedAt ? formatDate(post.publishedAt) : "Not yet published"}
                </p>
              </Link>
              <div className="flex items-center gap-3 shrink-0">
                <Badge variant={STATUS_VARIANT[post.status]}>{post.status}</Badge>
                <DeleteButton
                  endpoint={`/api/admin/blog/${post.id}`}
                  confirmMessage="Delete this blog post permanently?"
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
