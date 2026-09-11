import type { Metadata } from "next";
import { PageHeader } from "@/components/marketing/page-header";
import { Container } from "@/components/ui/container";
import { JoinFlow } from "@/components/forms/join-flow";
import { packages } from "@/config/packages";

export const metadata: Metadata = {
  title: "Join",
  description:
    "Complete your Diaspora Funeral Services application — your details, your family, your beneficiary, and review.",
  robots: { index: false, follow: true },
};

export default async function JoinPage({
  searchParams,
}: {
  searchParams: Promise<{ package?: string }>;
}) {
  const { package: pkgParam } = await searchParams;
  const initialPackage = packages.some((p) => p.slug === pkgParam) ? pkgParam : undefined;

  return (
    <>
      <PageHeader
        eyebrow="Join"
        title="A few details, and your family is protected."
        intro="We've kept your package and any services you chose. This takes about five minutes — and you can stop and come back to it."
      />
      <section className="bg-void py-12 md:py-16">
        <Container className="max-w-3xl">
          <JoinFlow initialPackage={initialPackage} />
        </Container>
      </section>
    </>
  );
}
