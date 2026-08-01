const test = require("node:test");
const assert = require("node:assert/strict");

const {
  DEFAULT_WHISPER_MODEL,
  getWhisperOnlyOnboardingPatch,
} = require("../../src/helpers/onboardingTranscriptionPolicy.cjs");

test("the default whisper model is base", () => {
  assert.equal(DEFAULT_WHISPER_MODEL, "base");
});

test("normalizes a cloud selection to local whisper", () => {
  const patch = getWhisperOnlyOnboardingPatch({
    useLocalWhisper: false,
    localTranscriptionProvider: "whisper",
    whisperModel: "base",
  });

  assert.deepEqual(patch, { useLocalWhisper: true });
});

test("normalizes an NVIDIA local provider to whisper", () => {
  const patch = getWhisperOnlyOnboardingPatch({
    useLocalWhisper: true,
    localTranscriptionProvider: "nvidia",
    whisperModel: "base",
  });

  assert.deepEqual(patch, { localTranscriptionProvider: "whisper" });
});

test("defaults an empty whisper model selection to base", () => {
  const patch = getWhisperOnlyOnboardingPatch({
    useLocalWhisper: true,
    localTranscriptionProvider: "whisper",
    whisperModel: "",
  });

  assert.deepEqual(patch, { whisperModel: "base" });
});

test("returns an empty patch when settings already satisfy the policy", () => {
  const patch = getWhisperOnlyOnboardingPatch({
    useLocalWhisper: true,
    localTranscriptionProvider: "whisper",
    whisperModel: "tiny",
  });

  assert.deepEqual(patch, {});
});

test("normalizes every violating field at once", () => {
  const patch = getWhisperOnlyOnboardingPatch({
    useLocalWhisper: false,
    localTranscriptionProvider: "nvidia",
    whisperModel: "",
  });

  assert.deepEqual(patch, {
    useLocalWhisper: true,
    localTranscriptionProvider: "whisper",
    whisperModel: "base",
  });
});

test("is idempotent — applying the patch twice yields no further change", () => {
  const initial = {
    useLocalWhisper: false,
    localTranscriptionProvider: "nvidia",
    whisperModel: "",
  };

  const firstPatch = getWhisperOnlyOnboardingPatch(initial);
  const normalized = { ...initial, ...firstPatch };
  const secondPatch = getWhisperOnlyOnboardingPatch(normalized);

  assert.deepEqual(secondPatch, {});
});

test("never includes unrelated cloud or nvidia settings in the patch", () => {
  const patch = getWhisperOnlyOnboardingPatch({
    useLocalWhisper: false,
    localTranscriptionProvider: "nvidia",
    whisperModel: "",
  });

  // The patch must only describe transcription selection normalization.
  // Cloud/NVIDIA state is preserved for use after onboarding.
  assert.deepEqual(Object.keys(patch).sort(), [
    "localTranscriptionProvider",
    "useLocalWhisper",
    "whisperModel",
  ]);

  assert.equal("cloudTranscriptionProvider" in patch, false);
  assert.equal("cloudTranscriptionModel" in patch, false);
  assert.equal("cloudTranscriptionBaseUrl" in patch, false);
  assert.equal("parakeetModel" in patch, false);
  assert.equal("openaiApiKey" in patch, false);
  assert.equal("preferredLanguage" in patch, false);
});
