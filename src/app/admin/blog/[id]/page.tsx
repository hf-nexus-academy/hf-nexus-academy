import { notFound } from "next/navigation";

import { getBlogPostById } from "@/lib/data/admin";
import { PortalSectionHeader } from "@/components/portal/shared/section-header";
import { EditBlogPostForm } from "@/components/portal/admin/edit-blog-post-form";

export async function generateMetadata() {
  return { title: "Edit Blog Post" };
}

export default async function AdminEditBlogPostPage({ params }: { params: { id: string } }) {
  const post = await getBlogPostById(params.id);
  if (!post) notFound();

  return (
    <div>
      <PortalSectionHeader title="Edit Blog Post" description={`Slug: /blog/${post.slug}`} />
      <EditBlogPostForm
        postId={post.id}
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
