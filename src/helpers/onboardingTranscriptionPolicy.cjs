// @ts-check
"use strict";

/**
 * Onboarding transcription selection policy.
 *
 * During the restricted local whisper.cpp-only onboarding, the persisted
 * transcription settings may be stale (e.g. a user resuming onboarding who
 * previously selected cloud or NVIDIA). This helper computes the minimal
 * patch required to normalize those settings to a valid local-whisper-only
 * configuration, without touching unrelated cloud/NVIDIA state that should
 * remain available after onboarding completes.
 *
 * Kept pure and synchronous so it is trivial to test with Node's built-in
 * test runner and idempotent under React Strict Mode's double-invoke.
 */

/** Default whisper.cpp model used when none is selected. */
const DEFAULT_WHISPER_MODEL = "base";

/**
 * Settings relevant to the local-whisper-only policy.
 *
 * @typedef {Object} WhisperOnlySettings
 * @property {boolean} useLocalWhisper
 * @property {string} localTranscriptionProvider
 * @property {string} whisperModel
 */

/**
 * Compute the patch that normalizes persisted transcription settings to the
 * local whisper.cpp-only onboarding policy.
 *
 * Only fields that violate the policy are included. Unrelated cloud/NVIDIA
 * settings (cloud provider, cloud model, base URL, API keys, parakeet model)
 * are intentionally never part of the patch so they remain preserved for use
 * after onboarding.
 *
 * @param {WhisperOnlySettings} settings
 * @returns {Partial<WhisperOnlySettings>}
 */
function getWhisperOnlyOnboardingPatch(settings) {
  const patch = {};

  if (!settings.useLocalWhisper) {
    patch.useLocalWhisper = true;
  }

  if (settings.localTranscriptionProvider !== "whisper") {
    patch.localTranscriptionProvider = "whisper";
  }

  if (!settings.whisperModel) {
    patch.whisperModel = DEFAULT_WHISPER_MODEL;
  }

  return patch;
}

module.exports = {
  DEFAULT_WHISPER_MODEL,
  getWhisperOnlyOnboardingPatch,
};
