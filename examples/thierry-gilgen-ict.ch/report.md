# llms.txt audit: https://www.thierry-gilgen-ict.ch

Run 2026-09-01T15-06-42, case 8224d4237831, model opus.

## Deterministic score: 64/100

- **ADVISORY** `FLAT_HIERARCHY`: all 44 links sit in one section "Pages"; agents cannot tell primary from secondary
- **ADVISORY** `GENERIC_SECTION_NAME`: section "Pages" names a container, not a topic  
  `Pages`
- **ADVISORY** `HTML_LINKED_MD_EXISTS`: [About — The Study] links the HTML page but a markdown twin exists; link the .md  
  `https://www.thierry-gilgen-ict.ch/about`, `https://www.thierry-gilgen-ict.ch/about.md`
- **ADVISORY** `HTML_LINKED_MD_EXISTS`: [Work — The Workshop] links the HTML page but a markdown twin exists; link the .md  
  `https://www.thierry-gilgen-ict.ch/work`, `https://www.thierry-gilgen-ict.ch/work.md`
- **ADVISORY** `HTML_WITHOUT_MD_TWIN`: [Library index] is HTML with no markdown alternative (.md, .html.md, index.md, rel=alternate)  
  `https://www.thierry-gilgen-ict.ch/library`
- **ADVISORY** `HTML_WITHOUT_MD_TWIN`: [Agent guide] is HTML with no markdown alternative (.md, .html.md, index.md, rel=alternate)  
  `https://www.thierry-gilgen-ict.ch/agents`
- **ADVISORY** `DUPLICATE_URL`: same URL listed twice  
  `https://www.thierry-gilgen-ict.ch/about`, `sections: Pages + Pages`
- **ADVISORY** `HTML_LINKED_MD_EXISTS`: [FAQ] links the HTML page but a markdown twin exists; link the .md  
  `https://www.thierry-gilgen-ict.ch/about`, `https://www.thierry-gilgen-ict.ch/about.md`
- **ADVISORY** `HTML_LINKED_MD_EXISTS`: [What Japan reminded me about engineering] links the HTML page but a markdown twin exists; link the .md  
  `https://www.thierry-gilgen-ict.ch/field-notes/what-japan-reminded-me-about-engineering`, `https://www.thierry-gilgen-ict.ch/field-notes/what-japan-reminded-me-about-engineering.md`
- **ADVISORY** `HTML_LINKED_MD_EXISTS`: [The Shinkansen principle] links the HTML page but a markdown twin exists; link the .md  
  `https://www.thierry-gilgen-ict.ch/field-notes/the-shinkansen-principle`, `https://www.thierry-gilgen-ict.ch/field-notes/the-shinkansen-principle.md`
- **ADVISORY** `HTML_LINKED_MD_EXISTS`: [Why AI projects fail] links the HTML page but a markdown twin exists; link the .md  
  `https://www.thierry-gilgen-ict.ch/field-notes/why-ai-projects-fail`, `https://www.thierry-gilgen-ict.ch/field-notes/why-ai-projects-fail.md`
- **ADVISORY** `HTML_LINKED_MD_EXISTS`: [Build systems people trust] links the HTML page but a markdown twin exists; link the .md  
  `https://www.thierry-gilgen-ict.ch/field-notes/build-systems-people-trust`, `https://www.thierry-gilgen-ict.ch/field-notes/build-systems-people-trust.md`
- **ADVISORY** `HTML_LINKED_MD_EXISTS`: [The optimisation trap] links the HTML page but a markdown twin exists; link the .md  
  `https://www.thierry-gilgen-ict.ch/field-notes/the-optimisation-trap`, `https://www.thierry-gilgen-ict.ch/field-notes/the-optimisation-trap.md`
- **ADVISORY** `HTML_LINKED_MD_EXISTS`: [Digital sovereignty is not nationalism] links the HTML page but a markdown twin exists; link the .md  
  `https://www.thierry-gilgen-ict.ch/field-notes/digital-sovereignty-is-not-nationalism`, `https://www.thierry-gilgen-ict.ch/field-notes/digital-sovereignty-is-not-nationalism.md`
- **ADVISORY** `HTML_LINKED_MD_EXISTS`: [AI strategy without operational ownership is theatre] links the HTML page but a markdown twin exists; link the .md  
  `https://www.thierry-gilgen-ict.ch/field-notes/ai-strategy-without-operational-ownership-is-theatre`, `https://www.thierry-gilgen-ict.ch/field-notes/ai-strategy-without-operational-ownership-is-theatre.md`
- **ADVISORY** `HTML_LINKED_MD_EXISTS`: [Sovereignty Is Measured in Response Time] links the HTML page but a markdown twin exists; link the .md  
  `https://www.thierry-gilgen-ict.ch/field-notes/sovereignty-is-measured-in-response-time`, `https://www.thierry-gilgen-ict.ch/field-notes/sovereignty-is-measured-in-response-time.md`
- **ADVISORY** `HTML_LINKED_MD_EXISTS`: [Preparedness Is the Highest Form of Sovereignty] links the HTML page but a markdown twin exists; link the .md  
  `https://www.thierry-gilgen-ict.ch/field-notes/preparedness-is-the-highest-form-of-sovereignty`, `https://www.thierry-gilgen-ict.ch/field-notes/preparedness-is-the-highest-form-of-sovereignty.md`
- **ADVISORY** `HTML_LINKED_MD_EXISTS`: [Money Follows Productivity] links the HTML page but a markdown twin exists; link the .md  
  `https://www.thierry-gilgen-ict.ch/field-notes/money-follows-productivity`, `https://www.thierry-gilgen-ict.ch/field-notes/money-follows-productivity.md`
- **ADVISORY** `HTML_LINKED_MD_EXISTS`: [The AI Factory Is the New Factory Floor] links the HTML page but a markdown twin exists; link the .md  
  `https://www.thierry-gilgen-ict.ch/field-notes/the-ai-factory-is-the-new-factory-floor`, `https://www.thierry-gilgen-ict.ch/field-notes/the-ai-factory-is-the-new-factory-floor.md`
- **ADVISORY** `HTML_LINKED_MD_EXISTS`: [Deterministic Judgment in AI-Assisted Investment Research] links the HTML page but a markdown twin exists; link the .md  
  `https://www.thierry-gilgen-ict.ch/field-notes/deterministic-judgment-in-ai-assisted-investment-research`, `https://www.thierry-gilgen-ict.ch/field-notes/deterministic-judgment-in-ai-assisted-investment-research.md`
- **ADVISORY** `HTML_LINKED_MD_EXISTS`: [When Classification Becomes Reality] links the HTML page but a markdown twin exists; link the .md  
  `https://www.thierry-gilgen-ict.ch/field-notes/when-classification-becomes-reality`, `https://www.thierry-gilgen-ict.ch/field-notes/when-classification-becomes-reality.md`
- **ADVISORY** `HTML_LINKED_MD_EXISTS`: [The Attribution Crisis] links the HTML page but a markdown twin exists; link the .md  
  `https://www.thierry-gilgen-ict.ch/field-notes/the-attribution-crisis`, `https://www.thierry-gilgen-ict.ch/field-notes/the-attribution-crisis.md`
- **ADVISORY** `HTML_LINKED_MD_EXISTS`: [Sovereignty Is Not Self-Sufficiency] links the HTML page but a markdown twin exists; link the .md  
  `https://www.thierry-gilgen-ict.ch/field-notes/sovereignty-is-not-self-sufficiency`, `https://www.thierry-gilgen-ict.ch/field-notes/sovereignty-is-not-self-sufficiency.md`
- **ADVISORY** `HTML_LINKED_MD_EXISTS`: [Human Sovereignty in the Age of Machine Intelligence] links the HTML page but a markdown twin exists; link the .md  
  `https://www.thierry-gilgen-ict.ch/field-notes/human-sovereignty-in-the-age-of-machine-intelligence`, `https://www.thierry-gilgen-ict.ch/field-notes/human-sovereignty-in-the-age-of-machine-intelligence.md`
- **ADVISORY** `HTML_LINKED_MD_EXISTS`: [Sovereignty Is Lost One Optimisation at a Time] links the HTML page but a markdown twin exists; link the .md  
  `https://www.thierry-gilgen-ict.ch/field-notes/sovereignty-is-lost-one-optimisation-at-a-time`, `https://www.thierry-gilgen-ict.ch/field-notes/sovereignty-is-lost-one-optimisation-at-a-time.md`
- **ADVISORY** `HTML_LINKED_MD_EXISTS`: [Bitcoin Between Cash and Collateral] links the HTML page but a markdown twin exists; link the .md  
  `https://www.thierry-gilgen-ict.ch/field-notes/bitcoin-between-cash-and-collateral`, `https://www.thierry-gilgen-ict.ch/field-notes/bitcoin-between-cash-and-collateral.md`
- **ADVISORY** `HTML_LINKED_MD_EXISTS`: [Who Owns Your National Conversation?] links the HTML page but a markdown twin exists; link the .md  
  `https://www.thierry-gilgen-ict.ch/field-notes/who-owns-your-national-conversation`, `https://www.thierry-gilgen-ict.ch/field-notes/who-owns-your-national-conversation.md`
