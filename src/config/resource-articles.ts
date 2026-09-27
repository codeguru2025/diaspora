/**
 * Article bodies for the resource centre, keyed by resource slug. Each section
 * matches one entry in that resource's `outline` (src/config/resources.ts).
 *
 * General guidance only — no policy rules beyond those configured in POL263
 * (see faqs.ts), and no legal advice. DFS should review before major campaigns.
 */

export type ArticleSection = { heading: string; paragraphs: string[] };

export const resourceArticles: Record<string, ArticleSection[]> = {
  "what-to-do-when-a-loved-one-dies-in-zimbabwe": [
    {
      heading: "The first phone calls to make",
      paragraphs: [
        "If the death happens at home, call the family doctor or the nearest clinic so the death can be confirmed. If it was sudden, unexpected or the result of an accident, the police must be informed and will guide the next steps. If the death happens in hospital, the hospital staff will do this for you.",
        "Then call us. If your family has a DFS policy, have the policy number ready, but don't delay if you can't find it — we can look it up. From that first call, a Funeral Care Consultant starts coordinating the collection of your loved one and the arrangements that follow.",
      ],
    },
    {
      heading: "Registering the death and the documents involved",
      paragraphs: [
        "A doctor issues a medical certificate stating the cause of death. That certificate, together with the deceased's national ID, is taken to the Registrar of Births and Deaths so the death can be registered. The registrar then issues a burial order, which is needed before the burial can take place, and a death certificate.",
        "Keep copies of the national ID, the medical certificate, the burial order and the death certificate together. You will need them for the funeral itself, for any funeral policy claim, and later for the estate. We will tell you exactly which documents we need and help you get any that are outstanding.",
      ],
    },
    {
      heading: "How DFS takes over the arrangements",
      paragraphs: [
        "Once we have been contacted, we arrange the collection and care of your loved one, confirm the package and any services your family has chosen, and agree a schedule with you — the date of the service, the venue, the burial location and the journey between them.",
        "We then coordinate the suppliers: the casket, the hearse, décor and tents, catering, flowers and anything else that has been chosen. You make the decisions that matter to your family; we make sure they happen.",
      ],
    },
    {
      heading: "Keeping family abroad informed",
      paragraphs: [
        "Families are rarely all in one place. Agree early on who will be the main contact with DFS, so decisions aren't made twice or contradicted. We send SMS and digital updates as the arrangements are confirmed, so relatives in London, Johannesburg or Perth can follow what is happening without a dozen phone calls.",
        "If some of the family can't travel, consider adding livestreaming so they can be present at the service, and a recording so they can watch it again later.",
      ],
    },
    {
      heading: "What to expect in the days before the funeral",
      paragraphs: [
        "Mourners will begin to gather at the family home, often within hours. It helps to decide early who will receive visitors, how people will be fed, and whether a tent and seating are needed at the home as well as at the service.",
        "In the final days we confirm the programme, the order of service, transport and the burial arrangements with you. On the day, our team is there so the family can be with each other rather than managing logistics.",
      ],
    },
  ],

  "funeral-planning-checklist": [
    {
      heading: "Service and venue decisions",
      paragraphs: [
        "Decide whether the service will be held at a church, at the family home, at a hall or at the graveside, and who will lead it. Confirm the date and time with the venue and the officiant before announcing it widely.",
        "Think about numbers. A funeral in Zimbabwe can draw a large crowd, and the venue, seating, tents and catering all depend on a realistic estimate.",
      ],
    },
    {
      heading: "The coffin or casket",
      paragraphs: [
        "Choose between a coffin and a casket, and the finish and lining. Your package sets the standard option; you can upgrade or choose a custom-made casket if the family wishes.",
        "Also decide on the lace, the blanket and any personal items to be placed with your loved one.",
      ],
    },
    {
      heading: "Personalisation choices",
      paragraphs: [
        "Small details carry a lot of meaning: a memorial banner at the venue, a printed programme with photographs and a short life story, personalised coffin lace, or a grave marker designed for the family.",
        "Agree the wording, the photographs and the spelling of every name early — these are the details that are hardest to change on the day.",
      ],
    },
    {
      heading: "Media and memories",
      paragraphs: [
        "Decide whether you want photography, videography or livestreaming, and who should receive the link. A memorial video or an online tribute page gives family and friends somewhere to share memories after the day itself.",
      ],
    },
    {
      heading: "Hospitality and travel",
      paragraphs: [
        "Plan how mourners will be fed at the home and after the burial, and whether refreshments are needed at the graveside. List the relatives who are travelling home, when they arrive, and whether they need transport or a travelling pack.",
      ],
    },
    {
      heading: "Who does what on the day",
      paragraphs: [
        "Name one family contact for DFS, one person to welcome and seat guests, and people for the eulogy, readings and the programme. Write it down and share it — on the day, nobody should have to guess.",
      ],
    },
  ],

  "diaspora-funeral-planning-guide": [
    {
      heading: "Why traditional funeral cover often falls short for the diaspora",
      paragraphs: [
        "Most funeral cover was designed for families who live together. It assumes someone local will handle the arrangements, that premiums are paid in person, and that news is shared face to face. When the person paying lives in another country, those assumptions quietly break down just when the family needs them most.",
        "A payout on its own doesn't arrange a funeral. Someone still has to find a casket, book a venue, organise tents and food, and make sure it is all done properly — often while grieving and thousands of kilometres away.",
      ],
    },
    {
      heading: "Setting up protection for family back home",
      paragraphs: [
        "With DFS you take out the policy yourself, from wherever you live, and cover your spouse or partner and your children. You choose the package — Essential, Classic, Prestige or Bespoke — and add the services that matter to your family.",
        "Premiums are paid online and you manage the policy through your customer portal, so nothing depends on someone at home visiting an office.",
      ],
    },
    {
      heading: "How remote coordination works",
      paragraphs: [
        "When a death occurs, you or a relative contacts us and a Funeral Care Consultant takes over on the ground. They agree the arrangements with the family, coordinate the suppliers and confirm every step with you.",
        "You decide the things only a family can decide. We handle the logistics that distance makes difficult.",
      ],
    },
    {
      heading: "Being present at the service from abroad",
      paragraphs: [
        "Livestreaming lets relatives who can't travel watch the service as it happens through a private link, with a recording afterwards. Where connectivity at a rural venue is uncertain, we tell you in advance so there are no surprises.",
        "An online tribute page lets family and friends around the world share messages and photographs in one place.",
      ],
    },
    {
      heading: "Travelling home for a funeral",
      paragraphs: [
        "If you are travelling, tell us your arrival dates so the schedule can take them into account. A travelling pack and travel and attendance assistance can take some of the pressure off the journey, so you arrive ready to be with your family.",
      ],
    },
  ],

  "how-to-plan-a-funeral-remotely": [
    {
      heading: "Making the first contact",
      paragraphs: [
        "Call, WhatsApp or use the Arrange a Funeral form. Tell us who has passed away, where they are now, and how to reach the family in Zimbabwe. If there is a DFS policy, share the policy number if you have it.",
        "From that point, a Funeral Care Consultant is your single point of contact.",
      ],
    },
    {
      heading: "Decisions you make vs. decisions we handle",
      paragraphs: [
        "The family decides the date, the venue, the officiant, the burial place, the casket and the personal touches. We handle collection and care, supplier bookings, set-up on the day, transport and making sure everything arrives where and when it should.",
        "If the family is divided across countries, agree who has the final say before the first call. It saves time and avoids painful misunderstandings.",
      ],
    },
    {
      heading: "Staying informed",
      paragraphs: [
        "You receive SMS and digital updates as each part of the arrangements is confirmed. If you need to talk something through, your consultant is a phone call or a WhatsApp message away.",
      ],
    },
    {
      heading: "Livestreaming and attending remotely",
      paragraphs: [
        "If you can't travel, add livestreaming. The family chooses who receives the private link, and a recording is provided afterwards for anyone in a different time zone or who couldn't watch live.",
      ],
    },
    {
      heading: "After the funeral",
      paragraphs: [
        "The weeks after a funeral bring their own tasks — the estate, a memorial or tombstone unveiling, and simply looking after one another. Post-funeral support and online grief support are available to family members wherever they live.",
      ],
    },
  ],

  "understanding-funeral-cover": [
    {
      heading: "Cover vs. fulfilment",
      paragraphs: [
        "Some funeral policies pay out a sum of money and leave the family to arrange everything. Others provide the funeral itself. DFS does the second: your package defines the level of care, and we deliver it.",
        "For families abroad this matters more than anything else. Money arriving in an account doesn't book a venue or set up a tent.",
      ],
    },
    {
      heading: "Questions to ask any funeral cover provider",
      paragraphs: [
        "How long is the waiting period, and does it apply to accidental death? Who can be covered, and up to what age? What happens if a payment is missed? What documents are needed at the time of a claim? Who actually arranges the funeral, and how will you be kept informed?",
        "At DFS, cover for natural causes starts after a 90-day waiting period and accidental death is covered from day one. There is a 30-day grace period for missed premiums. Adults join at 18–70 and children are covered up to age 20.",
      ],
    },
    {
      heading: "What personalisation options mean in practice",
      paragraphs: [
        "Personalisation is the difference between a funeral and their funeral: the casket, the programme, the flowers, the music, the photographs. Check whether these are included in a package, available as add-ons, or not offered at all — and how each one is priced.",
      ],
    },
    {
      heading: "Cover for family abroad and at home",
      paragraphs: [
        "If you live abroad, make sure the policy can be taken out, paid for and managed from where you are, and that the provider can deliver a funeral where your family actually lives in Zimbabwe.",
      ],
    },
  ],

  "preparing-for-travel-home-after-a-bereavement": [
    {
      heading: "Booking travel under pressure",
      paragraphs: [
        "Before you book, confirm the funeral date with the family and with us, so you don't pay for a flight that has to be changed. Many airlines have compassionate fares or more flexible tickets — it is worth asking.",
        "Allow for connections and travel from the airport to the family home, which in rural areas can take most of a day.",
      ],
    },
    {
      heading: "Documents to carry",
      paragraphs: [
        "Carry your passport and any visa or residence documents for your return, plus copies of the deceased's ID and the death certificate or burial order if you will be dealing with any paperwork. Keep digital copies on your phone as well.",
      ],
    },
    {
      heading: "What a travelling pack covers",
      paragraphs: [
        "A travelling pack gathers the essentials for the journey and the days of the funeral — personal care items and funeral-related items — so there is one less thing to organise. The contents are finalised with you.",
      ],
    },
    {
      heading: "Arriving and being supported on the ground",
      paragraphs: [
        "Tell us when you land. With travel and attendance assistance, we can help with guidance and on-the-ground support so you arrive ready to be with your family, not to start organising.",
      ],
    },
  ],

  "why-funeral-personalisation-matters": [
    {
      heading: "The difference a personal detail makes",
      paragraphs: [
        "People rarely remember the logistics of a funeral. They remember the photograph on the programme, the hymn that was sung, the colour of the flowers, the words on the banner. Those details are how a family says: this was who they were.",
      ],
    },
    {
      heading: "Personalisation across traditions",
      paragraphs: [
        "Christian, traditional and non-religious farewells each have their own customs, and many families combine them. Personalisation should respect those customs — it is about making the day feel like theirs, not replacing what the family holds sacred.",
        "Where a family has a specific ceremonial requirement, tell us early so it can be planned properly.",
      ],
    },
    {
      heading: "Balancing personalisation with dignity and cost",
      paragraphs: [
        "A meaningful funeral does not have to be an expensive one. A well-chosen photograph, a carefully written programme or a personalised coffin lace can mean more than the most elaborate décor. Start with your package, then add only what matters to your family.",
      ],
    },
  ],

  "will-writing-basics": [
    {
      heading: "What a will covers",
      paragraphs: [
        "A will says who should inherit your property and possessions, who should administer your estate (the executor), and, if you have young children, who you would want to look after them. Without one, your estate is divided according to the law, which may not match your wishes.",
      ],
    },
    {
      heading: "Things to decide first",
      paragraphs: [
        "List what you own — property, vehicles, savings, livestock, business interests and anything held in another country. Decide who should receive what, and choose an executor you trust. Think about who you would want as guardian for any children under 18.",
      ],
    },
    {
      heading: "Common mistakes",
      paragraphs: [
        "The most common mistakes are not signing correctly, using witnesses who benefit from the will, forgetting assets held abroad, and never updating the will after a marriage, divorce or the birth of a child.",
        "In Zimbabwe a will must be in writing and signed by you in the presence of two witnesses, who also sign. Witnesses should not be people who inherit under the will.",
      ],
    },
    {
      heading: "When to get independent legal advice",
      paragraphs: [
        "If your estate includes property in more than one country, a business, a complicated family situation, or you expect the will to be disputed, independent legal advice is worth the cost.",
      ],
    },
    {
      heading: "How the DFS will-writing service helps",
      paragraphs: [
        "Guided will-preparation assistance is included with every DFS policy. We take you through the decisions above and the signing requirements step by step. It is a practical service and does not replace independent legal advice where that is needed.",
      ],
    },
  ],

  "supporting-someone-who-is-grieving": [
    {
      heading: "What helps and what to avoid",
      paragraphs: [
        "Practical help is often worth more than the right words: bringing food, helping to host mourners, running errands, or sitting with someone. Say the name of the person who has died, and share a memory if you have one.",
        "Avoid telling someone how they should feel, or that they should be moving on. Grief doesn't follow a timetable.",
      ],
    },
    {
      heading: "Supporting from abroad",
      paragraphs: [
        "Distance doesn't mean you can't help. Regular calls or voice notes, contributing to the costs, joining the livestream, or leaving a message on a tribute page all tell the family they are not alone. Keep checking in after the funeral, when the visitors have gone home.",
      ],
    },
    {
      heading: "When to encourage further support",
      paragraphs: [
        "If someone is struggling to sleep, eat or cope with daily life months after the loss, or talks about not wanting to go on, gently encourage them to speak to a doctor or a counsellor. Online grief support is available through DFS; it is general support, not clinical care, and we refer on where that is needed.",
      ],
    },
    {
      heading: "Looking after yourself too",
      paragraphs: [
        "Supporting someone through grief is tiring, especially if you are grieving too. Rest, talk to someone you trust, and accept help when it is offered.",
      ],
    },
  ],
};
