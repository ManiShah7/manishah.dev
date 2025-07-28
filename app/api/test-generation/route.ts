import { generateBlogPost } from "@/lib/ollama";

export async function GET() {
  try {
    const content = await generateBlogPost("useEffect cleanup patterns");

    return new Response(content, {
      headers: { "Content-Type": "text/plain" },
    });
  } catch (error) {
    console.error("Error generating blog post:", error);
    return Response.json({ error: "Generation failed" }, { status: 500 });
  }
}
