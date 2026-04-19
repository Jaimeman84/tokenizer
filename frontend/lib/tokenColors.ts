// Pairs of [bg, text] Tailwind classes for alternating token colors
const TOKEN_PALETTE = [
  ["bg-blue-100 text-blue-800 border-blue-200", ""],
  ["bg-purple-100 text-purple-800 border-purple-200", ""],
  ["bg-green-100 text-green-800 border-green-200", ""],
  ["bg-orange-100 text-orange-800 border-orange-200", ""],
  ["bg-pink-100 text-pink-800 border-pink-200", ""],
  ["bg-teal-100 text-teal-800 border-teal-200", ""],
  ["bg-yellow-100 text-yellow-800 border-yellow-200", ""],
  ["bg-red-100 text-red-800 border-red-200", ""],
];

export function getTokenColor(index: number): string {
  return TOKEN_PALETTE[index % TOKEN_PALETTE.length][0];
}
