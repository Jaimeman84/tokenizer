"use client";

import { useState, useEffect } from "react";
import { useDebounce } from "./useDebounce";
import { tokenizeSections } from "@/services/tokenizerService";
import { TokenizeResponse } from "@/types/tokenizer";
import { DEBOUNCE_MS, DEFAULT_ENCODING } from "@/lib/constants";

interface UseTokenizerResult {
  data: TokenizeResponse | null;
  loading: boolean;
  error: string | null;
}

export function useTokenizer(
  systemPrompt: string,
  userPrompt: string,
  encoding: string = DEFAULT_ENCODING
): UseTokenizerResult {
  const [data, setData] = useState<TokenizeResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const debouncedSystem = useDebounce(systemPrompt, DEBOUNCE_MS);
  const debouncedUser = useDebounce(userPrompt, DEBOUNCE_MS);
  const debouncedEncoding = useDebounce(encoding, DEBOUNCE_MS);

  useEffect(() => {
    if (!debouncedSystem && !debouncedUser) {
      setData(null);
      setError(null);
      return;
    }

    let cancelled = false;

    async function run() {
      setLoading(true);
      setError(null);
      try {
        const result = await tokenizeSections({
          sections: [
            { label: "system", text: debouncedSystem },
            { label: "user", text: debouncedUser },
          ],
          encoding: debouncedEncoding,
        });
        if (!cancelled) {
          setData(result);
        }
      } catch (e) {
        if (!cancelled) {
          setError(
            e instanceof Error
              ? e.message
              : "Could not connect to the tokenizer service."
          );
          setData(null);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    run();
    return () => {
      cancelled = true;
    };
  }, [debouncedSystem, debouncedUser, debouncedEncoding]);

  return { data, loading, error };
}
