export function formatBase64(base64: string): string {
  if (!base64) return '';
  if (base64.startsWith('data:image')) return base64;
  return `data:image/png;base64,${base64}`;
}