import type { Metadata } from "next";
import { PageHeader } from "@/components/marketing/page-header";
import { Section } from "@/components/ui/section";
import { CtaBand, TrustStrip } from "@/components/marketing/sections";
import { NeedsInput } from "@/components/ui/primitives";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Why Diaspora Funeral Services exists: distance should never determine the quality of care your family receives. Technology and human care, for families in Zimbabwe and the diaspora.",
};

export default function AboutPage() {
  return (
    <>
      <PageHeader
        eyebrow="About us"
        title="Distance should never determine the quality of care your family receives."
        intro="Diaspora Funeral Services was built for a simple, difficult reality: families are spread across the world, but a death still happens in one place, and someone still has to make sure the farewell is handled with dignity."
      />

      <Section tone="ivory">
        <div className="dfs-prose mx-auto max-w-3xl">
          <h2>Why DFS exists</h2>
          <p>
            For many Zimbabwean families, the people who provide are not the people who are present.
            A parent, a sibling, a child builds a life abroad — and carries the weight of a family
            back home. When someone passes away, that weight becomes urgent, practical and lonely all
            at once: flights to book, arrangements to make, money to send, and the constant worry
            that something will not be done properly because you are not there to see it.
          </p>
          <p>
            DFS exists to take that weight. We are a complete funeral fulfilment and funeral
            protection service — not just cover, but coordination. You choose the level of protection
            and the level of personalisation you want. We make it happen, and we keep you informed
            while we do.
          </p>

          <h2>The problem with distance</h2>
          <p>
            Traditional funeral cover was designed for families who live together. It assumes someone
            local will handle everything, that payments happen in person, that communication happens
            face to face. For a family split between Harare and London, Bulawayo and Johannesburg, a
            rural home and Perth, that model quietly fails at the moment it matters most.
          </p>

          <h2>Why dignity matters</h2>
          <p>
            A funeral is one of the few things a family does together that cannot be redone. It
            carries grief, culture, faith, status and love all at once. Getting the details right —
            the casket, the flowers, the programme, the words — is not vanity. It is how a family
            says goodbye, and how it remembers having done so.
          </p>

          <h2>Technology and human care</h2>
          <p>
            We combine both deliberately. The technology means you can join online, pay digitally,
            build exactly the funeral you want, and follow every update from your phone. The human
            care means that when your family needs us, a real person answers, coordinates, and stays
            with you until it is done. Policy administration and communications run on the POL263
            platform, which handles the record-keeping, billing and messaging behind the scenes.
          </p>

          <h2>Premium without elitism</h2>
          <p>
            We serve a family choosing our Essential package with the same respect as a family
            choosing Bespoke. The difference between our packages is the level of service and choice
            — never the value of a person&rsquo;s life. Every family matters.
          </p>

          <h2>Our commitment to Zimbabwe — and beyond</h2>
          <p>
            We are starting where the need is clearest: families in Zimbabwe, and Zimbabweans abroad
            who want to protect and provide for them. Over time we intend to serve more of the
            diaspora and more of the region. But the promise does not change:{" "}
            <strong>your family, your wishes, our commitment to make it happen.</strong>
          </p>

          <h2>Our story, our people, our track record</h2>
          <p>
            <NeedsInput>
              CONTENT REQUIRED FROM DFS — founding story, leadership, years of operation, number of
              families served, licensing and any accreditations or partnerships. We do not publish
              these until DFS confirms them.
            </NeedsInput>
          </p>
        </div>
      </Section>

      <TrustStrip />

      <CtaBand />
    </>
  );
}
