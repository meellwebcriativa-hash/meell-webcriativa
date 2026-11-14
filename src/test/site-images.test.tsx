import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { SiteRenderer } from "@/components/site/SiteRenderer";
import { storagePathsOf } from "@/lib/site-content";
import { starterContentFor } from "@/lib/site-templates";

describe("fotos do site", () => {
  it("o site publicado assina fotos da galeria, dos produtos e a foto principal", () => {
    const content = {
      ...starterContentFor("loja"),
      gallery: ["u1/projects/g.jpg"],
      heroImage: "u1/projects/hero.jpg",
      services: [
        { title: "Bolsa", description: "Couro", price: "R$ 99", image: "u1/projects/bolsa.jpg" },
        { title: "Kit", description: "Presente", price: "R$ 50" },
      ],
    };
    expect(storagePathsOf(content).sort()).toEqual(
      ["u1/projects/bolsa.jpg", "u1/projects/g.jpg", "u1/projects/hero.jpg"].sort(),
    );
  });

  it("a foto do produto aparece com o endereço assinado", () => {
    const content = {
      ...starterContentFor("loja"),
      services: [{ title: "Bolsa", description: "Couro", price: "R$ 99", image: "u1/bolsa.jpg" }],
    };
    render(
      <SiteRenderer
        name="Casa Aurora"
        segment="loja"
        template="moderno"
        content={content}
        urls={{ "u1/bolsa.jpg": "https://cdn.example/bolsa.jpg" }}
      />,
    );
    expect(screen.getByAltText("Bolsa")).toHaveAttribute("src", "https://cdn.example/bolsa.jpg");
  });

  it("no editor, clicar na foto principal abre a troca de foto", () => {
    const onEdit = vi.fn();
    render(
      <SiteRenderer
        name="Studio Bella"
        segment="salao"
        template="delicado"
        content={starterContentFor("salao")}
        preview
        onEditHeroImage={onEdit}
      />,
    );
    fireEvent.click(screen.getByRole("button", { name: /trocar a foto principal/i }));
    expect(onEdit).toHaveBeenCalledTimes(1);
  });

  it("no site publicado a foto principal não vira botão", () => {
    render(
      <SiteRenderer name="Studio Bella" segment="salao" template="delicado" content={starterContentFor("salao")} />,
    );
    expect(screen.queryByRole("button", { name: /trocar a foto principal/i })).toBeNull();
  });
});
