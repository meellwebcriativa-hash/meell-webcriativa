import { useState } from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { SegmentPicker } from "@/components/app/SegmentPicker";
import { SiteRenderer } from "@/components/site/SiteRenderer";
import { SEGMENTS } from "@/lib/constants";
import { hasCustomContent, starterContentFor, withSegmentTemplate } from "@/lib/site-templates";

function PickerHarness() {
  const [value, setValue] = useState("");
  return <SegmentPicker value={value} other="" onChange={setValue} onOtherChange={() => {}} />;
}

describe("segment picker", () => {
  it("marca o segmento clicado e avisa a escolha", () => {
    render(<PickerHarness />);
    const papelaria = screen.getByRole("button", { name: /papelaria/i });

    expect(papelaria).toHaveAttribute("aria-pressed", "false");
    fireEvent.click(papelaria);

    expect(papelaria).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByText(/papelaria selecionado/i)).toBeInTheDocument();
  });
});

describe("modelos prontos por nicho", () => {
  it("todo segmento tem um site já montado", () => {
    for (const segment of SEGMENTS) {
      const content = starterContentFor(segment.value);
      expect(content.tagline.length, segment.value).toBeGreaterThan(20);
      expect(content.about.length, segment.value).toBeGreaterThan(60);
      expect(content.services.length, segment.value).toBeGreaterThanOrEqual(3);
      expect(content.hours.length, segment.value).toBeGreaterThan(5);
      expect(content.gallery).toEqual([]);
    }
  });

  it("o modelo de papelaria fala de convites e planners", () => {
    const content = starterContentFor("papelaria");
    expect(content.tagline.toLowerCase()).toContain("convites");
    expect(
      content.services
        .map((service) => service.title)
        .join(" ")
        .toLowerCase(),
    ).toContain("planner");
  });

  it("aplica o modelo do novo nicho sem apagar fotos e contatos", () => {
    const base = {
      ...starterContentFor("salao"),
      whatsapp: "51999999999",
      gallery: ["fotos/salao.jpg"],
    };

    const next = withSegmentTemplate(base, "papelaria");

    expect(next.whatsapp).toBe("51999999999");
    expect(next.gallery).toEqual(["fotos/salao.jpg"]);
    expect(next.tagline.toLowerCase()).toContain("convites");
    expect(next.services[0]?.title).toContain("Convites");
  });

  it("identifica quando a cliente já personalizou o site", () => {
    const starter = starterContentFor("papelaria");
    expect(hasCustomContent(starter)).toBe(true);
    expect(hasCustomContent({ ...starter, tagline: "", about: "", hours: "", services: [] })).toBe(
      false,
    );
  });

  it("a prévia de papelaria já parece um site pronto", () => {
    render(
      <SiteRenderer
        name="Ateliê Papel"
        segment="papelaria"
        template="delicado"
        content={starterContentFor("papelaria")}
        preview
      />,
    );

    expect(screen.getAllByText(/convites personalizados/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/papelaria/i).length).toBeGreaterThan(0);
    expect(screen.queryByText(/adicione os serviços/i)).not.toBeInTheDocument();
  });
});