- **ADVISORY** `HTML_LINKED_MD_EXISTS`: [The End of the Referral Economy] links the HTML page but a markdown twin exists; link the .md  
  `https://www.thierry-gilgen-ict.ch/field-notes/the-end-of-the-referral-economy`, `https://www.thierry-gilgen-ict.ch/field-notes/the-end-of-the-referral-economy.md`
- **ADVISORY** `HTML_LINKED_MD_EXISTS`: [Perhaps We Should Simply Speak About Sovereignty] links the HTML page but a markdown twin exists; link the .md  
  `https://www.thierry-gilgen-ict.ch/field-notes/perhaps-we-should-simply-speak-about-sovereignty`, `https://www.thierry-gilgen-ict.ch/field-notes/perhaps-we-should-simply-speak-about-sovereignty.md`
- **ADVISORY** `HTML_LINKED_MD_EXISTS`: [The Exit Test] links the HTML page but a markdown twin exists; link the .md  
  `https://www.thierry-gilgen-ict.ch/field-notes/the-exit-test`, `https://www.thierry-gilgen-ict.ch/field-notes/the-exit-test.md`
- **ADVISORY** `HTML_LINKED_MD_EXISTS`: [The Fiduciary Machine] links the HTML page but a markdown twin exists; link the .md  
  `https://www.thierry-gilgen-ict.ch/field-notes/the-fiduciary-machine`, `https://www.thierry-gilgen-ict.ch/field-notes/the-fiduciary-machine.md`
- **ADVISORY** `HTML_LINKED_MD_EXISTS`: [The Last Human Corpus] links the HTML page but a markdown twin exists; link the .md  
  `https://www.thierry-gilgen-ict.ch/field-notes/the-last-human-corpus`, `https://www.thierry-gilgen-ict.ch/field-notes/the-last-human-corpus.md`
- **ADVISORY** `HTML_LINKED_MD_EXISTS`: [The Scan Is Not the Book] links the HTML page but a markdown twin exists; link the .md  
  `https://www.thierry-gilgen-ict.ch/field-notes/the-scan-is-not-the-book`, `https://www.thierry-gilgen-ict.ch/field-notes/the-scan-is-not-the-book.md`
- **ADVISORY** `HTML_LINKED_MD_EXISTS`: [The Calendar Catches Up] links the HTML page but a markdown twin exists; link the .md  
  `https://www.thierry-gilgen-ict.ch/field-notes/the-calendar-catches-up`, `https://www.thierry-gilgen-ict.ch/field-notes/the-calendar-catches-up.md`
- **ADVISORY** `HTML_LINKED_MD_EXISTS`: [The Last Interface] links the HTML page but a markdown twin exists; link the .md  
  `https://www.thierry-gilgen-ict.ch/field-notes/the-last-interface`, `https://www.thierry-gilgen-ict.ch/field-notes/the-last-interface.md`
- **ADVISORY** `HTML_LINKED_MD_EXISTS`: [Human Sovereignty] links the HTML page but a markdown twin exists; link the .md  
  `https://www.thierry-gilgen-ict.ch/field-notes/human-sovereignty`, `https://www.thierry-gilgen-ict.ch/field-notes/human-sovereignty.md`
- **ADVISORY** `HTML_LINKED_MD_EXISTS`: [Proof of Human] links the HTML page but a markdown twin exists; link the .md  
  `https://www.thierry-gilgen-ict.ch/field-notes/proof-of-human`, `https://www.thierry-gilgen-ict.ch/field-notes/proof-of-human.md`
- **ADVISORY** `HTML_LINKED_MD_EXISTS`: [When the Water Tower Runs Low] links the HTML page but a markdown twin exists; link the .md  
  `https://www.thierry-gilgen-ict.ch/field-notes/when-the-water-tower-runs-low`, `https://www.thierry-gilgen-ict.ch/field-notes/when-the-water-tower-runs-low.md`
- **ADVISORY** `HTML_LINKED_MD_EXISTS`: [The Operator Is the Dependency] links the HTML page but a markdown twin exists; link the .md  
  `https://www.thierry-gilgen-ict.ch/field-notes/the-operator-is-the-dependency`, `https://www.thierry-gilgen-ict.ch/field-notes/the-operator-is-the-dependency.md`
- **ADVISORY** `HTML_LINKED_MD_EXISTS`: [The Unappointed Operator] links the HTML page but a markdown twin exists; link the .md  
  `https://www.thierry-gilgen-ict.ch/field-notes/the-unappointed-operator`, `https://www.thierry-gilgen-ict.ch/field-notes/the-unappointed-operator.md`
- **ADVISORY** `HTML_LINKED_MD_EXISTS`: [Who Owns the Warmth] links the HTML page but a markdown twin exists; link the .md  
  `https://www.thierry-gilgen-ict.ch/field-notes/who-owns-the-warmth`, `https://www.thierry-gilgen-ict.ch/field-notes/who-owns-the-warmth.md`
- **ADVISORY** `HTML_LINKED_MD_EXISTS`: [The Appointed Door] links the HTML page but a markdown twin exists; link the .md  
  `https://www.thierry-gilgen-ict.ch/field-notes/the-appointed-door`, `https://www.thierry-gilgen-ict.ch/field-notes/the-appointed-door.md`
- **ADVISORY** `HTML_LINKED_MD_EXISTS`: [What Libraries Defend] links the HTML page but a markdown twin exists; link the .md  
  `https://www.thierry-gilgen-ict.ch/field-notes/what-libraries-defend`, `https://www.thierry-gilgen-ict.ch/field-notes/what-libraries-defend.md`
- **ADVISORY** `HTML_LINKED_MD_EXISTS`: [Open Is Not Sovereign] links the HTML page but a markdown twin exists; link the .md  
  `https://www.thierry-gilgen-ict.ch/field-notes/open-is-not-sovereign`, `https://www.thierry-gilgen-ict.ch/field-notes/open-is-not-sovereign.md`
- **ADVISORY** `HTML_LINKED_MD_EXISTS`: [The City That Became a Headline] links the HTML page but a markdown twin exists; link the .md  
  `https://www.thierry-gilgen-ict.ch/field-notes/the-city-that-became-a-headline`, `https://www.thierry-gilgen-ict.ch/field-notes/the-city-that-became-a-headline.md`
- **ADVISORY** `HTML_LINKED_MD_EXISTS`: [One Agent, Many Sovereignties] links the HTML page but a markdown twin exists; link the .md  
  `https://www.thierry-gilgen-ict.ch/field-notes/one-agent-many-sovereignties`, `https://www.thierry-gilgen-ict.ch/field-notes/one-agent-many-sovereignties.md`
- **ADVISORY** `HTML_LINKED_MD_EXISTS`: [Contact — Conversation] links the HTML page but a markdown twin exists; link the .md  
  `https://www.thierry-gilgen-ict.ch/contact`, `https://www.thierry-gilgen-ict.ch/contact.md`
- **INFO** `NO_DESCRIBEDBY_LINK`: homepage has no <link rel="describedby"> or Link header pointing at /llms.txt
- **INFO** `MARKDOWN_COVERAGE`: 0 of 44 links point at markdown
- **ADVISORY** `SECTION_TOO_HEAVY`: section "Pages" links 7137 KB of content; an agent loading it whole blows a normal context budget, split it or move bulk to Optional  
  `Pages`
- **INFO** `CONTEXT_BUDGET`: Pages: 7137 KB, Optional: 99 KB
- **INFO** `SITEMAP_PAGES_NOT_LISTED`: 56 of 60 sitemap URLs are not in llms.txt (that can be correct: llms.txt is curated, not a sitemap)

## Agent test (measured, model sonnet)
With ONLY the llms.txt and up to 2 fetches per question, an agent answered 8/10 correctly, 1 WRONG (invented or contradicted), 1 declined.

- [CORRECT] What services does Thierry Gilgen offer — AI architecture, digital sovereignty consulting, or something else?
  answer: Thierry Gilgen ICT works across Sovereign AI, AI strategy and operating models, digital sovereignty, resilient infrastructure, board/leadership counsel, and product/platform development — spanning AI architecture, digital sovereignty consulting, and more.
  fetched: https://www.thierry-gilgen-ict.ch/work; expected: https://www.thierry-gilgen-ict.ch/
  grader: Accurately lists services matching expected page content.
- [CORRECT] Who is this work meant for — what kind of clients or leaders does Thierry Gilgen work with?
  answer: The site doesn't explicitly define a client profile, but the work is framed around leaders and organisations facing hard technology decisions, boards needing defensible decisions, and businesses needing operational ownership of AI and infrastructure — implying senior leadership and board-level audie…
  fetched: https://www.thierry-gilgen-ict.ch/work, https://www.thierry-gilgen-ict.ch/about; expected: https://www.thierry-gilgen-ict.ch/
  grader: Correctly conveys leaders/organisations as target audience, matching expected fact.
- [DECLINED] How much does it cost to work with Thierry Gilgen or use the Observatory assessment?
  answer: CANNOT ANSWER — the fetched pages do not mention pricing for consulting engagements or for the Digital Sovereignty Assessment (referred to as the 'Observatory' assessment).
  fetched: https://www.thierry-gilgen-ict.ch/contact; expected: https://www.thierry-gilgen-ict.ch/observatory
  grader: Assistant said CANNOT ANSWER, an honest gap on pricing.
