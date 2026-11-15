import { describe, expect, it } from "vitest";

import { postLoginPath } from "@/lib/auth-redirect";

describe("post-login landing page", () => {
  it("sends a client to Meu painel", () => {
    expect(postLoginPath({ isAdmin: false })).toBe("/painel");
  });

  it("sends the administrator to Meu painel too", () => {
    expect(postLoginPath({ isAdmin: true })).toBe("/painel");
  });
});
