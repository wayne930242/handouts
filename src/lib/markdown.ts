export const extractImageUrlsFromMarkdown = (
  markdown: string | undefined | null
): string[] => {
  if (!markdown) return [];
  const regex = /!\[.*?\]\((.*?)\)/g;
  const matches = markdown.matchAll(regex);

  return Array.from(matches, (match) => match[1]);
};