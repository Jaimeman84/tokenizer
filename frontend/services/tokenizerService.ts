import { API_URL } from "@/lib/constants";
import { TokenizeRequest, TokenizeResponse } from "@/types/tokenizer";

export async function tokenizeSections(
  request: TokenizeRequest
): Promise<TokenizeResponse> {
  const res = await fetch(`${API_URL}/tokenize`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(request),
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.detail ?? `Request failed (${res.status})`);
  }

  return res.json() as Promise<TokenizeResponse>;
}
