import type { Metadata } from "next";
import { PageHeader } from "@/components/marketing/page-header";
import { Container } from "@/components/ui/container";
import { QuoteWizard } from "@/components/forms/quote-wizard";
import { packages } from "@/config/packages";

export const metadata: Metadata = {
  title: "Get a Quote",
  description:
    "Build your family's funeral protection plan and get an indicative quote from Diaspora Funeral Services in a few minutes.",
};

export default async function GetAQuotePage({
  searchParams,
}: {
  searchParams: Promise<{ package?: string }>;
}) {
  const { package: pkgParam } = await searchParams;
  const initialPackage = packages.some((p) => p.slug === pkgParam) ? pkgParam : undefined;

  return (
    <>
      <PageHeader
        eyebrow="Get a quote"
        title="Your family protection plan, in a few minutes."
        intro="Choose a package, tell us who you're protecting, add the services that matter, and we'll send you an indicative premium with no obligation."
      />
      <section className="bg-void py-12 md:py-16">
        <Container className="max-w-3xl">
          <QuoteWizard initialPackage={initialPackage} />
        </Container>
      </section>
    </>
  );
}
