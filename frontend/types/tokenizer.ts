export interface TokenData {
  text: string;
  id: number;
  index: number;
}

export interface TokenSectionResponse {
  label: string;
  tokens: TokenData[];
  token_count: number;
  char_count: number;
}

export interface TokenizeResponse {
  sections: TokenSectionResponse[];
  total_token_count: number;
  total_char_count: number;
  encoding: string;
}

export interface TokenizeRequest {
  sections: { label: string; text: string }[];
  encoding?: string;
}
