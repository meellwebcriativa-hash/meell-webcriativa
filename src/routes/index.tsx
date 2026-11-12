import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  Brush,
  Eye,
  Globe,
  Heart,
  Lock,
  MessageCircle,
  Sparkles,
  Wand2,
} from "lucide-react";
import hero from "@/assets/hero-web-criativa.jpg";
import { Logo } from "@/components/brand/Logo";
import { PageBackdrop } from "@/components/brand/PageBackdrop";
import { Button } from "@/components/ui/button";
import { SEGMENTS } from "@/lib/constants";
import { linkPedirCadastro, linkSitePersonalizado } from "@/lib/whatsapp";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Web Criativa — Sua ideia. Seu estilo. Seu site." },
      {
        name: "description",
        content: "Crie seu site profissional em poucos passos ou peça um site sob medida para a Meell Criativa.",
      },
      { property: "og:title", content: "Web Criativa — Sua ideia. Seu estilo. Seu site." },
      {
        property: "og:description",
        content: "Crie seu site profissional em poucos passos ou peça um site sob medida para a Meell Criativa.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Landing,
});

const steps = [
  { icon: Brush, title: "Escolha seu estilo", text: "Elegante, moderno, delicado ou minimalista — você escolhe o jeito do seu negócio." },
  { icon: Wand2, title: "Personalize com facilidade", text: "Cores, fotos, textos e páginas em formulários simples, sem precisar entender de design." },
  { icon: Globe, title: "Publique e compartilhe", text: "Seu site ganha um endereço próprio para enviar às suas clientes." },
];

