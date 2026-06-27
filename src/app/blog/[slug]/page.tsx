import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CalendarDays, User } from "lucide-react";

import { prisma } from "@/lib/prisma";
import { Badge } from "@/components/ui/badge";
import { COURSE_CATEGORY_LABELS } from "@/lib/constants";
import { formatDate } from "@/lib/utils";

export const revalidate = 300;

async function getPost(slug: string) {
  return prisma.blogPost.findFirst({
    where: { slug, status: "PUBLISHED" },
  });
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  try {
    const post = await getPost(params.slug);
    if (!post) return {};
    return {
      title: post.metaTitle || post.title,
      description: post.metaDescription || post.excerpt,
      alternates: { canonical: `/blog/${post.slug}` },
      openGraph: {
        type: "article",
        title: post.title,
        description: post.excerpt,
        images: post.coverImageUrl ? [{ url: post.coverImageUrl }] : undefined,
      },
    };
  } catch {
    return {};
  }
}

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  let post;
  try {
    post = await getPost(params.slug);
  } catch (error) {
    console.error("Failed to load blog post:", error);
  }

  if (!post) notFound();

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    author: { "@type": "Person", name: post.authorName },
    datePublished: post.publishedAt?.toISOString(),
    publisher: {
      "@type": "EducationalOrganization",
      name: "HF Nexus Academy",
    },
  };

  return (
    <article>
      <section className="bg-navy-950 py-16 lg:py-20">
        <div className="container max-w-2xl">
          <Badge variant="gold" className="mb-4">
            {COURSE_CATEGORY_LABELS[post.category] || post.category}
          </Badge>
          <h1 className="font-display text-3xl lg:text-4xl text-cream-50 text-balance">{post.title}</h1>
          <div className="flex items-center gap-4 mt-5 text-sm text-cream-50/60">
            <span className="flex items-center gap-1.5">
              <User className="h-3.5 w-3.5" /> {post.authorName}
            </span>
            {post.publishedAt && (
              <span className="flex items-center gap-1.5">
                <CalendarDays className="h-3.5 w-3.5" /> {formatDate(post.publishedAt)}
              </span>
            )}
          </div>
        </div>
      </section>

      <section className="bg-cream-50 py-16 lg:py-20">
        <div className="container max-w-2xl prose prose-navy">
          <div
            className="text-ink-700 leading-relaxed [&>p]:mb-5 [&>h2]:font-display [&>h2]:text-2xl [&>h2]:text-navy-950 [&>h2]:mt-8 [&>h2]:mb-4"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        </div>
      </section>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
    </article>
  );
}