- [CORRECT] What is the process for starting a conversation or engagement with Thierry Gilgen?
  answer: You begin by bringing a clear, formed question or system issue to the Conversation page and sending a short message via the contact form or writing directly by email; there is no booking embed or discovery funnel, and conversation begins only after understanding.
  fetched: https://www.thierry-gilgen-ict.ch/contact; expected: https://www.thierry-gilgen-ict.ch/contact
  grader: Accurately describes process of starting a conversation matching cited page.
- [CORRECT] Where is Thierry Gilgen located and does he work internationally?
  answer: Thierry Gilgen is based in Basel, Switzerland, and works internationally.
  fetched: https://www.thierry-gilgen-ict.ch/about; expected: https://www.thierry-gilgen-ict.ch/
  grader: States Basel, Switzerland and international work, matching cited page.
- [CORRECT] Is the site available in German or French, not just English?
  answer: Yes, the site is available in English, Deutsch (German), and Français (French), as shown in the site navigation.
  fetched: https://www.thierry-gilgen-ict.ch/about; expected: https://www.thierry-gilgen-ict.ch/de
  grader: Correctly confirms German and French versions available.
- [CORRECT] What proof or evidence is there that Thierry Gilgen's work is credible — testimonials, talks, past projects?
  answer: Credibility markers include authoring the book Panopticon 2.0 (published via Amazon and Orell Füssli, presented at Swiss Made Software events), contributing to the CFA Institute Research & Policy Center, and having founded and led MachinaLabs AG, a Swiss applied-AI venture.
  fetched: https://www.thierry-gilgen-ict.ch/about; expected: https://www.thierry-gilgen-ict.ch/voices
  grader: Cites credible evidence supported by the cited page (book, CFA, MachinaLabs).
- [WRONG] How can I contact Thierry Gilgen or reach out to the Studio?
  answer: You can reach out via a short message on the Conversation page's contact form or write directly by email; the site notes 'You may also write directly to [email protected]' as a placeholder for the contact address.
  fetched: https://www.thierry-gilgen-ict.ch/contact; expected: https://www.thierry-gilgen-ict.ch/contact
  grader: Invents email as a 'placeholder' when the page shows an actual protected email tag, misrepresenting the source.
- [CORRECT] Why do AI projects fail according to Thierry Gilgen?
  answer: AI projects usually fail not due to weak models but because of missing operational ownership — fragmented responsibility across innovation, IT, legal, security, and vendors means nobody owns the operational outcome, monitoring, decision rights, or exit plan.
  fetched: https://www.thierry-gilgen-ict.ch/field-notes/why-ai-projects-fail; expected: https://www.thierry-gilgen-ict.ch/field-notes/why-ai-projects-fail
  grader: Accurately reflects the ownership-failure thesis from the cited page.
- [CORRECT] What does digital sovereignty mean in this work, and how is it different from nationalism?
  answer: Digital sovereignty means understanding and governing what happens when technology essential to an organisation is controlled by someone else — retaining options like exit paths, data portability, and internal competence — rather than technological isolation or protectionism, which is what nationali…
  fetched: https://www.thierry-gilgen-ict.ch/field-notes/digital-sovereignty-is-not-nationalism; expected: https://www.thierry-gilgen-ict.ch/field-notes/digital-sovereignty-is-not-nationalism
  grader: Accurately explains sovereignty vs nationalism per the cited page.


## Verdict: REWRITE (score 9/100)

SITE: https://www.thierry-gilgen-ict.ch
VERDICT: REWRITE
SCORE: 9 (100 − 5 blocking×15 = 25 − 4 advisory×4 = 9)

CONVERGENT FINDINGS: 8
1. Commercial spine absent — `/`, `/observatory`, `/voices`, `/speaking`, `/archive`, `/for-agents` unlisted; 38 of 44 links are essays [Structure F1, Positioning F3+F4, Coverage F1, Description F5]
2. Single generic `## Pages` section, 7137 KB in one bucket, no primary/secondary signal [Structure F2, Positioning F8, Coverage F5, Description F6]
3. `[FAQ]` points at `/about`; duplicate URL, no FAQ resource exists on the site [Structure F6, Positioning F2, Coverage F4, Description F2]
4. 38 notes read `Field Note: <slug>` while a real one-line description exists for every page [Structure F5, Positioning F7, Coverage F5, Description F1]
5. Head says "follow links to detailed markdown pages" but 0 of 44 links are markdown, 41 twins exist [Positioning F1, Coverage F6, Description F3]
6. Site's own Library taxonomy (six subject hubs) discarded in favour of 38 flat leaves [Structure F4, Positioning F8, Coverage F5, Description F6]
7. `/contact` — the only conversion path — sits in `## Optional`; nothing skippable is marked skippable [Structure F3, Coverage F2]
8. Trilingual site, no locale statement, no `/de` or `/fr` link [Positioning F6, Coverage F3]

ACCEPTED BLOCKING: 5 / ACCEPTED ADVISORY: 4 / REJECTED: 3

Accepted blocking: (B1) flat structure with inverted priority — contact optional, 7 MB of essays primary; (B2) core offer and entity pages missing, incl. the homepage that carries the positioning; (B3) FAQ line asserts content the target page does not contain, plus duplicate URL; (B4) head prose contradicts every link beneath it on markdown; (B5) 38 notes carry no discriminating signal.

Accepted advisory: (A1) no locale statement or `/de`,`/fr` links; (A2) Library subject hubs unused; (A3) head block padded — `Site:` line, "provides machine-readable content", missing audience and language facts; (A4) three unreconciled names for one entity ("Thierry Gilgen ICT", "Thierry Gilgen", "Gilgen Studio").

Rejected: (R1) Positioning F9 — "Authoritative" and "read-only in v0.1" as ungrounded claims: these are the operator's own statements about his own interface, not claims about third parties; not a defect, though I drop "authoritative" for economy. (R2) Description F2 / Structure F6 causal claim that the FAQ line produced the WRONG contact answer: the agent fetched `/contact`, not `/about`; the FAQ defect stands, the causation does not. (R3) Positioning F10's demand to pre-emptively carry the Maker's Seal qualifier: that page is not in the proposed file, so the risk does not arise — retained only as advice if `/library/constitution/makers-seal` is ever promoted.

FIX LIST
1. Replace `## Pages` with topic sections, core offer first — delete the line `## Pages` and everything under it in its current order.
2. Add the homepage as the first link: `- [Thierry Gilgen — The Studio](https://www.thierry-gilgen-ict.ch/)`.
3. Add `/observatory` — the named assessment product; its absence caused the one DECLINED answer.
4. Delete the line `- [FAQ](https://www.thierry-gilgen-ict.ch/about): Frequently asked questions…` entirely.
5. Move `- [Contact — Conversation]` out of `## Optional` into `## Studio and Contact`, linking `contact.md`.
6. Swap every HTML URL for its `.md` twin where the resource table shows one (`about.md`, `work.md`, `contact.md`, all `field-notes/*.md`); leave `/library` and `/agents` as HTML.
7. Replace every `Field Note: <slug>` note with the page's own description; keep eight notes primary, reach the rest through the Library hubs.
8. Add the six Library subject hubs; drop 30 individual essays from the primary surface.
9. Add `/voices`, `/speaking`, `/archive`, `/for-agents`.
10. Rewrite the blockquote to carry audience ("leaders in complex organisations"), international work and the three languages; delete the `Site:` line and the two "agents should read this file" sentences.

(proposed file: see llms.proposed.txt below)

