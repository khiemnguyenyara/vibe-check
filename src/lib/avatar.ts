/**
 * Who represents a field, and what their face looks like in a small circle.
 *
 * Two sources, in priority order:
 *
 * 1. A hand-drawn field character (`FIELD_CHARACTERS`) when the domain has
 *    one. This is the real answer — Dok for `tech` today.
 * 2. A seeded generated avatar, for domains whose character hasn't been drawn
 *    yet. Kept so an uncharactered field still renders a stable face instead
 *    of a hole; it is a fallback, not a design.
 *
 * Lives in `src/lib` per docs/hla.md §6: shared by the interview Chat pane
 * and the `/fields` hero, domain-agnostic, and importing nothing from
 * `src/modules`. Keying by domain id (not specialty) is deliberate — a field
 * has one mentor, and a candidate practising Web Development and Mobile
 * Development should be talking to the same character both times.
 */

import { getOwn } from "@/lib/record";

export interface FieldCharacter {
  /** Path under /public. */
  readonly image: string;
  readonly name: string;
  /**
   * Framing for a circular avatar, applied to a `fill` + `object-cover`
   * `next/image`.
   *
   * Character art is full-body and portrait-shaped, so the default centered
   * cover crop lands on the torso and fills the circle with background. These
   * values re-aim it at the head, and they are per-character because the head
   * sits in a different place in every illustration — a shared constant would
   * be wrong for the second character added.
   *
   * Spelled out in full rather than interpolated: Tailwind's scanner cannot
   * see a class built from a runtime string, the same constraint
   * `components/fields/field-hero.ts` documents for its gradients.
   *
   * Object-position uses arbitrary-property syntax rather than the
   * `object-<value>` shorthand. Tailwind v4 reads that shorthand as object-fit and
   * silently emits no rule for a position value — the crop then falls back to
   * centred and lands on the character's torso, with nothing in the build to
   * say so. Verified present in the compiled CSS.
   *
   * Dok (1024x1536): `[object-position:50%_18%] scale-[1.75]` shows the visible source
   * region x[219,805] y[312,897] — cap, ears, glasses and a little hoodie,
   * with the head centred in the circle.
   */
  readonly avatarClassName: string;
}

const FIELD_CHARACTERS: Readonly<Record<string, FieldCharacter>> = {
  tech: {
    image: "/assets/dok.png",
    name: "Dok",
    avatarClassName: "[object-position:50%_18%] scale-[1.75]",
  },
};

/** The illustrated mentor for a field, or null when none is drawn yet. */
export function fieldCharacter(domainId?: string): FieldCharacter | null {
  if (!domainId) return null;
  return getOwn(FIELD_CHARACTERS, domainId) ?? null;
}

/**
 * Cartoon avatar, seeded so it stays stable across renders.
 *
 * The fallback for fields with no drawn character. `next.config.ts` allowlists
 * `api.dicebear.com` for `next/image`; a new remote source needs a matching
 * `remotePatterns` entry or the image silently fails to load.
 */
export function avatarUrl(seed: string): string {
  return `https://api.dicebear.com/9.x/adventurer/png?seed=${encodeURIComponent(seed)}&size=256&backgroundColor=transparent`;
}

/** Everything a circular avatar needs, whichever source it came from. */
export interface PersonaAvatarSource {
  readonly src: string;
  /** Object-fit classes. Empty for the generated avatar, which needs no reframing. */
  readonly className: string;
  /**
   * The character's name, or null for the generated fallback. Also serves as
   * the "is this the field's own character?" check — `name !== null`.
   */
  readonly name: string | null;
}

/**
 * The face to show for `domainId`, falling back to a `seed`-derived avatar.
 *
 * Callers render this decoratively (`alt=""`): the avatar sits beside the
 * interviewer's own message, so announcing "Dok" before every bubble would
 * add noise a screen-reader user cannot skip, and the message text is the
 * actual content. `name` is exposed for places that label the character
 * visibly, such as the `/fields` hero.
 */
export function personaAvatar(
  domainId: string | undefined,
  seed: string
): PersonaAvatarSource {
  const character = fieldCharacter(domainId);
  if (character) {
    return {
      src: character.image,
      className: character.avatarClassName,
      name: character.name,
    };
  }
  return { src: avatarUrl(seed), className: "", name: null };
}
