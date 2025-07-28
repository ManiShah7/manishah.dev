import { readdir, readFile } from "fs/promises";
import { join } from "path";
import matter from "gray-matter";
import { existsSync } from "fs";

type Post = {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  image?: string;
  tags: string[];
  content: string;
};

export async function getAllPosts(): Promise<Post[]> {
  const postsDirectory = join(process.cwd(), "content", "posts");

  // Check if directory exists
  if (!existsSync(postsDirectory)) {
    return [];
  }

  try {
    const filenames = await readdir(postsDirectory);
    const posts = await Promise.all(
      filenames
        .filter((name) => name.endsWith(".md"))
        .map(async (filename) => {
          const filePath = join(postsDirectory, filename);
          const fileContents = await readFile(filePath, "utf8");
          const { data, content } = matter(fileContents);

          return {
            slug: filename.replace(/\.md$/, ""),
            title: data.title || "Untitled",
            date: data.date || "",
            excerpt: data.excerpt || "",
            image: data.image || "",
            tags: data.tags || [],
            content,
          };
        })
    );

    return posts.sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  } catch (error) {
    console.error("Error reading posts directory:", error);
    return [];
  }
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  try {
    const filePath = join(process.cwd(), "content", "posts", `${slug}.md`);
    const fileContents = await readFile(filePath, "utf8");
    const { data, content } = matter(fileContents);

    return {
      slug,
      title: data.title || "Untitled",
      date: data.date || "",
      excerpt: data.excerpt || "",
      image: data.image || "",
      tags: data.tags || [],
      content,
    };
  } catch (error) {
    console.error(`Error reading post ${slug}:`, error);
    return null;
  }
}
