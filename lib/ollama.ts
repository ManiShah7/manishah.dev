import { readdir, readFile } from "fs/promises";
import { join } from "path";

type OllamaResponse = {
  response: string;
  done: boolean;
};

async function getImageForPost(topic: string): Promise<string> {
  const keywords =
    topic
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, "")
      .split(" ")
      .filter((word) => word.length > 3)
      .slice(0, 2)
      .join(",") || "programming";

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
    return (
      data.results[0]?.urls?.regular ||
      "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800"
    );
  } catch (error) {
    console.error("Error fetching image from Unsplash:", error);
    return "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800";
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
    const mdFiles = files.filter(file => file.endsWith('.md'));
    
    const titles: string[] = [];
    for (const file of mdFiles) {
      const content = await readFile(join(postsDir, file), 'utf-8');
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
  topic?: string
): Promise<{ content: string; slug: string }> {
  const selectedTopic =
    topic ||
    "a recent discovery, tip, trick, or learning experience in modern web development";

  const existingTitles = await getExistingPostTitles();
  const imageUrl = await getImageForPost(selectedTopic);

  const prompt = `Write a deep technical blog post explaining ONE specific concept that most developers either ignore, misunderstand, or don't fully grasp the "why" behind it.

IMPORTANT: Avoid these existing topics that have already been covered:
${existingTitles.map(title => `- ${title}`).join('\n')}

Choose from these types of topics:
- JavaScript engine internals (event loop mechanics, memory management, JIT compilation)
- Browser rendering pipeline details (reflow vs repaint, critical rendering path)
- CSS specificity calculations and cascade resolution
- HTTP protocol nuances (connection pooling, caching headers, content negotiation)
- React internals (reconciliation algorithm, fiber architecture, batching)
- TypeScript type system edge cases (variance, mapped types, conditional types)
- Node.js event-driven architecture (libuv, thread pool, blocking operations)
- Database indexing strategies and query optimization
- Build tool internals (module resolution, tree shaking, code splitting)
- Security concepts (CORS mechanics, CSP implementation, XSS prevention)

IMPORTANT: Follow this EXACT format with triple dashes for frontmatter:

---
title: "Why [Specific Technical Concept] Works the Way It Does"
date: "${new Date().toISOString().split("T")[0]}"
tags: ["javascript", "internals", "deepdive"]
excerpt: "Understanding the deeper mechanics behind [concept] that most developers take for granted"
image: "${imageUrl}"
---

# Why [Specific Technical Concept] Works the Way It Does

Pick ONE specific technical concept and explain it thoroughly. Focus on:

## The Surface-Level Understanding

What most developers know about this concept (the "what").

## The Deeper Reality

The actual implementation details, algorithms, or mechanisms that make it work (the "how" and "why").

## Code Examples That Reveal the Truth

\`\`\`javascript
// Examples that demonstrate the deeper mechanics
// Show edge cases or unexpected behavior
\`\`\`

## Why This Matters in Practice

Real scenarios where understanding the internals prevents bugs or improves performance.

## The Key Insight

The one thing about this concept that changes how you think about it.

Write 700-900 words. Be technical but accessible. Focus on ONE concept deeply rather than multiple concepts superficially.`;

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
  const title = titleMatch ? titleMatch[1] : selectedTopic;
  const slug = createSlugFromTitle(title);

  return { content: cleanContent, slug };
}