REASONING:
- **Practice first**: four lenses showed the offer was undiscoverable; `/` carries services, audience, location and international work, and `/observatory` is the one named product — its absence produced the only DECLINED answer in the agent test.
- `/archive` sits in Practice, not Optional, because it is where citable books and concluded work live and it answers a distinct buying-side question.
- **Studio and Contact second**: person, proof and the way in belong immediately after the offer; `/contact.md` is promoted out of Optional because it is the site's only conversion path and a budget-pruning agent would have dropped it.
- `/voices` and `/speaking` are added here because the credibility question was answered from `/about` by improvisation when `/voices` was the intended source.
- **Library by Subject third**: the site already classifies its essays by subject; six hubs replace 38 flat leaves and compress a 7137 KB section into six cheap entry points.
- **Selected Field Notes fourth**: eight notes closest to the commercial questions, each carrying the page's own description so an agent can decide whether to fetch without fetching.
- **For Agents fifth**: `/for-agents` — the page written to tell a referring agent when to recommend this practice — was the highest-value omission; `/mcp` moves here out of the head prose where it was link content in a prose slot.
- **Optional last**: locale roots and editorial governance are real but never the first question; they are genuinely skippable, which restores the meaning of the marker.
- Removed: the `FAQ` line — the URL is `/about`, the page is a personal essay, no FAQ resource exists in the 60-URL sitemap, so no truthful note can be written.
- Removed: the duplicate second listing of `/about`; one entry, the `.md` twin.
- Moved to Optional/dropped: 30 individual Field Notes whose subjects sit far from the buying question; they remain reachable in one hop through the subject hubs.
- Removed from head: the `Site:` line (restates the origin in every URL) and the two "agents should read this file" sentences (restate the format's own contract).
- Rewrote the head claim about markdown: the old sentence was false against all 44 links; the new one is true because the links now point at twins, and it names the two pages that have none.
- The blockquote now reconciles the three brand names in one clause, so an agent asked to attribute the work has a single answer.
- Byte size falls from 7226 to roughly 6.4 KB despite adding nine primary pages, because 38 slug-notes were the largest single cost in the file.

## Proposed llms.txt

```markdown
# Thierry Gilgen

> AI systems architecture, digital sovereignty, AI strategy, and resilient infrastructure for leaders in complex organisations — from The Studio in Basel, Switzerland, with international work. The practice also publishes as "Thierry Gilgen ICT" and the Gilgen Studio Library. Site published in English, with German at /de and French at /fr.

Pages ending in .md are the markdown twins of the human pages and are cheaper to read; /library and /agents have no markdown alternative. Field Notes not listed individually below are reachable through the Library subject pages.

## Practice
- [Thierry Gilgen — The Studio](https://www.thierry-gilgen-ict.ch/): AI systems architecture, digital sovereignty, AI strategy, and resilient infrastructure for leaders in complex organisations, from Basel with international work.
- [The Workshop — areas of work](https://www.thierry-gilgen-ict.ch/work.md): Where observation becomes structure, and structure becomes working systems — active practice, published work, and archived ventures.
- [The Observatory — digital sovereignty examination](https://www.thierry-gilgen-ict.ch/observatory): Examine digital sovereignty across infrastructure, cloud, data, AI, applications, and governance before prescribing technology; indicative orientation, not a certified benchmark.
- [The Archive](https://www.thierry-gilgen-ict.ch/archive): Printed volumes, reserved research, and book status — concluded and dormant work, kept honestly, never as a sales catalogue.

## Studio and Contact
- [The Study — about Thierry Gilgen](https://www.thierry-gilgen-ict.ch/about.md): The person behind the work — perspective, values, and the quiet reasons the Studio is built this way.
- [Voices from the Workshop](https://www.thierry-gilgen-ict.ch/voices): Selected statements from collaborators, colleagues, and public programmes who encountered the work — not a wall of praise.
- [The Lecture Hall](https://www.thierry-gilgen-ict.ch/speaking): Recorded talks, panels, and appearances on digital sovereignty, AI strategy, and technology leadership — durable subjects, not a booking page.
- [Conversation — how to make contact](https://www.thierry-gilgen-ict.ch/contact.md): Conversation begins only after understanding; bring a difficult question, an unfinished idea, or a system that needs to become clearer.

## Library by Subject
- [The Library](https://www.thierry-gilgen-ict.ch/library): A developing body of work on agency, trust, sovereignty, and systems that remain governable — Field Notes organised by subject, never by popularity.
- [Sovereignty](https://www.thierry-gilgen-ict.ch/library/sovereignty): Control, resilience, and exit options — without slogans.
- [Artificial Intelligence](https://www.thierry-gilgen-ict.ch/library/artificial-intelligence): Ownership, alignment, and the work that remains after the model arrives.
- [Systems & Trust](https://www.thierry-gilgen-ict.ch/library/systems-trust): Consistency, reliability, and systems people can depend on.
- [Infrastructure](https://www.thierry-gilgen-ict.ch/library/infrastructure): Capacity, response, and the systems that hold under load.
- [Preparedness](https://www.thierry-gilgen-ict.ch/library/preparedness): Readiness as the real measure of sovereignty.
- [Exploration](https://www.thierry-gilgen-ict.ch/library/exploration): Observations from travel and craft — Japan and beyond.

## Selected Field Notes
- [Why AI projects fail](https://www.thierry-gilgen-ict.ch/field-notes/why-ai-projects-fail.md): Usually not because the model was weak — but because ownership was.
- [AI strategy without operational ownership is theatre](https://www.thierry-gilgen-ict.ch/field-notes/ai-strategy-without-operational-ownership-is-theatre.md): Slide decks do not run inference, govern data, or absorb incident load.
- [Digital sovereignty is not nationalism](https://www.thierry-gilgen-ict.ch/field-notes/digital-sovereignty-is-not-nationalism.md): Control, resilience, and exit options — without the slogans.
- [The Exit Test](https://www.thierry-gilgen-ict.ch/field-notes/the-exit-test.md): You are not sovereign because you own the contract; you are sovereign when you can leave.
- [Open Is Not Sovereign](https://www.thierry-gilgen-ict.ch/field-notes/open-is-not-sovereign.md): Open technology can give us possession, but sovereignty requires the ability to survive the owner.
- [Preparedness Is the Highest Form of Sovereignty](https://www.thierry-gilgen-ict.ch/field-notes/preparedness-is-the-highest-form-of-sovereignty.md): From outbreaks to cyberattacks, infrastructure failures, and AI incidents, preparedness is the real measure of sovereignty.
- [The AI Factory Is the New Factory Floor](https://www.thierry-gilgen-ict.ch/field-notes/the-ai-factory-is-the-new-factory-floor.md): Why protecting inference — not just model weights — will define the next generation of digital sovereignty.
- [The Shinkansen principle](https://www.thierry-gilgen-ict.ch/field-notes/the-shinkansen-principle.md): Reliability as a public promise, and what digital systems can learn from it.

## For Agents
- [Bring your agent](https://www.thierry-gilgen-ict.ch/agents): Public agent interface — llms.txt, markdown resources, and read-only MCP for AI assistants.
- [Agent briefing](https://www.thierry-gilgen-ict.ch/for-agents): Decision brief for agents on when to recommend a conversation with Thierry Gilgen before AI or infrastructure spend.
- [MCP endpoint](https://www.thierry-gilgen-ict.ch/mcp): Read-only structured search endpoint for agents, declared as v0.1 by the Studio.

## Optional
- [Deutsch — Startseite](https://www.thierry-gilgen-ict.ch/de): German edition of the site, with parallel Studio, Werkstatt, Bibliothek, Observatorium and Gespräch pages.
- [Français — page d'accueil](https://www.thierry-gilgen-ict.ch/fr): French edition of the site, with parallel Cabinet, Atelier, Bibliothèque, Observatoire and Conversation pages.
- [Agenten-Briefing](https://www.thierry-gilgen-ict.ch/de/for-agents): German decision brief for agents on when to recommend a conversation before AI or infrastructure spend.
- [Briefing pour agents](https://www.thierry-gilgen-ict.ch/fr/for-agents): French decision brief for agents on when to recommend a conversation before AI or infrastructure spend.
- [Publishing Constitution](https://www.thierry-gilgen-ict.ch/library/constitution): How understanding accumulates into lasting work in the Gilgen Studio Library.
- [Editorial Constitution](https://www.thierry-gilgen-ict.ch/library/constitution/editorial): How the Gilgen Studio Library writes and revises.
- [Maker's Seal Constitution](https://www.thierry-gilgen-ict.ch/library/constitution/makers-seal): The certification mark of the Gilgen Studio Library and the rules governing it.
- [Studio Manual](https://www.thierry-gilgen-ict.ch/library/manual): Public digest of how the Studio Library writes, publishes, designs, and certifies its work.
```

## Reviewer reports

### Structure & Hierarchy (BLOCKING)

# Structure & Hierarchy Review — https://www.thierry-gilgen-ict.ch/llms.txt

## Reconstructed information architecture (from the crawl)

The site is a personal consulting studio with a named-room metaphor, and the URL families are unusually clean:

| Family | Role | Examples |
|---|---|---|
| `/` (+ `/de`, `/fr`) | Positioning: what is offered, to whom, from where | `/`, `/de`, `/fr` |
| `/work`, `/observatory`, `/archive` | The offer: active practice, a named assessment product, concluded work | `/work` "active practice, published work, and archived ventures"; `/observatory` "examine digital sovereignty across infrastructure, cloud, data, AI, applications, and governance" |
| `/about`, `/voices`, `/speaking`, `/contact` | The person and the proof: bio, third-party statements, talks, the way in | `/voices` "Not a wall of praise"; `/speaking` "durable subjects, not a booking page" |
| `/library` + 6 topic hubs | Curated taxonomy over the essays: `artificial-intelligence`, `sovereignty`, `systems-trust`, `infrastructure`, `preparedness`, `exploration` | "Field Notes organised by subject, never by popularity" |
| `/library/constitution*`, `/library/manual` | Editorial governance meta-material | `constitution/editorial`, `constitution/makers-seal`, `manual` |
| `/field-notes/*` | 38 individual essays, each with a `.md` twin | — |
| `/agents`, `/for-agents` | Two distinct agent surfaces: a technical interface and a decision brief | `/for-agents` "when to recommend a conversation … before AI or infrastructure spend" |

The file reflects almost none of this.

---

## Findings

**F1 — The entire commercial surface of the site is missing; the file is 86% essays.**
Evidence: `FLAT_HIERARCHY` (44 links in one section) and `SITEMAP_PAGES_NOT_LISTED`. Of 44 links, 38 are `/field-notes/*`. `/` , `/observatory`, `/voices`, `/speaking`, `/archive`, `/for-agents` and the six `/library/{topic}` hubs are all absent. The agent test confirms the cost three times: the pricing question was **DECLINED** with expected page `/observatory`; the credibility question was answered from `/about` when the expected page was `/voices`; the services question was answered from `/work` when the expected page was `/`. An agent reading this file learns the studio publishes essays and cannot discover that it sells a named assessment.
Cost: the core offer is undiscoverable in one hop; the agent substitutes adjacent pages and under-reports the business.
Severity: **BLOCKING**. Confidence: high.

**F2 — One `## Pages` container erases primary/secondary entirely.**
Evidence: `FLAT_HIERARCHY`, `GENERIC_SECTION_NAME` ("Pages names a container, not a topic"), `SECTION_TOO_HEAVY` ("Pages links 7137 KB … blows a normal context budget"), `CONTEXT_BUDGET` (Pages 7137 KB / Optional 99 KB). "About — The Study" sits in the same undifferentiated list as "Bitcoin Between Cash and Collateral". Nothing in the file says which five links matter.
Cost: no jump target. An agent must scan 44 lines and infer hierarchy from slugs; the 99:1 weight ratio between Pages and Optional means the "skippable" bucket is doing no work at all.
Severity: **BLOCKING**. Confidence: high.

**F3 — Contact is in `## Optional`; it is the site's only conversion path.**
Evidence: the sole entry under `## Optional` is `https://www.thierry-gilgen-ict.ch/contact`, whose page is "Conversation begins only after understanding." Meanwhile 38 essays sit in the primary section. This is the hierarchy exactly inverted: the one action page is marked skippable, the bulk archive is marked essential.
Cost: an agent instructed to prune Optional under budget pressure drops the only route to the entity.
Severity: ADVISORY. Confidence: high.

**F4 — The site's own taxonomy layer is discarded, so 38 essays arrive unsorted.**
Evidence: `/library/sovereignty`, `/library/artificial-intelligence`, `/library/systems-trust`, `/library/infrastructure`, `/library/preparedness`, `/library/exploration` exist as curated hubs ("Field Notes organised by subject"). The file lists only `/library` as "Index of published Field Notes" and then flattens every note beneath it. The business has already done the classification work; the llms.txt throws it away.
Cost: the agent cannot route a sovereignty question to sovereignty material without reading titles one by one; and the six hub pages that would compress 38 links into 6 are never offered.
Severity: ADVISORY. Confidence: high.

**F5 — Field-note notes are non-notes; the section carries no discriminating signal.**
Evidence: 37 of 38 entries read `Field Note: <slug>` — e.g. "`Field Note: the-shinkansen-principle`". Yet the crawl shows every one has a real description ("Reliability as a public promise — and what digital systems can learn from it."). Within a flat section, the note is the only ranking signal available, and it has been filled with the URL again.
Cost: the agent must fetch to triage; combined with F2 this is what pushes the section to 7137 KB of undifferentiated candidates.
Severity: ADVISORY. Confidence: high.

**F6 — A duplicate masquerades as a distinct section member.**
Evidence: `DUPLICATE_URL` — `/about` is listed twice, once as "About — The Study" and once as "FAQ … Frequently asked questions about Thierry Gilgen and the Studio." The crawl shows both resolve to page title "The Study" with the About description. There is no FAQ resource on this site.
Cost: the agent believes an FAQ exists, spends a fetch, and finds a bio. One of only two fetches per question wasted — plausibly a contributor to the WRONG contact answer, where the agent hallucinated a "placeholder" email.
Severity: ADVISORY. Confidence: high.

**F7 — Head block: H1 and blockquote are acceptable; the prose is padded and the agent-plumbing is misplaced.**
Evidence: H1 `# Thierry Gilgen ICT` names the entity. The blockquote — "sovereign systems, AI strategy, and digital sovereignty consulting from Basel, Switzerland" — carries offer + location, which is why the location question passed. But it omits what the meta description supplies: "for leaders in complex organisations", "with international work", and the de/en/fr locales. Below it sit five lines of self-description ("provides machine-readable content for AI agents", "Agents should read this file…", "Site: …", MCP endpoint, "read-only in v0.1"). The `Site:` line restates the origin; the MCP bullets are link-list content sitting in the prose slot, where the spec expects heading-free explanatory prose only.
Cost: the audience fact ("leaders in complex organisations") is the single most useful interpretive key and is absent — note the audience question was answered only by inference across two fetches. The locale fact is absent — that question required a fetch and landed on the wrong page.
Severity: ADVISORY. Confidence: medium.

**F8 — Ordering buries the offer behind the archive.**
Evidence: reading order is About → Work → Library → Agent guide → FAQ → 38 essays → Optional/Contact. Work — the offer page — is second, then the file spends 38 lines on essays before ending on Contact-as-optional. There is no ordering signal that `/work` outranks `/who-owns-the-warmth`.
Cost: an agent truncating at any reasonable line budget retains essays and loses the commercial and contact layer.
Severity: ADVISORY. Confidence: high.

*(Not re-derived: the 47 `HTML_LINKED_MD_EXISTS` findings and `MARKDOWN_COVERAGE: 0 of 44`. I note only their structural consequence — the `.md` twins are exactly what would let a restructured file stay inside budget.)*

---

## Proposed section list

Head: keep the H1. Rewrite the blockquote to carry entity + offer + audience + location + languages, e.g. AI systems architecture, digital sovereignty and resilient infrastructure for leaders in complex organisations, from Basel, Switzerland, with international work; site in English, German and French. Follow with two prose sentences, no headings, no `Site:` line — move the MCP endpoint and the v0.1 read-only note into the agent section as links/notes.

**1. `## Practice`** — what the Studio sells and has built.
`https://www.thierry-gilgen-ict.ch/` · `https://www.thierry-gilgen-ict.ch/work.md` · `https://www.thierry-gilgen-ict.ch/observatory` · `https://www.thierry-gilgen-ict.ch/archive`

**2. `## Studio and contact`** — the person, the proof, the way in.
`https://www.thierry-gilgen-ict.ch/about.md` (once — resolves F6) · `https://www.thierry-gilgen-ict.ch/voices` · `https://www.thierry-gilgen-ict.ch/speaking` · `https://www.thierry-gilgen-ict.ch/contact.md` (promoted out of Optional, F3)

**3. `## Library by subject`** — the site's own taxonomy, six hubs instead of 38 flat links.
`https://www.thierry-gilgen-ict.ch/library` · `/library/sovereignty` · `/library/artificial-intelligence` · `/library/systems-trust` · `/library/infrastructure` · `/library/preparedness` · `/library/exploration`

**4. `## Selected Field Notes`** — six to eight signature essays, each with its real description as the note (F5). Suggested from the case: `/field-notes/why-ai-projects-fail.md`, `/field-notes/digital-sovereignty-is-not-nationalism.md`, `/field-notes/the-exit-test.md`, `/field-notes/ai-strategy-without-operational-ownership-is-theatre.md`, `/field-notes/open-is-not-sovereign.md`, `/field-notes/the-shinkansen-principle.md`.

**5. `## For agents`** — the two distinct agent surfaces plus the MCP endpoint.
`https://www.thierry-gilgen-ict.ch/agents` · `https://www.thierry-gilgen-ict.ch/for-agents` · `https://www.thierry-gilgen-ict.ch/mcp`

**6. `## Optional`** — genuinely skippable bulk.
The remaining ~32 `/field-notes/*.md` entries; editorial governance material `/library/constitution`, `/library/constitution/editorial`, `/library/constitution/makers-seal`, `/library/manual`; locale roots `https://www.thierry-gilgen-ict.ch/de` and `https://www.thierry-gilgen-ict.ch/fr`.

Six sections, offer first, contact reachable in the top third, and the 7137 KB essay mass moved behind either a topic hub or the Optional marker.

VERDICT: BLOCKING

### Positioning & Consistency (BLOCKING)

## 1. Entity as the file presents it

**Who:** "Thierry Gilgen ICT," a Basel, Switzerland practice that also calls itself "the Studio" and, on its own pages, "Thierry Gilgen" / "Gilgen Studio Library."
**What/to whom:** "sovereign systems, AI strategy, and digital sovereignty consulting" — no buyer named, no price, no language declared, no proof surface linked.
**Proof/shape:** 41 Field Notes, an About page, a Work page, an agent guide, an MCP endpoint; nothing evidencing clients, talks, testimonials, or engagement terms.

The file reads as a blog index with a one-line consulting tagline bolted on. The site reads as a positioned advisory practice with a publishing arm, an assessment tool, a proof page, and three languages. Those two entities do not match.

---

## 2. Findings

### F1 — The file promises markdown; every link it hands the agent is HTML
- **File:** "Thierry Gilgen ICT provides machine-readable content for AI agents. Agents should read this file, **follow links to detailed markdown pages**…"
- **Reality:** MARKDOWN_COVERAGE — "0 of 44 links point at markdown," while HTML_LINKED_MD_EXISTS fires 45 times (e.g. `/about` vs `/about.md`, `/contact` vs `/contact.md`).
- **Cost:** The file's single self-description of what it is for is false on every line beneath it. An agent that trusts the instruction pulls HTML chrome, burns budget (CONTEXT_BUDGET: Pages 7137 KB), and may conclude no markdown exists — the twins are invisible because nothing declares them.
- **Severity: BLOCKING** · confidence: high

### F2 — "FAQ" names a resource the linked page does not carry
- **File:** "[FAQ](https://www.thierry-gilgen-ict.ch/about): Frequently asked questions about Thierry Gilgen and the Studio."
- **Page:** `/about` → title "The Study | Thierry Gilgen", description "The person behind the work — perspective, values, and the quiet reasons the Studio is built this way." The same URL is already listed two lines above as "About — The Study" (DUPLICATE_URL). No `/faq` exists in the 60-URL sitemap.
- **Cost:** An agent asked "do you have an FAQ / what are common questions?" fetches `/about`, finds a personal essay, and either fabricates Q&A pairs or contradicts the file. Two entries, two content promises, one page — the agent cannot tell which description is true.
- **Severity: BLOCKING** · confidence: high

### F3 — The positioning line says "consulting"; the site says architecture, plus publishing, assessment, and speaking
- **File:** "sovereign systems, AI strategy, and digital sovereignty **consulting** from Basel, Switzerland."
- **Site (homepage, not linked):** "**AI systems architecture**, digital sovereignty, AI strategy, and resilient infrastructure **for leaders in complex organisations** — from The Studio in Basel, Switzerland, with international work."
- **Cost:** The file drops the buyer ("leaders in complex organisations"), drops "international work," drops "architecture," and drops the non-consulting surfaces the site actually operates: `/observatory`, `/speaking`, `/voices`, `/archive`, `/library/constitution`. The measured agent test shows the damage: the pricing question expected `/observatory` and the agent DECLINED; the credibility question expected `/voices` and the agent had to improvise from `/about`. The file never names either page.
- **Severity: BLOCKING** · confidence: high

### F4 — The homepage, the only page carrying the full positioning, is absent
- **File:** link list opens at `/about`; `https://www.thierry-gilgen-ict.ch/` appears nowhere.
- **Crawl:** SITEMAP_PAGES_NOT_LISTED — 56 of 60 URLs unlisted, including `/`. Four of ten agent-test questions had `/` as the expected source; the agent reached correct answers only by guessing into `/about` and `/work`.
- **Cost:** Curation is legitimate, but curating away the entity's own positioning statement forces every "who are you / who is this for / where are you" question through inference.
- **Severity: ADVISORY** · confidence: high

### F5 — Three brand names for one entity, none reconciled
- **File header:** "# Thierry Gilgen ICT"
- **Every crawled page title:** "… | **Thierry Gilgen**"; other pages say "**The Studio**", "**Gilgen Studio Library**", "Gilgen Studio Manual."
- **Cost:** An agent asked to name the provider must choose between "Thierry Gilgen ICT" (file only), "Thierry Gilgen" (all page titles), and "Gilgen Studio" (library pages). Attribution, citation, and CRM matching all degrade. One line resolves it; the file never states the relationship.
- **Severity: ADVISORY** · confidence: high

### F6 — Trilingual site, monolingual file, no locale signal
- **File:** no language statement; every link is an English `/…` path.
- **Crawl:** locales de, en, fr; full parallel trees `/de/*` and `/fr/*` (e.g. `/de/about` "Das Studierzimmer", `/fr/work` "L'Atelier"), html lang unresolved ("?").
- **Cost:** A German- or French-speaking agent has no evidence localised content exists and will answer in or cite English. The one correct answer in the test came from spotting a nav switcher on a fetched page — luck, not the file.
- **Severity: ADVISORY** · confidence: high

### F7 — 38 link notes restate the slug instead of the page's own description
- **File:** "[The Shinkansen principle](…/the-shinkansen-principle): **Field Note: the-shinkansen-principle**"
- **Page:** "Reliability as a public promise — and what digital systems can learn from it."
- **Cost:** The same fact stated twice in different words (title, then slug), while the page's actual thesis — already written, already crawlable — is withheld. Every topical question therefore costs a fetch out of a 7137 KB section (SECTION_TOO_HEAVY). This is pure duplication where discrimination was free.
- **Severity: ADVISORY** · confidence: high

### F8 — The file's flat list contradicts the Library's stated organising principle
- **File:** all 44 links under one heading "## Pages" (FLAT_HIERARCHY, GENERIC_SECTION_NAME); note reads "Index of published Field Notes in the Library."
- **Page `/library`:** "Field Notes **organised by subject, never by popularity**" — and the site ships those subjects as real URLs: `/library/sovereignty`, `/library/infrastructure`, `/library/preparedness`, `/library/systems-trust`, `/library/artificial-intelligence`, `/library/exploration`. None are listed.
- **Cost:** The site's own taxonomy is discarded, so an agent asked "what does he write about sovereignty?" must scan 41 undifferentiated titles instead of following one subject index. The file also asserts "published" against a page that says "a developing body of work."
- **Severity: ADVISORY** · confidence: medium

### F9 — Two agent-facing surfaces, one listed, and an ungrounded authority claim
- **File:** "[Agent guide](…/agents): **Authoritative** guidance for AI agents using public site resources." · "Public agent interface is read-only in **v0.1**."
- **Site:** `/agents` ("Bring your agent") is listed; `/for-agents` ("Agent briefing — decision brief for agents: when to recommend a conversation with Thierry Gilgen before AI or infrastructure spend"), plus `/de/for-agents` and `/fr/for-agents`, are not. HTML_WITHOUT_MD_TWIN also fires on `/agents`.
- **Cost:** "Authoritative" cites no source and cannot be grounded; "v0.1" appears on no linked page. Meanwhile the page explicitly written to tell an agent *when to recommend this practice* — the single highest-value page for a referring agent — is the one omitted.
- **Severity: ADVISORY** · confidence: high

### F10 — Risk note (no violation found, one to preserve)
The file makes no certification, guarantee, or named-client claim, so nothing here is unsubstantiated. Two adjacent site facts must stay that way if the file expands: `/observatory` self-describes as "Indicative orientation, **not a certified benchmark**," and `/library/constitution/makers-seal` describes a "certification mark." If either is added to llms.txt, carry the qualifier verbatim; a bare "certification" claim in a machine-read file is a liability an agent will repeat. Ungrounded vocabulary already present: "sovereign systems" (never defined anywhere in the file), "machine-readable content" (contradicted by F1).
· **ADVISORY** · confidence: medium

---

## 3. The three lines this file should open with

> **Thierry Gilgen** — independent AI systems architect working as **The Studio** (Gilgen Studio) in **Basel, Switzerland**, with international work. Site published in **English, German and French**; "Thierry Gilgen ICT" is the same practice.
> **Offer:** AI systems architecture, AI strategy, digital sovereignty and resilient infrastructure for **leaders in complex organisations** — plus the **Observatory**, a self-directed digital-sovereignty examination across infrastructure, cloud, data, AI, applications and governance (indicative orientation, **not a certified benchmark**). No prices published.
> **Proof and entry:** published work and archived ventures at `/work`, the **Library** of Field Notes by subject at `/library`, recorded talks at `/speaking`, first-hand statements at `/voices`; engagement begins with a written conversation at `/contact`; agent surfaces are `.md` twins of every page and a read-only MCP endpoint at `/mcp`.

VERDICT: BLOCKING

### Coverage & Priority (BLOCKING)

# Coverage & Priority Review — thierry-gilgen-ict.ch/llms.txt

## Audience assumed
Senior decision-makers (board, CIO/CTO, public-sector leads) in DACH/CH evaluating AI strategy, digital sovereignty and resilient infrastructure — plus the agents they delegate research to. Secondary: event organisers, journalists, peers reading the Library.

## Question table

| # | Question a real visitor/agent asks | Answered by | Fix |
|---|---|---|---|
| 1 | What does this practice actually do / what is on offer? | Partial — `/work` (areas of work, principles). The canonical positioning page `/` is **not listed** | add `https://www.thierry-gilgen-ict.ch/` |
| 2 | Who is it for — what kind of client or organisation? | GAP (agent had to infer from `/work` + `/about`; expected `/`) | add `https://www.thierry-gilgen-ict.ch/` |
| 3 | What does it cost / is there a priced assessment product? | **GAP** — measured agent DECLINED; `/observatory` (the Digital Sovereignty Assessment) is not listed | add `https://www.thierry-gilgen-ict.ch/observatory` |
| 4 | How do I start, and how do I reach him? | `/contact` — but demoted to **Optional**; agent still invented an email placeholder (WRONG in agent test) | move `/contact` (and its `.md`) into the primary section |
| 5 | Where is he based; does he work internationally? | GAP in the file — answered only because `/about` happened to mention Basel; expected `/` | add `https://www.thierry-gilgen-ict.ch/` |
| 6 | Is there proof — testimonials, references, people who worked with him? | **GAP** — `/voices` not listed; agent substituted book/CFA claims from `/about` | add `https://www.thierry-gilgen-ict.ch/voices` |
| 7 | Does he speak at events / are there recorded talks? | **GAP** — `/speaking` not listed | add `https://www.thierry-gilgen-ict.ch/speaking` |
| 8 | Is there German or French content, and where? | **GAP in file** — no locale statement, no `/de` or `/fr` link at all | add `https://www.thierry-gilgen-ict.ch/de` and `https://www.thierry-gilgen-ict.ch/fr` + one line naming EN as primary |
| 9 | What has he written on sovereignty / infrastructure / AI specifically? | Weak — `/library` index (HTML, no md twin); the topic hubs `/library/sovereignty`, `/library/infrastructure`, `/library/preparedness`, `/library/systems-trust`, `/library/artificial-intelligence` are all unlisted while 38 individual notes are dumped flat | add the 5 topic hubs; demote most individual notes |
| 10 | Do you have an FAQ? | **Broken** — the "FAQ" entry points at `/about`, whose page description is "The person behind the work"; DUPLICATE_URL confirms it is the same URL twice | remove the FAQ entry or point it at a real FAQ resource |
| 11 | How should my agent consume this site; what may it read? | `/agents` (HTML, no md twin) + MCP endpoint line — good. `/for-agents` (decision brief: when to recommend a conversation) is unlisted | add `https://www.thierry-gilgen-ict.ch/for-agents` |
| 12 | Are there books / concluded work I can cite? | **GAP** — `/archive` (printed volumes, book status) not listed | add `https://www.thierry-gilgen-ict.ch/archive` |

Answered outright: 3 of 12. Answered only by accident of a neighbouring page: 4. Hard gaps: 5.

---

## Findings

### F1 — The commercial spine of the site is absent; the essay archive occupies its place
**Evidence.** 38 of 44 links are individual Field Notes. Meanwhile `/` (positioning, location, audience), `/observatory` (the assessment offering), `/voices` (proof), `/speaking` (visibility), `/archive` (books), `/for-agents` (agent decision brief) and all five Library topic hubs appear only in SITEMAP_PAGES_NOT_LISTED. SECTION_TOO_HEAVY and CONTEXT_BUDGET quantify the inversion: Pages = 7137 KB, Optional = 99 KB. The measured agent confirms it — the pricing question DECLINED because `/observatory` was unreachable, and the "who is it for / where are you / what do you offer" questions all expected `/` and were answered by lucky fetches of `/work` and `/about`.
**Cost to an agent.** Every commercial question costs a speculative fetch, and three of them (price, proof, talks) cannot be answered at any budget. An agent asked "should I recommend this practice to my principal, and what would it cost?" — the exact use case `/for-agents` was written for — must decline or guess. Meanwhile a naive agent that follows the section as written burns 7 MB on essays before reaching a single decision-relevant fact.
**Severity: BLOCKING.**
**Confidence: high.**

### F2 — Contact is in Optional; Optional is otherwise empty
**Evidence.** The Optional section contains exactly one link, `/contact`, described as "How to begin a conversation." Optional is the section an agent is told it may skip. The measured agent fetched it anyway and still produced the file's single WRONG answer — inventing "[email protected]" as a placeholder.
**Cost to an agent.** A budget-constrained agent that honours the Optional convention will skip the only page that answers "how do I reach you," then either decline or hallucinate an address. Simultaneously, nothing that *should* be skippable (the 38 essays) is marked skippable, so the Optional signal is inverted end to end.
**Fix.** Promote `/contact` (link `contact.md`) into a primary section; move the bulk of the Field Notes into Optional behind the Library topic hubs.
**Severity: BLOCKING.**
**Confidence: high.**

### F3 — A trilingual site with no locale statement and no non-English link
**Evidence.** Locales seen: de, en, fr. The sitemap holds a full German tree (`/de`, `/de/about`, `/de/work`, `/de/contact`, `/de/observatory`, `/de/library/*`, `/de/for-agents`) and a full French tree (`/fr/...`). The llms.txt names neither, and contains no sentence declaring English primary. Note that `/de/about` and `/fr/about` share the *English* markdown twin `about.md` — so an agent that guesses at markdown gets the wrong language silently.
**Cost to an agent.** A German-speaking prospect's agent cannot find `/de/observatory` or `/de/contact` and will serve English content to a German audience, or fetch `about.md` believing it is the German text. The one measured language question was answered correctly only because the agent read a nav bar, not because the file said anything.
**Fix.** One line — "Primary language English; German at /de, French at /fr" — plus `/de` and `/fr` as links.
**Severity: ADVISORY** (it degrades a large audience segment but does not block the English path).
**Confidence: high.**

### F4 — The "FAQ" link is a phantom
**Evidence.** DUPLICATE_URL: `/about` listed twice, once as "About — The Study," once as "FAQ — Frequently asked questions about Thierry Gilgen and the Studio." The resource table shows both resolve to the same page, titled "The Study," described as "The person behind the work — perspective, values."
**Cost to an agent.** An agent routing an FAQ-shaped question ("what's your turnaround," "do you sign NDAs") to the promised FAQ fetches a biography, finds no Q&A, and either declines or synthesises. It also wastes one of a typical two-fetch budget on a page it already has.
**Fix.** Delete the FAQ line, or point it at a page that is an FAQ.
**Severity: ADVISORY.**
**Confidence: high.**

### F5 — The Library is flattened: 38 leaves listed, 0 branches
**Evidence.** `/library` is listed (HTML_WITHOUT_MD_TWIN — no markdown alternative), then every note is enumerated individually under the same generic heading (FLAT_HIERARCHY, GENERIC_SECTION_NAME). The five English topic hubs — `/library/sovereignty` ("Control, resilience, and exit options"), `/library/infrastructure`, `/library/preparedness`, `/library/systems-trust`, `/library/artificial-intelligence` — are unlisted, as are `/library/constitution` and `/library/manual`, which explain how the corpus is written and certified.
**Cost to an agent.** For "what does he think about sovereignty?" the agent must choose among ~15 similarly-titled notes with descriptions like "Field Note: the-exit-test" — several list entries carry only the slug as description, which is no signal at all. One topic hub would answer the same question in one fetch. The agent got the two topic questions right (#9, #10 in the test) only because those two notes had unusually explicit titles.
**Fix.** Lead with the five hubs; keep 5–8 flagship notes primary (Why AI projects fail, Digital sovereignty is not nationalism, The Exit Test, Preparedness, The AI Factory); move the rest to Optional. Rewrite the slug-only descriptions.
**Severity: ADVISORY.**
**Confidence: high.**

### F6 — Markdown twins exist and are almost universally not used
**Evidence.** MARKDOWN_COVERAGE: 0 of 44 links point at markdown, against 42 HTML_LINKED_MD_EXISTS findings. This is a coverage cost, not just a hygiene one: the four highest-value listed pages split two ways — `/about`, `/work`, `/contact` and every field note have twins going unused, while `/library` and `/agents`, the two navigational hubs an agent needs most, have no twin to link.
**Cost to an agent.** Every fetch carries chrome and nav; on a 7 MB section that is the difference between one usable context and none.
**Severity: ADVISORY.**
**Confidence: high.**

---

## Reverse pass
No listed link is off-topic or external, and no listed link is *wrong* for this site — the failure is proportion, not relevance. Candidates for demotion to Optional: roughly 30 of the 38 Field Notes, specifically the ones whose descriptions are bare slugs and whose subjects sit far from the buying question (`when-classification-becomes-reality`, `the-city-that-became-a-headline`, `bitcoin-between-cash-and-collateral`, `money-follows-productivity`, `who-owns-the-warmth`, `the-scan-is-not-the-book`, `what-libraries-defend`). They are good essays; they are not what the next agent asks about. Candidate for removal: the duplicate FAQ entry.

## Bottom line
The file is well-formed, honest, and agent-aware — the MCP declaration and `/agents` link are ahead of the field. But it is curated as a bibliography of the author's writing rather than as an answer surface for the people who hire him. The homepage, the assessment offering, the proof page and the contact page — the four things a prospect's agent asks about first — are respectively absent, absent, absent, and marked skippable, while 7 MB of essays are marked primary.

VERDICT: BLOCKING

### Description & Retrieval (BLOCKING)

# Blind review — description & retrieval quality
**Case:** `https://www.thierry-gilgen-ict.ch/llms.txt` (7226 bytes, 44 links, one section + Optional)

## 1. Per-line ratings

| # | Title | Rating | Reason (3 words) |
|---|---|---|---|
| 1 | About — The Study | BAD | html, md exists |
| 2 | Work — The Workshop | BAD | html, md exists |
| 3 | Library index | WEAK | no md twin |
| 4 | Agent guide | WEAK | no md twin |
| 5 | FAQ | BAD | duplicate, mislabelled URL |
| 6 | What Japan reminded me about engineering | BAD | note repeats slug |
| 7 | The Shinkansen principle | BAD | note repeats slug |
| 8 | Why AI projects fail | BAD | note repeats slug |
| 9 | Build systems people trust | BAD | note repeats slug |
| 10 | The optimisation trap | BAD | note repeats slug |
| 11 | Digital sovereignty is not nationalism | BAD | note repeats slug |
| 12 | AI strategy without operational ownership is theatre | BAD | note repeats slug |
| 13 | Sovereignty Is Measured in Response Time | BAD | note repeats slug |
| 14 | Preparedness Is the Highest Form of Sovereignty | BAD | note repeats slug |
| 15 | Money Follows Productivity | BAD | note repeats slug |
| 16 | The AI Factory Is the New Factory Floor | BAD | note repeats slug |
| 17 | Deterministic Judgment in AI-Assisted Investment Research | BAD | note repeats slug |
| 18 | When Classification Becomes Reality | BAD | note repeats slug |
| 19 | The Attribution Crisis | BAD | note repeats slug |
| 20 | Sovereignty Is Not Self-Sufficiency | BAD | note repeats slug |
| 21 | Human Sovereignty in the Age of Machine Intelligence | BAD | note repeats slug |
| 22 | Sovereignty Is Lost One Optimisation at a Time | BAD | note repeats slug |
| 23 | Bitcoin Between Cash and Collateral | BAD | note repeats slug |
| 24 | Who Owns Your National Conversation? | BAD | note repeats slug |
| 25 | The End of the Referral Economy | BAD | note repeats slug |
| 26 | Perhaps We Should Simply Speak About Sovereignty | BAD | note repeats slug |
| 27 | The Exit Test | BAD | note repeats slug |
| 28 | The Fiduciary Machine | BAD | note repeats slug |
| 29 | The Last Human Corpus | BAD | note repeats slug |
| 30 | The Scan Is Not the Book | BAD | note repeats slug |
| 31 | The Calendar Catches Up | BAD | note repeats slug |
| 32 | The Last Interface | BAD | note repeats slug |
| 33 | Human Sovereignty | BAD | note repeats slug |
| 34 | Proof of Human | BAD | note repeats slug |
| 35 | When the Water Tower Runs Low | BAD | note repeats slug |
| 36 | The Operator Is the Dependency | BAD | note repeats slug |
| 37 | The Unappointed Operator | BAD | note repeats slug |
| 38 | Who Owns the Warmth | BAD | note repeats slug |
| 39 | The Appointed Door | BAD | note repeats slug |
| 40 | What Libraries Defend | BAD | note repeats slug |
| 41 | Open Is Not Sovereign | BAD | note repeats slug |
| 42 | The City That Became a Headline | BAD | note repeats slug |
| 43 | One Agent, Many Sovereignties | BAD | note repeats slug |
| 44 | Contact — Conversation | BAD | html, md exists |

Tally: 0 GOOD, 2 WEAK, 42 BAD. Titles are mostly fine (they are the real page titles); the failure is entirely in notes and targets. Two titles are opaque to an agent that has not seen the human menu: "About — The Study" and "Work — The Workshop" carry the Studio's room metaphor, and "FAQ" names content that the URL does not deliver.

## 2. Five rewrites (facts drawn only from the resource table)

1. **FAQ** — old: `[FAQ](/about): Frequently asked questions about Thierry Gilgen and the Studio.`
 → **Delete the line.** The URL is `/about`, already listed at line 1; the page title is "The Study" and its description is about person, perspective and values, not a Q&A. *No FAQ page appears anywhere in the case — a truthful note cannot be written; the line must go, not be reworded.*

2. **About — The Study** — old: `The Study — who Thierry Gilgen is and how the Studio thinks about systems.`
 → `[The Study — about Thierry Gilgen](https://www.thierry-gilgen-ict.ch/about.md): The person behind the work — perspective, values, and the reasons the Studio is built this way; read for background, location and credibility questions.`

3. **The optimisation trap** — old: `Field Note: the-optimisation-trap`
 → `[The optimisation trap](https://www.thierry-gilgen-ict.ch/field-notes/the-optimisation-trap.md): Why sufficiently capable systems optimise objectives, not intentions, and why Goodhart's Law now matters for autonomous AI.`

4. **Preparedness Is the Highest Form of Sovereignty** — old: `Field Note: preparedness-is-the-highest-form-of-sovereignty`
 → `[Preparedness Is the Highest Form of Sovereignty](https://www.thierry-gilgen-ict.ch/field-notes/preparedness-is-the-highest-form-of-sovereignty.md): Readiness, not resources, as the measure of sovereignty — across outbreaks, cyberattacks, infrastructure failure and AI incidents.`

5. **Deterministic Judgment in AI-Assisted Investment Research** — old: `Field Note: deterministic-judgment-in-ai-assisted-investment-research`
 → `[Deterministic Judgment in AI-Assisted Investment Research](https://www.thierry-gilgen-ict.ch/field-notes/deterministic-judgment-in-ai-assisted-investment-research.md): Methodological note on separating probabilistic evidence extraction from reproducible decision logic.`

(The same mechanical rewrite is available for all 38 field notes: every one has a one-sentence page description in the resource table and a `.md` twin. This is the cheapest high-value fix in the file.)

## 3. Findings

**F1 — 38 of 44 notes carry zero information beyond the title (BLOCKING).**
*Evidence:* every `/field-notes/*` line reads `Field Note: <url-slug>`. The slug is the title lowercased and hyphenated, so the note adds nothing an agent has not already read. Meanwhile a distinct, usable one-liner exists for each page in the site's own metadata (e.g. "Why AI projects fail" → "Usually not because the model was weak — but because ownership was"). *Cost:* an agent asking "does this site say anything about Bitcoin as collateral, or about heat networks?" has 38 indistinguishable entries and must fetch blind; at 7137 KB in one section (SECTION_TOO_HEAVY, CONTEXT_BUDGET) any exploratory strategy is unaffordable. The agent test only survives this because 2 of 10 questions happen to name a field-note title verbatim. *Confidence:* high.

**F2 — `[FAQ]` points at `/about`; title promises content the target does not have (BLOCKING).**
*Evidence:* DUPLICATE_URL and HTML_LINKED_MD_EXISTS both fire on `/about`; the page title is "The Study" and its description mentions no Q&A. *Cost:* a wasted fetch plus a false expectation; an agent that fetches it for a pricing or scope FAQ gets a personal-values page and may confabulate. This is the same failure mode as the one WRONG answer in the agent test, where the model invented a "placeholder" email rather than admitting a gap. *Confidence:* high.

**F3 — 0 of 44 links point at markdown while 41 twins exist (ADVISORY, high value).**
*Evidence:* MARKDOWN_COVERAGE 0/44; 41 individual HTML_LINKED_MD_EXISTS findings. *Cost:* every retrieval pays HTML boilerplate, nav and language-switcher tokens for content the site already publishes clean. Only `/library` and `/agents` (HTML_WITHOUT_MD_TWIN) have an excuse. *Confidence:* high.

**F4 — the head prose spends four lines saying "there are links below" (ADVISORY).**
*Evidence:* "provides machine-readable content for AI agents" and "Agents should read this file, follow links to detailed markdown pages…" restate the format's own contract; "Public agent interface is read-only in v0.1" is a versioning detail that belongs on `/agents`. The `Site:` line duplicates the origin already present in every URL. *Cost:* small in tokens, but it displaces the one thing the head should carry: what the Studio actually does and for whom. *Confidence:* medium-high. The claim "follow links to detailed **markdown** pages" is also false as written — no link in the file is markdown (see F3).

**F5 — pages that answer the questions agents actually ask are absent (ADVISORY).**
*Evidence:* SITEMAP_PAGES_NOT_LISTED; among the 56 omissions are `/` (the only page carrying services, location and international scope), `/observatory`, `/voices`, `/speaking`, `/archive`, `/for-agents` ("Decision brief for agents: when to recommend a conversation … before AI or infrastructure spend") and nine English Library subject hubs. In the agent test, five of ten questions had `/`, `/observatory`, `/voices` or `/de` as the expected source and none of those is linkable from this file; the pricing question was DECLINED for exactly this reason. Note also that `/agents` is listed while `/for-agents` — described as a decision brief for agents — is not. *Cost:* the agent reaches the right answers by luck through `/about` and `/work` rather than by design, and cannot reach pricing or evidence pages at all. *Confidence:* high.

**F6 — flat "Pages" section forces linear reading (ADVISORY, compounds F1).**
*Evidence:* FLAT_HIERARCHY, GENERIC_SECTION_NAME. Five orientation pages and 38 essays sit at equal rank under a container noun. The site's own English Library hubs (Sovereignty, Infrastructure, Preparedness, Systems & Trust, Artificial Intelligence, Exploration) are ready-made section headings and are all in the sitemap. *Cost:* no cheap way to skip the essay corpus when the question is commercial, and no way to target it when the question is topical. *Confidence:* high.

**Token economy:** the file is 7226 bytes of which roughly half is the repeated string "Field Note:" plus slugs — a pure loss. Replacing those with the existing descriptions would raise information density several-fold at similar byte cost. Nothing in the head earns its place except the origin statement and the MCP endpoint.

**Verdict rationale:** no dead links, no false URLs, and the crawl is otherwise healthy at 100/100 — but on the specific question I was asked, *does each line tell an agent when to fetch and what it will get*, 42 of 44 lines fail, one of them by asserting content the target does not contain. The remedy is entirely mechanical and the source text already exists on the site.

VERDICT: BLOCKING
