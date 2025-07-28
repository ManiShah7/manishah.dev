import { getAllPosts } from "@/lib/posts";
import Link from "next/link";
import Image from "next/image";

export default async function HomePage() {
  const posts = await getAllPosts();

  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="space-y-8">
        {posts.map((post) => (
          <article
            key={post.slug}
            className="border-b border-gray-200 dark:border-gray-700 pb-8"
          >
            <Link href={`/posts/${post.slug}`}>
              {post.image && (
                <div className="mb-4">
                  <Image
                    src={post.image}
                    alt={post.title}
                    width={800}
                    height={400}
                    className="rounded-lg object-cover"
                    priority
                  />
                </div>
              )}
              <h2 className="text-2xl text-black font-semibold mb-2 hover:text-blue-600 dark:text-white dark:hover:text-blue-400">
                {post.title}
              </h2>
            </Link>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              {post.excerpt}
            </p>
            <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
              <time>{new Date(post.date).toLocaleDateString()}</time>
              <div className="flex gap-2">
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
