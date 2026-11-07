export const MAX_HINTS = 3;

export const HINT_COOLDOWN_MS = 30_000;

export type HintState = {
  hintsUsed: number;
  cooldownUntil: number | null;
};

/**
 * A hint is available only while under the cap and once any active
 * cooldown has elapsed. `now` is injectable so callers/tests can keep
 * the check deterministic.
 */
export function canUseHint(
  hintsUsed: number,
  cooldownUntil: number | null,
  now: number = Date.now()
): boolean {
  if (hintsUsed >= MAX_HINTS) return false;
  if (cooldownUntil !== null && now < cooldownUntil) return false;
  return true;
}

export function nextHintState(
  hintsUsed: number,
  now: number = Date.now()
): HintState {
  const nextUsed = Math.min(hintsUsed + 1, MAX_HINTS);
  const reachedCap = nextUsed >= MAX_HINTS;

  return {
    hintsUsed: nextUsed,
    cooldownUntil: reachedCap ? null : now + HINT_COOLDOWN_MS,
  };
}
