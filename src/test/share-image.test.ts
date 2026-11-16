import { describe, expect, it } from "vitest";
import { defaultShareImagePath, shareImageSource, shareImageUrl } from "@/lib/share-image";

describe("miniatura do link compartilhado", () => {
  it("usa a foto principal enviada pela cliente", () => {
    expect(shareImageSource("u1/projects/hero.jpg", "salao")).toEqual({ kind: "storage", path: "u1/projects/hero.jpg" });
  });

  it("sem foto enviada, usa a foto principal do modelo do segmento", () => {
    expect(shareImageSource("", "barbearia")).toEqual({ kind: "default", path: "/og/segments/barbearia.jpg" });
    expect(shareImageSource(undefined, "confeitaria")).toEqual({ kind: "default", path: "/og/segments/confeitaria.jpg" });
  });

  it("segmento desconhecido cai no modelo 'outro'", () => {
    expect(defaultShareImagePath("pet-shop")).toBe("/og/segments/outro.jpg");
  });

  it("o endereço da miniatura é absoluto e muda quando o site é salvo", () => {
    const a = shareImageUrl("https://meell-webcriativa.lovable.app", "studio-bella", "2026-11-15T10:00:00Z");
    const b = shareImageUrl("https://meell-webcriativa.lovable.app", "studio-bella", "2026-11-15T11:00:00Z");
    expect(a.startsWith("https://meell-webcriativa.lovable.app/api/public/share-image/studio-bella?v=")).toBe(true);
    expect(a).not.toBe(b);
  });
});
