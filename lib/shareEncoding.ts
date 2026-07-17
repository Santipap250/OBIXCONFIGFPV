export interface SharedPresetPayload {
  name: string;
  cliSnippet: string;
  style: string;
}

/**
 * Encodes a preset into a compact, URL-safe string carried entirely in the
 * link itself — no database, no server-side storage. Whoever opens the link
 * decodes the same payload straight out of the URL.
 */
export function encodeSharedPreset(payload: SharedPresetPayload): string {
  const json = JSON.stringify(payload);
  const bytes = new TextEncoder().encode(json);
  let binary = "";
  bytes.forEach((b) => {
    binary += String.fromCharCode(b);
  });
  const base64 = btoa(binary);
  return base64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

export function decodeSharedPreset(encoded: string): SharedPresetPayload | null {
  try {
    const base64 = encoded.replace(/-/g, "+").replace(/_/g, "/");
    const padded = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), "=");
    const binary = atob(padded);
    const bytes = Uint8Array.from(binary, (c) => c.charCodeAt(0));
    const json = new TextDecoder().decode(bytes);
    const parsed = JSON.parse(json);
    if (
      typeof parsed === "object" &&
      parsed !== null &&
      typeof parsed.name === "string" &&
      typeof parsed.cliSnippet === "string" &&
      typeof parsed.style === "string"
    ) {
      return parsed as SharedPresetPayload;
    }
    return null;
  } catch {
    return null;
  }
}
