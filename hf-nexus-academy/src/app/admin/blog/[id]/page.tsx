import { notFound } from "next/navigation";

import { getBlogPostById } from "@/lib/data/admin";
import { PortalSectionHeader } from "@/components/portal/shared/section-header";
import { EditBlogPostForm } from "@/components/portal/admin/edit-blog-post-form";

export async function generateMetadata() {
  return { title: "Edit Blog Post" };
}

export default async function AdminEditBlogPostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const post = await getBlogPostById(id);
  if (!post) notFound();

  return (
    <div>
      <PortalSectionHeader title="Edit Blog Post" description={`Slug: /blog/${post.slug}`} />
      <EditBlogPostForm
        postId={post.id}
        initialCoverImageUrl={post.coverImageUrl}
        defaultValues={{
          title: post.title,
          excerpt: post.excerpt,
          content: post.content,
          status: post.status,
        }}
      />
    </div>
  );
}