function Landing() {
  return (
    <div className="relative isolate min-h-screen">
      <PageBackdrop />
      <header className="mx-auto flex h-20 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Logo />
        <Button asChild variant="soft">
          <Link to="/auth">Entrar</Link>
        </Button>
      </header>

      <section className="mx-auto grid max-w-6xl items-center gap-10 px-4 pt-6 pb-16 sm:px-6 lg:grid-cols-[1.05fr_1fr] lg:pt-12">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full bg-card px-4 py-1.5 text-xs font-medium tracking-wide text-secondary-foreground shadow-card">
            <Sparkles className="size-3.5 text-pink" /> Mais um produto Meell Criativa
          </span>
          <h1 className="mt-6 text-5xl leading-[1.05] font-semibold text-plum sm:text-6xl lg:text-7xl">
            Sua ideia.
            <br />
            Seu estilo.
            <br />
            <span className="text-gradient-brand italic">Seu site.</span>
          </h1>
          <p className="mt-6 max-w-lg text-lg text-muted-foreground">
            Monte um site profissional em poucos passos, mesmo sem saber nada de design — ou peça para a gente criar
            um sob medida para você.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild variant="brand" size="lg">
              <Link to="/auth">
                Entrar na plataforma <ArrowRight />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <a href="#como-funciona">Como funciona</a>
            </Button>
          </div>
          <p className="mt-5 inline-flex items-center gap-2 text-sm text-muted-foreground">
            <Lock className="size-4 text-lilac" /> Acesso exclusivo para clientes convidadas.
          </p>
        </div>
        <div className="relative">
          <div className="absolute -inset-6 -z-10 rounded-[3rem] bg-brand opacity-20 blur-3xl" />
          <img
            src={hero}
            alt="Notebook e celular mostrando um site em tons de lilás e rosa"
            width={1600}
            height={1104}
            className="w-full rounded-[2.5rem] border border-card shadow-candy animate-float-soft"
          />
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-20 sm:px-6">
        <h2 className="text-center text-3xl font-semibold text-plum sm:text-4xl">Duas formas de ter seu site</h2>
        <div className="mt-10 grid gap-6 md:grid-cols-2">
          <div className="relative h-full">
            {/* brilho lilás com halo rosa atrás do card flutuante */}
            <div
              aria-hidden
              className="animate-drift-slow pointer-events-none absolute -inset-5 rounded-[3rem] bg-gradient-to-br from-lilac/60 via-lilac/30 to-pink/55 opacity-70 blur-2xl"
            />
            <div
              aria-hidden
              className="pointer-events-none absolute inset-x-8 -bottom-7 h-20 rounded-full bg-pink/45 blur-2xl"
            />
            <Link
              to="/auth"
              className="group animate-float-soft relative flex h-full flex-col rounded-[2rem] border bg-card p-8 shadow-candy"
            >
              <div className="flex size-12 items-center justify-center rounded-2xl bg-lilac-soft text-secondary-foreground">
                <Wand2 />
              </div>
              <h3 className="mt-5 text-2xl font-semibold text-plum">Criar meu próprio site</h3>
              <p className="mt-2 text-muted-foreground">
                Escolha o seu segmento e receba um site já montado para ele — depois é só trocar
                textos, preços e fotos.
              </p>
              <span className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-primary">
                Começar agora <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
              </span>
            </Link>
          </div>
          <a
            href={linkSitePersonalizado}
            target="_blank"
            rel="noreferrer"
            className="group flex flex-col rounded-[2rem] bg-brand p-8 text-primary-foreground shadow-candy transition-all hover:-translate-y-1 hover:bg-brand-hover"
          >
            <div className="flex size-12 items-center justify-center rounded-2xl bg-card/25">
              <Heart />
            </div>
            <h3 className="mt-5 text-2xl font-semibold">Quero um site personalizado</h3>
            <p className="mt-2 opacity-90">
              Conte sobre o seu negócio, envie logo e fotos, e a Meell Criativa desenvolve tudo para você aprovar.
            </p>
            <span className="mt-6 inline-flex items-center gap-2 text-sm font-medium">
              <MessageCircle className="size-4" /> Pedir pelo WhatsApp
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
            </span>
          </a>
        </div>
      </section>

      <section id="como-funciona" className="scroll-mt-10 bg-soft py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <p className="text-center text-xs font-medium tracking-[0.2em] text-lilac uppercase">Como funciona</p>
          <h2 className="mt-2 text-center text-3xl font-semibold text-plum sm:text-4xl">Simples do começo ao fim</h2>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {steps.map((s, i) => (
              <div key={s.title} className="rounded-3xl bg-card p-7 shadow-card">
                <div className="flex items-center gap-3">
                  <span className="font-display text-3xl text-gradient-brand">0{i + 1}</span>
                  <s.icon className="size-5 text-lilac" />
                </div>
                <h3 className="mt-4 text-xl font-semibold text-plum">{s.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{s.text}</p>
              </div>
            ))}
          </div>
          <div className="mt-12 flex flex-wrap justify-center gap-2">
            {SEGMENTS.map((s) => (
              <Link
                key={s.value}
                to="/auth"
                title={`Entrar e ver o modelo de ${s.label}`}
                className="rounded-full border bg-card px-4 py-2 text-sm text-secondary-foreground transition-colors hover:border-ring hover:text-primary"
              >
                {s.emoji} {s.label}
              </Link>
            ))}
          </div>
          <p className="mt-4 text-center text-sm text-muted-foreground">
            Cada segmento já vem com um modelo pronto — entre para ver o do seu negócio.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-4 py-20 text-center sm:px-6">
        <Eye className="mx-auto size-8 text-pink" />
        <h2 className="mt-4 text-3xl font-semibold text-plum sm:text-4xl">Já recebeu seu convite?</h2>
        <p className="mt-3 text-muted-foreground">Entre com o e-mail e a senha que você recebeu da Meell Criativa.</p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Button asChild variant="brand" size="lg">
            <Link to="/auth">
              Acessar minha conta <ArrowRight />
            </Link>
          </Button>
          <Button asChild variant="soft" size="lg">
            <a href={linkPedirCadastro} target="_blank" rel="noreferrer">
              <MessageCircle /> Ainda não tenho convite
            </a>
          </Button>
        </div>
      </section>

      <footer className="border-t py-8">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 sm:flex-row sm:px-6">
          <Logo />
          <p className="text-sm text-muted-foreground">© {new Date().getFullYear()} Meell Criativa. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  );
}
