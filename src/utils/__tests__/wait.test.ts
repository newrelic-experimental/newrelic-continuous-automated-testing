import { wait } from "../wait";
import { describe, expect, it } from "@jest/globals";

describe("wait.ts", () => {
  it("throws an invalid number", async () => {
    const input = parseInt("foo", 10);
    expect(isNaN(input)).toBe(true);

    await expect(wait(input)).rejects.toThrow("milliseconds not a number");
  });

  it("waits with a valid number", async () => {
    const start = new Date();
    await wait(500);
    const end = new Date();

    const delta = Math.abs(end.getTime() - start.getTime());

    expect(delta).toBeGreaterThan(450);
  });
});
