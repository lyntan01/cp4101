export const isMarkdownFormat = (input: string) => {
  // Markdown usually contains headers, lists, and links
  const markdownRegex = /^#.*|^[\*\-] .*|^(\d+\..*)|^(\[.*\]\(.*\))/gm;
  return markdownRegex.test(input);
};

export const isJsonFormat = (input: string) => {
  // JSON usually starts with '{' or '['
  try {
    JSON.parse(input);
    return true;
  } catch (error) {
    return false;
  }
};
