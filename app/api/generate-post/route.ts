import { generateBlogPost } from "@/lib/ollama";
import { writeFile } from "fs/promises";
import { join } from "path";

export async function POST(request: Request) {
  try {
    const { topic } = await request.json();

    const { content, slug } = await generateBlogPost(topic);

    // Use the generated slug for filename
    const filename = `${slug}.md`;
    const filepath = join(process.cwd(), "content", "posts", filename);

    await writeFile(filepath, content);

    return Response.json({
      success: true,
      filename,
      slug,
      url: `/posts/${slug}`,
      preview: content.substring(0, 200) + "...",
    });
  } catch (error) {
    console.error("Error generating post:", error);
    return Response.json(
      { success: false, error: "Failed to generate post" },
      { status: 500 }
    );
  }
}
