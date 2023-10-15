const REPLACEMENTS = {
  meow: "😺",
  gobo: "[gobo]",
  cat: "🙂",
  "aww-cat": "😃",
  "cool-cat": "😎",
  "tongue-out-cat": "😛",
  "wink-cat": "😜",
  "lol-cat": "😂",
  "upside-down-cat": "🤪",
  "huh-cat": "🤨",
  "love-it-cat": "😍",
  "fav-it-cat": "[star cat]",
  "rainbow-cat": "[rainbow cat]",
  "pizza-cat": "[pizza cat]",
  "10mil": "🎉",
  waffle: "🧇",
  taco: "🌮",
  sushi: "🍣",
  apple: "🍎",
  broccoli: "🥦",
  pizza: "🍕",
  candycorn: "🍭",
  map: "🗺️",
  camera: "📷",
  suitcase: "💼",
  compass: "🧭",
  binoculars: "[binoculars]",
  cupcake: "🧁",
  pride: "🏳️‍🌈",
  blm: "✊🏾",
};

export const emojiTextToEmoji = (emojiText: string) => {
  Object.entries(REPLACEMENTS).forEach(([name, emoji]) => {
    emojiText = emojiText.replace(
      new RegExp(
        `<img src="/images/emoji/${name}.png" class="emoji" alt="(.*?)">`,
        "g",
      ),
      emoji,
    );
  });
  return emojiText
    .replace(
      /<img src="\/images\/emoji\/meow.png" class="emoji" alt="(.*?)">/,
      "😺",
    )
    .replace(
      /<img src="\/images\/emoji\/gobo.png" class="emoji" alt="(.*?)">/,
      "[gobo]",
    )
    .replace(
      /<img src="\/images\/emoji\/cat.png" class="emoji" alt="(.*?)">/,
      "🙂",
    )
    .replace(
      /<img src="\/images\/emoji\/aww-cat.png" class="emoji" alt="(.*?)">/,
      "😃",
    )
    .replace(
      /<img src="\/images\/emoji\/cool-cat.png" class="emoji" alt="(.*?)">/,
      "😎",
    );
};
