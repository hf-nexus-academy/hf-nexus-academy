import type { Metadata } from "next";
import Link from "next/link";
import { CalendarDays } from "lucide-react";

import { prisma } from "@/lib/prisma";
import { Badge } from "@/components/ui/badge";
import { COURSE_CATEGORY_LABELS } from "@/lib/constants";
import { formatDate } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Articles on Quran, Hadith, Fiqh, Arabic, and Islamic Studies from HF Nexus Academy's scholars.",
  alternates: { canonical: "/blog" },
};

export const revalidate = 300;

export default async function BlogIndexPage() {
  let posts: Awaited<ReturnType<typeof fetchPosts>> = [];

  try {
    posts = await fetchPosts();
  } catch (error) {
    console.error("Failed to load blog posts:", error);
  }

  return (
    <div>
      <section className="bg-navy-950 py-20 lg:py-24">
        <div className="container max-w-3xl text-center">
          <span className="text-xs uppercase tracking-[0.2em] text-gold-500 font-medium">Blog</span>
          <h1 className="font-display text-4xl lg:text-5xl text-cream-50 mt-4 text-balance">
            Reflections, lessons, and Islamic knowledge
          </h1>
          <p className="mt-6 text-cream-50/70 leading-relaxed">
            Articles from HF Nexus Academy's scholars on Quran, Hadith, Fiqh, Arabic,
            and Islamic studies.
          </p>
        </div>
      </section>

      <section className="bg-cream-50 py-16 lg:py-20">
        <div className="container">
          {posts.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-ink-500">
                No articles published yet. Check back soon, or visit the admin portal
                to publish the first post.
              </p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {posts.map((post) => (
                <Link
                  key={post.slug}
                  href={`/blog/${post.slug}`}
                  className="group flex flex-col rounded-lg border border-ink-300/15 bg-white overflow-hidden hover:border-gold-500/40 hover:shadow-md transition-all"
                >
                  <div className="aspect-[16/9] bg-navy-950/5 flex items-center justify-center">
                    {post.coverImageUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={post.coverImageUrl} alt={post.title} className="h-full w-full object-cover" />
                    ) : (
                      <span className="font-display text-navy-950/20 text-2xl">HF Nexus</span>
                    )}
                  </div>
                  <div className="p-6 flex flex-col flex-1">
                    <Badge variant="outline" className="w-fit mb-3">
                      {COURSE_CATEGORY_LABELS[post.category] || post.category}
                    </Badge>
                    <h2 className="font-display text-lg text-navy-950 mb-2 leading-snug">{post.title}</h2>
                    <p className="text-sm text-ink-500 leading-relaxed mb-4 flex-1 line-clamp-3">
                      {post.excerpt}
                    </p>
                    <div className="flex items-center gap-2 text-xs text-ink-300 mt-auto pt-3 border-t border-ink-300/10">
                      <CalendarDays className="h-3.5 w-3.5" />
                      {post.publishedAt ? formatDate(post.publishedAt) : "Draft"}
                      <span>·</span>
                      <span>{post.authorName}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

async function fetchPosts() {
  return prisma.blogPost.findMany({
    where: { status: "PUBLISHED" },
    orderBy: { publishedAt: "desc" },
    select: {
      slug: true,
      title: true,
      excerpt: true,
      coverImageUrl: true,
      category: true,
      authorName: true,
      publishedAt: true,
    },
  });
}
