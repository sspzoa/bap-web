const FONT_UA =
  "Mozilla/5.0 (Macintosh; U; Intel Mac OS X 10_6_8; de-at) AppleWebKit/533.21.1 (KHTML, like Gecko) Version/5.0.5 Safari/533.21.1";

async function loadNotoSansKr(text: string): Promise<ArrayBuffer | null> {
  try {
    const css = await fetch(
      `https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@700&text=${encodeURIComponent(text)}`,
      { headers: { "User-Agent": FONT_UA } },
    ).then((response) => response.text());

    const match =
      css.match(/src: url\((.+?)\) format\('(opentype|truetype)'\)/) ??
      css.match(/src: url\((.+?)\) format\('(woff2|woff)'\)/);
    if (!match) {
      return null;
    }

    const fontResponse = await fetch(match[1]);
    if (!fontResponse.ok) {
      return null;
    }

    return fontResponse.arrayBuffer();
  } catch {
    return null;
  }
}

export async function loadOgFont(text: string) {
  const data = await loadNotoSansKr(text);
  if (!data) {
    return [];
  }

  return [
    {
      name: "Noto Sans KR",
      data,
      weight: 700 as const,
      style: "normal" as const,
    },
  ];
}
