import type { Metadata } from "next";
import { PageHeader } from "@/components/marketing/page-header";
import { Section, SectionHeading } from "@/components/ui/section";
import { LeadForm } from "@/components/forms/lead-form";

export const metadata: Metadata = {
  title: "Share Your Story",
  description:
    "Has Diaspora Funeral Services cared for your family? Tell us about your experience — with your permission, it may help another family decide.",
};

/**
 * Testimonial collection. Submissions land in POL263 as a "testimonial" lead.
 * Nothing is published until the family approves the final wording; approved
 * quotes are added to `testimonials` in src/config/content.ts with a consentDate.
 */
export default function ShareYourStoryPage() {
  return (
    <>
      <PageHeader
        eyebrow="Share your story"
        title="Has DFS cared for your family?"
        intro="Your words help other families trust us at one of the hardest moments of their lives. Tell us about your experience, good or bad. We read every one."
      />

      <Section tone="ivory">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.2fr]">
          <div>
            <SectionHeading title="How it works" />
            <ol className="mt-6 space-y-4 text-sm leading-relaxed text-stone">
              <li>
                <span className="font-semibold text-ink">1. Tell us in your own words.</span> A few
                sentences is enough — what happened, and what it meant to your family.
              </li>
              <li>
                <span className="font-semibold text-ink">2. You approve before anything is published.</span>{" "}
                If we&rsquo;d like to feature your story, we may shorten it. We send you the final
                wording first, and it only goes live if you say yes.
              </li>
              <li>
                <span className="font-semibold text-ink">3. You choose how you&rsquo;re named.</span>{" "}
                Your full name, your first name and initial, or simply &ldquo;a family in
                Bulawayo&rdquo;.
              </li>
              <li>
                <span className="font-semibold text-ink">4. Change your mind at any time.</span> Ask
                us and we&rsquo;ll take it down.
              </li>
            </ol>
            <p className="mt-6 rounded-xl bg-cream p-4 text-sm text-stone">
              If something about our service wasn&rsquo;t right, please tell us here too. It goes
              straight to our team, and we&rsquo;ll be in touch to put it right.
            </p>
          </div>

          <LeadForm
            source="testimonial"
            title="Your experience"
            submitLabel="Send my story"
            showMessageField={false}
            successTitle="Thank you for sharing your story."
            successBody="We read every one. If we'd like to feature it, we'll send you the final wording to approve first — nothing is published without your yes."
            extraFields={[
              {
                name: "message",
                label: "Your story",
                type: "textarea",
                required: true,
                placeholder: "What happened, how we helped, and what it meant to your family.",
              },
              { name: "location", label: "Where you live", type: "text", placeholder: "e.g. Leicester, UK" },
              {
                name: "serviceUsed",
                label: "What we helped with",
                type: "select",
                options: [
                  "Essential package",
                  "Classic package",
                  "Prestige package",
                  "Bespoke package",
                  "Arranged a funeral without a policy",
                  "A personalised service or add-on",
                  "Something else",
                ],
              },
              { name: "rating", label: "Overall, how was your experience?", type: "select", options: ["5 — Excellent", "4 — Good", "3 — Okay", "2 — Poor", "1 — Very poor"] },
              {
                name: "displayName",
                label: "If we feature your story, name me as",
                type: "select",
                options: ["My full name", "My first name and initial", "Anonymous (e.g. “a family in Bulawayo”)"],
              },
              {
                name: "consentToPublish",
                label:
                  "DFS may feature my story on its website and social media, lightly edited for length. I'll be sent the final wording to approve before it is published, and I can ask for it to be removed at any time.",
                type: "checkbox",
              },
            ]}
          />
        </div>
      </Section>
    </>
  );
}
