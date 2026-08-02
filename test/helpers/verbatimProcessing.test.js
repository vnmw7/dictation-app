import { describe, it, expect } from "vitest";
import { processVerbatimTranscript } from "../../src/helpers/verbatimProcessing";

describe("processVerbatimTranscript", () => {
  it("trims whitespace from ends", () => {
    expect(processVerbatimTranscript("  hello world  ")).toBe("hello world");
  });

  it("handles null or undefined gracefully", () => {
    // Depending on strictness, we might want to cast or ignore.
    expect(processVerbatimTranscript(null)).toBe("");
    expect(processVerbatimTranscript(undefined)).toBe("");
  });

  it("does not alter sensitive terms, PII, or apply AI formatting", () => {
    // Tests that text passes through exactly as provided (excluding surrounding whitespace)
    const rawText = " The password is P@ssw0rd123 and my SSN is 000-00-0000. DO NOT CHANGE THIS! ";
    const expected = "The password is P@ssw0rd123 and my SSN is 000-00-0000. DO NOT CHANGE THIS!";
    
    expect(processVerbatimTranscript(rawText)).toBe(expected);
  });
  
  it("preserves trailing newlines internally but trims the edges", () => {
    const rawText = "\n\nLine 1\nLine 2\n\n";
    const expected = "Line 1\nLine 2";
    expect(processVerbatimTranscript(rawText)).toBe(expected);
  });
});
