export const proxy = (url: string) => {
  return fetch(
    `https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(url)}`,
  );
};
