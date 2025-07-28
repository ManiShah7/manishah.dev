import { getPostBySlug, getAllPosts } from "@/lib/posts";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { remark } from "remark";
import html from "remark-html";
import PrismLoader from "@/components/PrismLoader";

type Params = {
  slug: string;
};

export default async function PostPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const processedContent = await remark().use(html).process(post.content);
  const contentHtml = processedContent.toString();

  return (
    <div className="max-w-4xl mx-auto px-6 py-8">
      <PrismLoader />

      <Link
        href="/"
        className="text-blue-600 hover:text-blue-800 hover:underline mb-8 inline-block text-lg"
      >
        ← Back to blog
      </Link>

      <article className="prose prose-xl max-w-none">
        {post.image && (
          <div className="mb-12 -mx-6">
            <Image
              src={post.image}
              alt={post.title}
              width={1200}
              height={600}
              className="rounded-xl object-cover w-full"
              priority
            />
          </div>
        )}

        <header className="mb-12">
          <h1 className="text-5xl font-bold mb-6 leading-tight">
            {post.title}
          </h1>
          <div className="flex items-center justify-between text-lg text-gray-600 border-b border-gray-200 pb-6">
            <time className="font-medium">
              {new Date(post.date).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </time>
            <div className="flex gap-3">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm font-medium"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        </header>

        <div
          className="blog-content"
          dangerouslySetInnerHTML={{ __html: contentHtml }}
        />
      </article>
    </div>
  );
}

export async function generateStaticParams() {
  const posts = await getAllPosts();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}
