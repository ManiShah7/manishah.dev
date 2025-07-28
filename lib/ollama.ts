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

export async function generateBlogPost(
  topic?: string
): Promise<{ content: string; slug: string }> {
  const selectedTopic =
    topic ||
    "a recent discovery or learning experience in React/JavaScript development";

  const imageUrl = await getImageForPost(selectedTopic);

  const prompt = `Write a blog post about ${selectedTopic} from the perspective of a developer sharing their experience.

IMPORTANT: Follow this EXACT format with triple dashes for frontmatter:

---
title: "Your Specific Title Here"
date: "${new Date().toISOString().split("T")[0]}"
tags: ["react", "javascript"]
excerpt: "Brief description of what the post covers"
image: "${imageUrl}"
---

# Your Title

Write the content naturally, like explaining to a colleague. Include:
- What problem you were solving or what you discovered
- Code examples that work
- What you learned or what surprised you
- 600-800 words total

## Section Header

More content with examples:

\`\`\`javascript
// Working code examples
\`\`\`

## Key Takeaways

Wrap up with useful insights.

Remember: Start with --- and end frontmatter with --- then begin the actual content.`;

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
