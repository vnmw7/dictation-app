import { describe, it } from "node:test";
import assert from "node:assert/strict";

import { processVerbatimTranscript } from "../../src/helpers/verbatimProcessing.js";

describe("processVerbatimTranscript", () => {
  it("trims whitespace from ends", () => {
    assert.equal(
      processVerbatimTranscript("  hello world  "),
      "hello world",
    );
  });

  it("handles null or undefined gracefully", () => {
    assert.equal(processVerbatimTranscript(null), "");
    assert.equal(processVerbatimTranscript(undefined), "");
  });

  it("does not alter sensitive terms, PII, or apply AI formatting", () => {
    const rawText =
      " The password is P@ssw0rd123 and my SSN is 000-00-0000. DO NOT CHANGE THIS! ";
    const expected =
      "The password is P@ssw0rd123 and my SSN is 000-00-0000. DO NOT CHANGE THIS!";

    assert.equal(processVerbatimTranscript(rawText), expected);
  });

  it("preserves trailing newlines internally but trims the edges", () => {
    const rawText = "\n\nLine 1\nLine 2\n\n";
    const expected = "Line 1\nLine 2";

    assert.equal(processVerbatimTranscript(rawText), expected);
  });
});
