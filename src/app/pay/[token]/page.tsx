import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { PageHeader } from "@/components/marketing/page-header";
import { PublicPayPanel } from "@/components/forms/public-pay-panel";

export const metadata: Metadata = {
  title: "Complete your payment",
  robots: { index: false, follow: false },
};

export default async function PayPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;

  return (
    <>
      <PageHeader
        eyebrow="Payment"
        title="Complete your payment"
        intro="No account or login needed — just confirm how you'd like to pay."
      />
      <section className="bg-void py-12 md:py-16">
        <Container className="max-w-md">
          <PublicPayPanel token={token} />
        </Container>
      </section>
    </>
  );
}
