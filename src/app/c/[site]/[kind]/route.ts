import { creativeUpstream } from "@/shared/lib/creativeFiles";

export async function GET(_request: Request, { params }: { params: Promise<{ site: string; kind: string }> }) {
  const { site, kind } = await params;
  const upstream = creativeUpstream(site, kind);
  if (!upstream) {
    return new Response(null, { status: 404 });
  }

  const response = await fetch(upstream, { next: { revalidate: 3600 } });
  if (!response.ok || !response.body) {
    return new Response(null, { status: 502 });
  }

  return new Response(response.body, {
    headers: {
      "content-type": response.headers.get("content-type") ?? "image/png",
      "cache-control": "public, max-age=3600",
    },
  });
}
