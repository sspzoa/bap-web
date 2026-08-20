async function loadNotoSansKr(text: string): Promise<ArrayBuffer | null> {
  try {
    const css = await fetch(
      `https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@700&text=${encodeURIComponent(text)}`,
      {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        },
      },
    ).then((response) => response.text());

    const match = css.match(/src: url\((.+?)\) format\('(opentype|truetype)'\)/);
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
