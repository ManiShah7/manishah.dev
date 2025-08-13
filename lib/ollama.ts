import { readdir, readFile } from "fs/promises";
import { join } from "path";

type OllamaResponse = {
  response: string;
  done: boolean;
};

async function getImageForPost(topic: string): Promise<string> {
  const keywords = topic
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, "")
    .split(" ")
    .filter((word) => word.length > 3)
    .slice(0, 2)
    .join(",");

  try {
    const response = await fetch(
      `https://api.unsplash.com/search/photos?query=${encodeURIComponent(
        keywords
      )}&per_page=1&orientation=landscape`,
      {
        headers: {
          Authorization: `Client-ID ${process.env.UNSPLASH_ACCESS_KEY}`,
        },
      }
    );

    const data = await response.json();
    return data.results[0]?.urls?.regular;
  } catch (error) {
    console.error("Error fetching image from Unsplash:", error);
    throw new Error("Error fetching image from Unsplash");
  }
}

function createSlugFromTitle(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim()
    .substring(0, 60);
}

async function getExistingPostTitles(): Promise<string[]> {
  try {
    const postsDir = join(process.cwd(), "content", "posts");
    const files = await readdir(postsDir);
    const mdFiles = files.filter((file) => file.endsWith(".md"));

    const titles: string[] = [];
    for (const file of mdFiles) {
      const content = await readFile(join(postsDir, file), "utf-8");
      const titleMatch = content.match(/title:\s*"([^"]+)"/);
      if (titleMatch) {
        titles.push(titleMatch[1]);
      }
    }
    return titles;
  } catch (error) {
    console.error("Error reading existing posts:", error);
    return [];
  }
}

export async function generateBlogPost(
  topic: string
): Promise<{ content: string; slug: string }> {
  const existingTitles = await getExistingPostTitles();
  const imageUrl = await getImageForPost(topic);

  const prompt = `Write a deep technical blog post about the passed topic (${topic}) explaining a concept that most developers either ignore, misunderstand, or don't fully grasp the "why" behind it. Make sure it's about the provided topic. 
Write 700-900 words. Be technical but accessible.
  
IMPORTANT: Avoid these existing topics that have already been covered:
${existingTitles.map((title) => `- ${title}`).join("\n")}

IMPORTANT: Do not edit the existing posts. Create a new one. Follow this EXACT format with triple dashes for frontmatter:

---
title: "${topic}". 
date: "${new Date().toISOString().split("T")[0]}"
tags: "Adjust based on topic".
excerpt: "Adjust based on topic and content of the article that you write."
image: "${imageUrl}"
---

Blog content with code examples. Supports MD.

`;
  const response = await fetch("http://localhost:11434/api/generate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "codellama:13b",
      prompt,
      stream: false,
    }),
  });

  const data: OllamaResponse = await response.json();

  let cleanContent = data.response.trim();
  if (cleanContent.startsWith('"') && cleanContent.endsWith('"')) {
    cleanContent = cleanContent.slice(1, -1);
  }
  cleanContent = cleanContent.replace(/\\"/g, '"');

  // Extract title from the generated content to create slug
  const titleMatch = cleanContent.match(/title:\s*"([^"]+)"/);
  const title = titleMatch ? titleMatch[1] : topic;
  const slug = createSlugFromTitle(title);

  return { content: cleanContent, slug };
}
