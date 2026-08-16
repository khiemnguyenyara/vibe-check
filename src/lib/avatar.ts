/**
 * Cartoon avatar, seeded per specialty so it stays stable across renders.
 * A stand-in for the hand-designed characters mentioned in the redesign
 * brief — swap this for a static asset once those exist, same call sites.
 *
 * Shared between the coach card (picking a specialty) and the interview
 * chat (talking to it) so the same character represents that specialty
 * everywhere it shows up.
 */
export function avatarUrl(seed: string): string {
  return `https://api.dicebear.com/9.x/adventurer/png?seed=${encodeURIComponent(seed)}&size=256&backgroundColor=transparent`;
}
