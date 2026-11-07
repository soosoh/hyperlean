export const MAX_HINTS = 3;
export const HINT_COOLDOWN_MS = 30_000;

/**
 * A hint may be used when the per-proof cap has not been reached and the
 * cooldown has elapsed.
 */
export function canUseHint(
  hintsUsed: number,
  cooldownUntil: number | null,
  now: number = Date.now(),
): boolean {
  if (hintsUsed >= MAX_HINTS) return false;
  if (cooldownUntil !== null && now < cooldownUntil) return false;
  return true;
}

/**
 * Returns the next hint bookkeeping state. The hint cap is never exceeded and
 * a fresh cooldown is started.
 */
export function nextHintState(
  hintsUsed: number,
  now: number = Date.now(),
): { hintsUsed: number; cooldownUntil: number } {
  return {
    hintsUsed: Math.min(hintsUsed + 1, MAX_HINTS),
    cooldownUntil: now + HINT_COOLDOWN_MS,
  };
}

export function remainingCooldownSeconds(
  cooldownUntil: number | null,
  now: number = Date.now(),
): number {
  if (cooldownUntil === null) return 0;
  return Math.max(0, Math.ceil((cooldownUntil - now) / 1000));
}
