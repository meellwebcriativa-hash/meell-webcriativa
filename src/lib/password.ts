/** Friendly random password for new client accounts (no ambiguous characters). */
export function generatePassword(length = 10) {
  const chars = "abcdefghjkmnpqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const values = new Uint32Array(length);
  crypto.getRandomValues(values);
  let out = "";
  for (const v of values) out += chars[v % chars.length];
  return out;
}
