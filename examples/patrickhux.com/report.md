# llms.txt audit: https://www.patrickhux.com

Run 2026-09-01T16-13-42, case b54b9981bda7, model opus.

## Deterministic score: 66/100

- **BLOCKING** `NO_H1`: no H1 title (the only required element)
- **ADVISORY** `NO_SUMMARY`: no "> summary" blockquote after the H1
- **BLOCKING** `NO_SECTIONS`: no "## section" link lists
- **INFO** `NO_DESCRIBEDBY_LINK`: homepage has no <link rel="describedby"> or Link header pointing at /llms.txt
- **INFO** `MARKDOWN_COVERAGE`: 0 of 0 links point at markdown
- **INFO** `CONTEXT_BUDGET`: no sections
- **INFO** `SITEMAP_PAGES_NOT_LISTED`: 2 of 2 sitemap URLs are not in llms.txt (that can be correct: llms.txt is curated, not a sitemap)

## Agent test (measured, model sonnet)
With ONLY the llms.txt and up to 2 fetches per question, an agent answered 10/10 correctly, 0 WRONG (invented or contradicted), 0 declined.

- [CORRECT] What kind of websites and brands does Patrick Hux build?
  answer: Patrick Hux builds fast, well-crafted websites and brands, handling strategy, design, and development for ambitious companies through designtakt.
  fetched: https://www.patrickhux.com/; expected: https://www.patrickhux.com/
  grader: Matches expected fact about fast, well-crafted websites and brands.
- [CORRECT] Which technologies does Patrick Hux use for web development?
  answer: He mostly builds with Astro, Sanity, and Next.js, and the site metadata also mentions Webflow.
  fetched: https://www.patrickhux.com/; expected: https://www.patrickhux.com/
  grader: Lists Astro, Sanity, Next.js, and Webflow, matching expected fact.
- [CORRECT] What is Patrick Hux's role at designtakt?
  answer: He is Co-Founder and Lead Web & Growth at designtakt.
  fetched: https://www.patrickhux.com/; expected: https://www.patrickhux.com/
  grader: Matches expected role at designtakt.
- [CORRECT] Where is Patrick Hux based?
  answer: Patrick Hux is based in Bern, Switzerland.
  fetched: https://www.patrickhux.com/; expected: https://www.patrickhux.com/
  grader: Matches expected location.
- [CORRECT] What is designtakt and how is Patrick Hux involved with it?
  answer: designtakt is a branding and website agency in Bern that handles strategy, design, and development in-house for ambitious companies; Patrick co-founded it and leads web and growth there.
  fetched: https://www.patrickhux.com/, https://www.designtakt.ch; expected: https://www.patrickhux.com/
  grader: Accurately describes designtakt and Patrick's role.
- [CORRECT] Who runs the patrickhux.com website?
  answer: The site is run by Patrick Hux, based in Bern, Switzerland.
  fetched: https://www.patrickhux.com/; expected: https://www.patrickhux.com/imprint
  grader: Matches imprint page info.
- [CORRECT] How does patrickhux.com handle visitor data and privacy?
  answer: The site uses no cookies, analytics, fingerprinting, tracking, or third-party scripts/fonts—everything is served as static files, so nothing about visitors is collected or stored. If you email him, he keeps that message to reply to you.
  fetched: https://www.patrickhux.com/imprint; expected: https://www.patrickhux.com/imprint
  grader: Matches privacy details from imprint page.
- [CORRECT] Does Patrick Hux build sites using Webflow?
  answer: Yes, the site description notes he builds websites with tools including Webflow.
  fetched: https://www.patrickhux.com/; expected: https://www.patrickhux.com/
  grader: Matches expected fact mentioning Webflow among tools.
- [CORRECT] Does Patrick Hux focus on building fast-performing websites?
  answer: Yes, he is described as building fast, well-crafted websites and brands.
  fetched: https://www.patrickhux.com/; expected: https://www.patrickhux.com/
  grader: Matches expected fact about fast, well-crafted websites.
- [CORRECT] Is there a legal/imprint page for patrickhux.com?
  answer: Yes, there is an Imprint page at patrickhux.com/imprint.
  fetched: https://www.patrickhux.com/imprint; expected: https://www.patrickhux.com/imprint
  grader: Confirms existence of imprint page as expected.


## Verdict: REWRITE (score 16/100)

SITE: https://www.patrickhux.com
VERDICT: REWRITE
SCORE: 16 (100 − 4 blocking×15 = 60 → 40; − 6 advisory×4 = 24 → 16)

CONVERGENT FINDINGS: 6
1. `/llms.txt` returns the rendered homepage as `text/html` (5263 B) — no H1, no summary, no sections, no link lines. [Structure F1/F2/F3, Positioning F7, Coverage F1, Description summary]
2. Zero curated links, so both real pages (`/`, `/imprint`) are absent; on a two-page site that is absence, not curation. [Structure F4, Coverage F2, Description]
3. The only contact affordance is a Cloudflare-obfuscated `/cdn-cgi/l/email-protection#…` stub that a fetch-only agent cannot decode. [Positioning F5, Coverage F3]
4. Homepage carries no `<link rel="describedby">`, so discovery depends on a guess that lands on HTML. [Structure F6, Coverage F7]
5. No markdown twins for either page; every link resolves to Astro HTML with fonts, scripts and class soup. [Structure F5, Description]
6. Webflow appears only in `<meta description>`, never in the prose — the agent test already produced a hedged answer. [Positioning F2, Coverage Q3]

ACCEPTED BLOCKING: 4 / ACCEPTED ADVISORY: 6 / REJECTED: 4

Accepted blocking:
B1. No llms.txt document exists at that path (normalises NO_H1 + NO_SUMMARY + NO_SECTIONS + `text/html` + self-canonical to `/` into one defect).
B2. Both primary pages unlisted; zero curated links.
B3. No machine-readable contact route.
B4. `/imprint` asserts "no analytics, no third-party scripts" while the same site ships `static.cloudflareinsights.com/beacon.min.js` and `email-decode.min.js` — the graded agent already repeated the claim to a user. Site-level, but blocking because the file must not restate it.

Accepted advisory: no describedby link; no markdown twins; Webflow metadata-only; job title stated three ways (title / JSON-LD / meta description); locale undeclared in a bilingual region; no prices, availability, or client proof anywhere, so a transactional question invites fabrication.

Rejected:
R1. Description's refusal to write any note for designtakt, betr.gsc and LinkedIn ("insufficient evidence"). Rejected: the homepage prose is in the frozen case verbatim and truthfully establishes what those entities *are*; I scope each note to that prose and mark that the pages themselves were not crawled.
R2. "The 10/10 agent test is a false positive" (Structure F2, Coverage, Description). Accepted as interpretation, rejected as a scored defect — it is evidence about why the pass is not protective, not a separate fault.
R3. Structure F4 (imprint sits at the same tier as the bio). Duplicate-of B1/B2.
R4. Coverage Q7/Q8/Q10 (missing engagement terms, portfolio, rates). Rejected as out of scope: llms.txt cannot list pages that do not exist; folded into the advisory that the summary should declare the absence.

FIX LIST
1. Stop serving HTML at `/llms.txt`. Replace the entire 5263-byte document with the plain-text file below, served as `text/plain; charset=utf-8`.
2. Amend `/imprint` or the site: either delete the `<script defer src='https://static.cloudflareinsights.com/beacon.min.js' …>` and `email-decode.min.js` tags, or change the imprint sentence that claims no analytics, no tracking and no third-party scripts. Do this before publishing anything that points at that page.
3. Publish a resolvable contact: replace `href="/cdn-cgi/l/email-protection#b6c6d7…"` with a plain `mailto:` in the HTML; until then the file lists LinkedIn as the contact route.
4. Add `<link rel="describedby" href="/llms.txt">` to the `<head>` that currently carries only canonical, icon, font preload and stylesheet.
5. Add Webflow to the body sentence "These days I mostly build with Astro, Sanity, and Next.js" so the capability claim exists in prose, not only in `<meta description>`.
6. Pick one canonical role string and use it in `<title>`, `<meta description>` and JSON-LD `jobTitle` — currently "Developer & Growth", "Developer & Growth Engineer" and "Co-Founder & Lead Web & Growth".
7. When markdown twins exist for `/` and `/imprint`, repoint those two lines at them.

(proposed file: see llms.proposed.txt below)

REASONING:
- H1 + blockquote: the case scatters identity across `<title>`, `<meta description>` and JSON-LD; one blockquote fixes person-not-agency, the Bern location, the designtakt role and the betr.gsc side project before any link is read.
- Last blockquote sentence names what the site does not publish, so a "what does it cost / are you available" question ends in a clean decline instead of an invented answer — this is the cheapest fix for the untested transactional gap.
- Profile first: it is the core offer and the only page on the domain with substance; every one of the ten test questions except the two imprint ones is answered there.
- Agency second: designtakt is the commercial entity behind the work and the answer to "who employs him / where is work bought"; it sits above Products because the prose frames betr.gsc as "on the side".
- Products third: betr.gsc is a genuine second offer, but subordinate; giving it its own section stops an agent reading it as another agency.
- Contact fourth: it is the terminal question of most sessions and currently fails silently, so it gets a named section rather than being buried in prose.
- Optional last: `/imprint` is real and answers a real question, but is never the reason an agent visits — the textbook Optional link, droppable under budget without losing eight of ten answers.
- Five sections, not seven: the domain has two pages and three off-domain properties; more sections would invent hierarchy the site does not have.
- Notes for designtakt, betr.gsc and LinkedIn are written from the homepage prose and JSON-LD in the case, with `(verify: not crawled)` appended, because no resource row establishes what those URLs serve.
- The obfuscated `/cdn-cgi/l/email-protection` link is removed, not moved: it resolves to nothing for a fetch-only agent and would be a dead link in a machine-readable index.
- Inline assets, fonts, `_astro` bundles, Cloudflare scripts and the preview images are all dropped: markup, not navigation.
- No markdown twin exists for either page, so both internal links point at the HTML URLs as given in the sitemap block.
- File is roughly 1.9 KB against the current 5263 B, and every URL in it appears in the frozen case.

## Proposed llms.txt

```markdown
# Patrick Hux

> Patrick Hux is a developer and growth engineer based in Bern, Switzerland; patrickhux.com is his personal site, in English, with two pages. He co-founded designtakt, a branding and website agency in Bern that handles strategy, design and development in-house for ambitious companies, where he is Co-Founder and Lead Web & Growth. On the side he builds betr.gsc, an SEO tool based on Google Search Console data. He builds mostly with Astro, Sanity and Next.js, and the site description also names Webflow. This site publishes no prices, service packages, availability or client case studies.

## Profile

- [Patrick Hux — Developer & Growth · designtakt](https://www.patrickhux.com/): the bio page and the only substantive page on this domain, covering who he is, where he is based, what he works on and the stack he builds with.

## Agency

- [designtakt](https://www.designtakt.ch): the Bern branding and website agency he co-founded and where he leads web and growth, handling strategy, design and development in-house (verify: this domain was not crawled in this audit).

## Products

- [betr.gsc](https://www.betrgsc.com): his own SEO tool built on Google Search Console data that organises sites into topic clusters and gives AI recommendations for growing organic traffic (verify: this domain was not crawled in this audit).

## Contact

- [Patrick Hux on LinkedIn](https://www.linkedin.com/in/patrickhux): the profile named in this site's JSON-LD sameAs, and the only contact route on the site that resolves without executing JavaScript (verify: a plain email address is not published in machine-readable form).

## Optional

- [Imprint — Patrick Hux](https://www.patrickhux.com/imprint): imprint and privacy note for patrickhux.com, stating who runs this site and how it handles your data.
```

## Reviewer reports

### Structure & Hierarchy (BLOCKING)

# Structure & Hierarchy Review — https://www.patrickhux.com/llms.txt

## Finding 1 — /llms.txt is not an llms.txt at all; it is the homepage HTML document
**Summary:** The URL returns `text/html; charset=utf-8`, 5263 bytes of a full `<!DOCTYPE html>` Astro page — there is no markdown file to structure.
**Evidence:** Verbatim body opens `<!DOCTYPE html><html lang="en">…`; findings `NO_H1` (BLOCKING) and `NO_SECTIONS` (BLOCKING).
**Cost to an agent:** An agent that requests `/llms.txt` expecting a curated map receives markup, inline `<script>` tags, Tailwind class soup, a Cloudflare beacon and a `/cdn-cgi/l/email-protection` obfuscated mailto. It must parse HTML to recover any nav value; the H1 it finds (`<h1 …>Patrick Hux</h1>`) is a DOM heading, not the spec's `# ` title. Every hierarchy signal the format exists to provide is absent.
**Severity:** BLOCKING **Confidence:** high

## Finding 2 — Zero H2 sections, so primary and secondary are indistinguishable
**Summary:** There is no `## ` list of any kind — not even the degenerate single `## Pages` bucket.
**Evidence:** `NO_SECTIONS`; `CONTEXT_BUDGET: no sections`; `MARKDOWN_COVERAGE: 0 of 0 links`.
**Cost to an agent:** The site's two real destinations (`https://www.patrickhux.com/`, `https://www.patrickhux.com/imprint`) sit at the same rhetorical level as a legal footnote and three outbound links, buried in a `<footer>` and in `<p>` prose. Nothing tells the agent that the imprint is skippable and the bio is the core offer. The measured 10/10 is a false positive: the agent scored well because the *homepage copy itself* was accidentally served in full, not because the file routed it. On a larger site the same failure mode returns nothing navigable.
**Severity:** BLOCKING **Confidence:** high

## Finding 3 — No H1 naming the entity and no `>` summary carrying interpretive facts
**Summary:** The identity facts an agent needs are present in the page but scattered across `<title>`, `<meta name="description">` and JSON-LD rather than the two elements the spec reserves for them.
**Evidence:** `NO_H1` (BLOCKING), `NO_SUMMARY` (ADVISORY). Facts available in-case: "Developer & Growth · designtakt", "Co-Founder & Lead Web & Growth at designtakt, based in Bern, Switzerland", JSON-LD `"@type":"Person"`, `"jobTitle":"Developer & Growth Engineer"`, `addressLocality: Bern`.
**Cost to an agent:** The agent must decide whether `patrickhux.com` is a person, an agency, or a product before it can interpret any link. The three outbound `sameAs` targets (designtakt, betr.gsc, LinkedIn) are unlabeled without a summary establishing that designtakt is the employer-agency and betr.gsc is a side product — a distinction the prose makes but no heading encodes.
**Severity:** BLOCKING **Confidence:** high

## Finding 4 — The real IA is two internal pages plus three external entities; the file encodes neither tier
**Summary:** Reconstructed architecture is flat and tiny: one root page, one `/imprint` page, and three off-domain properties. Correct structure is therefore *few sections, sharply tiered* — but the file has none, so the imprint (secondary) and the bio (primary) are equally reachable.
**Evidence:** Sitemap: 2 URLs, both unlisted (`SITEMAP_PAGES_NOT_LISTED: 2 of 2`); `pages crawled: 5`; footer link `href="/imprint"`; JSON-LD `sameAs` array of three.
**Cost to an agent:** Two of ten test questions were imprint-scoped and one agent answered the "who runs this site" question from `/` rather than `/imprint` — it guessed the right family by luck, having no section telling it where legal/ownership material lives.
**Severity:** ADVISORY **Confidence:** medium

## Finding 5 — No markdown twins for either page; nothing to point sections at
**Summary:** Both sitemap entries record `markdown twin: none`.
**Evidence:** Sitemap block, both rows end `| none`; `MARKDOWN_COVERAGE: 0 of 0`.
**Cost to an agent:** Even once sections exist, every link resolves to an Astro HTML page carrying fonts, preview `<img>` popovers, and Cloudflare scripts. Each fetch spends context on markup. Low severity here only because the corpus is two pages.
**Severity:** ADVISORY **Confidence:** high

## Finding 6 — Homepage does not advertise the file
**Summary:** No `<link rel="describedby">` or `Link:` header points at `/llms.txt`.
**Evidence:** `NO_DESCRIBEDBY_LINK` (INFO). Confirmed by the verbatim `<head>`, which carries `canonical`, `icon`, font preload and stylesheet only.
**Cost to an agent:** Discovery depends on guessing the well-known path — and that guess currently lands on HTML, so an agent that tries once may conclude the site has no llms.txt and stop.
**Severity:** ADVISORY **Confidence:** high

---

## Proposed section list

The entity is one person with a two-page site; four sections is the honest ceiling — padding to seven would invent hierarchy that does not exist. Head first:

```
# Patrick Hux

> Developer and growth engineer in Bern, Switzerland. Co-Founder and
> Lead Web & Growth at designtakt, a Bern branding and website agency
> that handles strategy, design and development in-house. Builds with
> Astro, Sanity, Next.js and Webflow; also builds betr.gsc, an SEO tool
> on Google Search Console data. Personal site, English only, two pages.

Everything below designtakt and betr.gsc is off-domain. This site itself
is a single bio page plus a legal imprint.
```
(prose, no headings, three lines — as spec requires)

| # | Section | Purpose | Links from this case |
|---|---|---|---|
| 1 | `## Profile` | The core offer: who he is, what he builds, which stack. First position because it is the only substantive page on the domain. | `https://www.patrickhux.com/` |
| 2 | `## Work` | The agency he co-founded and leads — the commercial entity behind "ambitious companies" work. Separated from Projects so an agent asking "who employs him" jumps once. | `https://www.designtakt.ch` |
| 3 | `## Projects` | Independently built tools, clearly secondary to the agency role. | `https://www.betrgsc.com` |
| 4 | `## Elsewhere` | Off-site profile for identity resolution; matches the JSON-LD `sameAs` set. | `https://www.linkedin.com/in/patrickhux` |
| 5 | `## Optional` | Skippable: legal and privacy only. An agent under budget can drop this entire section and still answer 8 of the 10 test questions. | `https://www.patrickhux.com/imprint` |

Notes on placement: `/imprint` belongs in Optional, not in a `Company` or `Legal` H2 — it is the textbook skippable link and the spec reserves `## Optional` for exactly this. Do not create a `## Pages` or `## Links` container; with five links, container naming would erase the only tier distinction available. Once markdown twins exist, point section 1 and section 5 at them rather than the Astro HTML.

Also: serve the file as `text/plain` at `/llms.txt`, and add `<link rel="describedby" href="/llms.txt">` to the `<head>` shown in the case.

VERDICT: BLOCKING

### Positioning & Consistency (BLOCKING)

# Positioning & Consistency Review — https://www.patrickhux.com/llms.txt

## Entity as the file presents it (three lines, as read)

1. **Who:** "Patrick Hux," a "developer and growth engineer based in Bern, Switzerland" — but the same document also fronts *designtakt* (an agency) and *betr.gsc* (an SEO product) in the title, schema `sameAs`, and body.
2. **What/to whom/price:** Nothing is sold on this document. designtakt is said to serve "ambitious companies"; betr.gsc is "an SEO tool based on the data of Google Search Console." No audience definition beyond "ambitious," no price, no packages, no availability statement.
3. **Language/proof:** `lang="en"` on the served document (site-wide html lang recorded as `?`). Proof consists of two outbound links (designtakt.ch, betrgsc.com), one LinkedIn link, and an obfuscated email. No clients, no dates, no metrics, no certifications.

**Structural precondition (already established):** `/llms.txt` returns `text/html` — it is a byte-for-byte copy of the homepage, with `<link rel="canonical" href="https://www.patrickhux.com/">`. Per NO_H1, NO_SECTIONS, NO_SUMMARY there is no llms.txt document to audit; everything below is read off the HTML that occupies that URL.

---

## Findings

### F1 — Privacy guarantee on /imprint is contradicted by the shipped page markup
**Passage A** — /imprint, as read and graded CORRECT in the agent test: *"no cookies, analytics, fingerprinting, tracking, or third-party scripts/fonts—everything is served as static files, so nothing about visitors is collected or stored."*
**Passage B** — the document served at /llms.txt (identical to the homepage), verbatim: *`<!-- Cloudflare Pages Analytics --><script data-cfasync="false" src="/cdn-cgi/scripts/5c5dd728/cloudflare-static/email-decode.min.js"></script><script defer src='https://static.cloudflareinsights.com/beacon.min.js' data-cf-beacon='{"token": "2d185e5584284a87a488686d5ba36fc3"}'></script><!-- Cloudflare Pages Analytics -->`*
A third-party script from `static.cloudflareinsights.com` carrying an analytics beacon token, labelled "Analytics" in the source's own comments, sits on the page that claims no analytics and no third-party scripts.
**Cost to an agent:** This is the one class of claim an agent will repeat verbatim and users will rely on legally. The measured test already shows it happening: the agent asserted "nothing about visitors is collected or stored." A privacy/legal guarantee that the page's own markup contradicts is the highest-risk output this site can produce.
**Severity:** BLOCKING · **Confidence:** high (both passages are in the case; the imprint wording is taken from the graded agent answer, so confidence in the *exact* phrasing is medium, in the substance high)

### F2 — Toolchain stated two different ways in the same document
**Passage A** — `<meta name="description">`: *"building fast, well-crafted websites and brands with **Astro, Sanity, Next.js and Webflow**."*
**Passage B** — body prose, same document: *"These days I mostly build with **Astro, Sanity, and Next.js**, with a soft spot for subtle animations."*
Webflow appears in the metadata and nowhere in the prose. The agent test shows the exact failure mode: to "Does Patrick Hux build sites using Webflow?" it answered *"Yes, the site description notes he builds websites with tools including Webflow"* — a hedge that cites the metadata rather than the person, because the person's own sentence excludes it.
**Cost to an agent:** Hedged or split answers on a capability question ("does he do Webflow?") — the most common qualifying question a prospect asks.
**Severity:** ADVISORY · **Confidence:** high

### F3 — Job title stated three ways
**Passage A** — `<title>` / og:title: *"Patrick Hux — **Developer & Growth** · designtakt"*
**Passage B** — JSON-LD Person: *`"jobTitle":"Developer & Growth Engineer"`*
**Passage C** — meta description: *"**Co-Founder & Lead Web & Growth** at designtakt"*
Three labels, none of which is designated canonical. "Growth Engineer" and "Lead Web & Growth" are not the same role name and neither is defined.
**Cost to an agent:** Low-grade — the agent answered the role question correctly by preferring the meta description. But structured data (JSON-LD) is what most extraction pipelines trust, and it carries the label that appears nowhere else in prose.
**Severity:** ADVISORY · **Confidence:** high

### F4 — Three entities, one document, no stated hierarchy
The footer says *"© 2026, **Personal Site of Patrick**"*, while the title and description sell an agency position: *"Patrick Hux — Developer & Growth · **designtakt** … Co-Founder & Lead Web & Growth at designtakt"*, and the body introduces a third: *"**betr.gsc** is an SEO tool based on the data of Google Search Console."* Schema `sameAs` places designtakt.ch and betrgsc.com on equal footing with a LinkedIn profile, which is a same-person assertion, not a same-company one.
**Cost to an agent:** Asked "can I hire you / what does it cost / who do I contact," the agent cannot tell whether the buying entity is Patrick, designtakt, or neither. Nothing in the case states that this site sells anything, that designtakt is where work is bought, or that betr.gsc has a price or a signup. Note that the agent test only asked descriptive questions; no transactional question was tested, so the 10/10 does not clear this.
**Severity:** ADVISORY · **Confidence:** high

### F5 — Unresolvable contact, offered as the primary CTA
**Passage** — *"You can find me on LinkedIn, or reach me via `<a href="/cdn-cgi/l/email-protection#b6c6d7c2c4dfd5ddf6d2d3c5dfd1d8c2d7ddc298d5d9db">email</a>`."*
The email address is Cloudflare-obfuscated and only resolves after `email-decode.min.js` executes. A fetching agent sees a hash, not an address. Secondary point: this decode script is itself one of the "third-party scripts" F1's imprint claim disclaims.
**Cost to an agent:** It can say "email him" but cannot produce the address; a user asking "what's his email" gets a decline or a fabrication.
**Severity:** ADVISORY · **Confidence:** high

### F6 — Ungroundable qualifiers and an unexplained acronym
*"ambitious companies"* (no size, sector, or stage), *"well-crafted details"*, *"curious to tinker with new approaches and tools and love to explore stuff"*, *"gives **AI recommendations** on how to grow your organic traffic"* (no mechanism, no model, no evidence), and *"growing a site with SEO and **AEO**"* — AEO is expanded nowhere in the document. No client is named, no result is quantified, no date or founding year is given for designtakt or betr.gsc.
**Cost to an agent:** Every qualification question ("do they work with companies like mine?", "does the tool work?") must be answered from adjectives. The agent will either omit or paraphrase marketing language as fact.
**Severity:** ADVISORY · **Confidence:** high

### F7 — /llms.txt self-identifies as a different URL
**Passage A** — served at `https://www.patrickhux.com/llms.txt`.
**Passage B** — inside it: *`<link rel="canonical" href="https://www.patrickhux.com/">`* and *`<meta property="og:url" content="https://www.patrickhux.com/">`*.
The document at /llms.txt asserts it is the homepage. Combined with NO_H1 and NO_SECTIONS, there is no curated entity statement anywhere — the agent's 10/10 was earned entirely by fetching `/` and `/imprint` directly, i.e. despite the file, not because of it. Neither of the 2 sitemap URLs is listed (SITEMAP_PAGES_NOT_LISTED), which here is not curation but absence.
**Cost to an agent:** The one artifact whose job is to fix the entity fixes nothing; positioning is reassembled from meta tags on every query, which is why F2 and F3 surface as hedges.
**Severity:** BLOCKING · **Confidence:** high

---

## The three-line entity statement the file should open with

> Patrick Hux is a developer and growth engineer based in Bern, Switzerland; patrickhux.com is his personal site (legal details at https://www.patrickhux.com/imprint).
> He co-founded designtakt (https://www.designtakt.ch), a branding and website agency in Bern that handles strategy, design and development in-house, where he leads web and growth; separately he builds betr.gsc (https://www.betrgsc.com), an SEO tool built on Google Search Console data that organizes sites into topic clusters and generates recommendations for growing organic traffic.
> He builds primarily with Astro, Sanity and Next.js, and also works in Webflow; reach him on https://www.linkedin.com/in/patrickhux or by email. This site publishes no prices, service packages, or client references.

Line 3 resolves F2 by stating Webflow once, in prose, as a fact rather than a metadata-only artifact. The final clause resolves F4 by telling an agent explicitly that transactional answers are not available here, which converts a fabrication risk into a clean decline.

**Fix F1 before anything else:** either remove the Cloudflare Insights beacon and the email-decode script, or amend the /imprint text so it no longer states that no analytics and no third-party scripts are present. As shipped, the site's only legal page makes a guarantee the site's own HTML refutes, and the measured agent already repeated it to a user.

VERDICT: BLOCKING

### Coverage & Priority (BLOCKING)

# Coverage & Priority Review — https://www.patrickhux.com/llms.txt

## Precondition

There is no llms.txt to review. The bytes served at `/llms.txt` are `text/html` — the full rendered homepage document, canonical `https://www.patrickhux.com/`. This is confirmed by NO_H1, NO_SECTIONS, NO_SUMMARY and CONTEXT_BUDGET ("no sections"). Consequently **the set of curated links is empty**: "What each linked resource actually is" has zero rows, and MARKDOWN_COVERAGE is 0 of 0. Everything below therefore asks: what would an agent get from these bytes, and what should a real curated file contain instead.

Note on the agent test: 10/10 correct is not evidence of a working llms.txt. The served document *is* the homepage, and the site has exactly two sitemap URLs. The questions asked were paraphrases of the meta description that is inlined in the same bytes. The pass measures "the homepage HTML is on-topic", not "the file routes an agent".

## Question table

| # | Question a real visitor asks | Answered by | Fix |
|---|---|---|---|
| 1 | Who is Patrick Hux and what does he do? | prose inside the served HTML (= `https://www.patrickhux.com/`) | add `https://www.patrickhux.com/` as the first primary link |
| 2 | Where is he based? | same HTML body | same as #1 |
| 3 | What stack does he build with? | same HTML body (Astro, Sanity, Next.js; Webflow only in the meta description) | same as #1 |
| 4 | What is designtakt and what does it sell? | partial — one sentence in the body; the actual site `https://www.designtakt.ch` is an inline `<a>`, not a curated entry | list `https://www.designtakt.ch` explicitly as an external primary link |
| 5 | **How do I contact or hire him?** | GAP — the email href is `/cdn-cgi/l/email-protection#b6c6...`, a Cloudflare-obfuscated fragment an agent cannot decode without executing `email-decode.min.js` | add a plaintext contact route; list `https://www.linkedin.com/in/patrickhux` as the machine-readable contact |
| 6 | What is betr.gsc, and where do I try it? | partial — described in body; `https://www.betrgsc.com` is an inline link only | list `https://www.betrgsc.com` under a Projects section |
| 7 | **Is he available for freelance/contract work, and on what terms?** | GAP — no page in the case answers this | none available; out of scope for llms.txt until such a page exists |
| 8 | **What has he built? Case studies, proof, references?** | GAP — no portfolio URL exists in the sitemap (2 URLs total) | none available |
| 9 | Who legally runs this site; how is my data handled? | `https://www.patrickhux.com/imprint` — present in the sitemap, **not** in the file | add as a Optional-section link |
| 10 | Are there rates or a process for engagements? | GAP | none available |
| 11 | Does he work in German as well as English? | GAP — html lang is `?`, locales seen: none, no statement anywhere | state primary language in a summary line |
| 12 | Is there a clean/markdown version of any page? | GAP — MARKDOWN_COVERAGE 0 of 0, both sitemap rows show `markdown twin: none` | optional; not blocking at this size |

## Findings

**F1 — The file is the homepage, so priority signalling is zero.**
Evidence: `/llms.txt` → HTTP 200, `text/html; charset=utf-8`, 5263 bytes, opening `<!DOCTYPE html>`, containing `<link rel="canonical" href="https://www.patrickhux.com/">`. NO_H1 and NO_SECTIONS confirm no structure was authored.
Cost to an agent: it must parse Tailwind class soup, `<script type="module">` tags, a Cloudflare beacon token and three `srcset` image variants to recover roughly 900 characters of usable prose. Of the 5263 bytes, the overwhelming majority is markup and asset paths — the CONTEXT_BUDGET finding has nothing to measure because nothing was curated. On a two-page site the correct file is under 500 bytes and costs one fetch.
Severity: **BLOCKING**. Confidence: high.

**F2 — Both sitemap URLs are missing primary links, and here that is not "correct curation".**
Evidence: SITEMAP_PAGES_NOT_LISTED, 2 of 2. The two pages are `https://www.patrickhux.com/` (the entity page — answers Q1, Q2, Q3) and `https://www.patrickhux.com/imprint` (answers Q9; the agent test's privacy question required fetching it). llms.txt is curated, not a sitemap — but a site with exactly two pages has no room for curation. Omitting the homepage omits the whole entity.
Cost to an agent: it currently recovers the homepage only because the bytes accidentally *are* the homepage. Any agent that treats a `text/html` response at `/llms.txt` as invalid and falls back gets nothing. The imprint is reachable only via a footer `<a href="/imprint">` buried at the end of the markup.
Severity: **BLOCKING**. Confidence: high.

**F3 — The single highest-value action, contact, is machine-unreadable.**
Evidence: the only email affordance is `href="/cdn-cgi/l/email-protection#b6c6d7c2c4dfd5ddf6d2d3c5dfd1d8c2d7ddc298d5d9db"`, decoded client-side by `/cdn-cgi/scripts/5c5dd728/cloudflare-static/email-decode.min.js`. Agents do not run that script.
Cost: for a personal site whose purpose is inbound work, Q5 is the terminal question of nearly every session, and it silently fails. Notably the agent test never asked it. `https://www.linkedin.com/in/patrickhux` is present in the JSON-LD `sameAs` and in the body, and is the only contact route that survives.
Severity: **BLOCKING**. Confidence: high.

**F4 — Off-site work lives on two external domains that are never declared as such.**
Evidence: `sameAs` lists `https://www.linkedin.com/in/patrickhux`, `https://www.designtakt.ch`, `https://www.betrgsc.com`. designtakt is the actual commercial entity ("branding and website agency in Bern… strategy, design, and development in-house"); betr.gsc is the product ("SEO tool based on the data of Google Search Console… topic clusters… AI recommendations"). The agent that answered Q5 of the test had to fetch `https://www.designtakt.ch` to do it.
Cost: an agent asked "what does his agency charge / what services" has no signal that designtakt.ch is the authoritative continuation rather than a passing mention. A curated file states this in one line and saves a speculative fetch.
Severity: ADVISORY. Confidence: high.

**F5 — Optional section: absent, not misused.**
Evidence: NO_SECTIONS. There is no dumping ground because there are no sections at all. The correct target state is narrow: primary = homepage; Optional = `https://www.patrickhux.com/imprint`. The imprint answers a real question (Q9, privacy/data handling) but is never the reason an agent visits, which is precisely what Optional is for.
Severity: ADVISORY. Confidence: high.

**F6 — Locale is undeclared on a site in a bilingual region.**
Evidence: html lang recorded as `?`, locales seen: none. The served `/llms.txt` bytes do carry `<html lang="en">`, but no second locale exists in the sitemap and no statement tells an agent whether German is available.
Cost: a German-language enquiry from Bern gets no signal about response language. Low impact — there is no second locale to route to — but one summary line resolves it.
Severity: ADVISORY. Confidence: medium.

**F7 — No discovery hint from the homepage.**
Evidence: NO_DESCRIBEDBY_LINK. Combined with F1, an agent arriving at the origin has no pointer, and probing `/llms.txt` returns a duplicate of the page it already has.
Severity: ADVISORY. Confidence: high.

## What the file should contain

Everything below already exists in this case; nothing is invented.

- `# Patrick Hux` with a one-line summary naming: developer and growth engineer, Bern CH, English, Astro/Sanity/Next.js/Webflow.
- `## Primary`: `https://www.patrickhux.com/`; `https://www.designtakt.ch` (agency — services and client work); `https://www.betrgsc.com` (GSC-based SEO tool); `https://www.linkedin.com/in/patrickhux` (contact).
- `## Optional`: `https://www.patrickhux.com/imprint` (legal entity, privacy note).

Three real gaps remain unfixable from the current site: availability/engagement terms (Q7), portfolio proof (Q8), and rates (Q10). An llms.txt cannot solve those — they need pages first.

VERDICT: BLOCKING

### Description & Retrieval (BLOCKING)

## Per-line rating table

| title | rating | reason |
|---|---|---|
| *(no link lines exist)* | BAD | file is HTML |

There is nothing to rate line by line. The response at `/llms.txt` is `text/html`, 5263 bytes, and is byte-for-byte the rendered homepage document: `<!DOCTYPE html>`, `<head>` meta, a Tailwind-classed `<body>`, an inline Astro module script, a Cloudflare email-decode script and an insights beacon. It contains zero `- [title](url): note` lines, which is consistent with the established `NO_H1`, `NO_SECTIONS` and `MARKDOWN_COVERAGE: 0 of 0 links` findings. The only URLs an agent can extract are anchor hrefs buried in markup: `https://www.designtakt.ch`, `https://www.betrgsc.com`, `https://www.linkedin.com/in/patrickhux`, `/imprint`, and a `/cdn-cgi/l/email-protection#...` stub that resolves to nothing without executing the site's JavaScript. None of these carry a title-plus-note pairing; every one of them is a nav label or a raw hostname with no statement of what a fetch would return.

## Five rewrites

Since no notes exist, I take the five candidate lines an agent would most need. Only two of them have a truthful source in the case (the sitemap table's title + description columns); the rest do not.

1. **`/` — old note: none →** `- [Patrick Hux — Developer & Growth · designtakt](https://www.patrickhux.com/): developer building fast, well-crafted websites and brands with Astro, Sanity, Next.js and Webflow; Co-Founder & Lead Web & Growth at designtakt, based in Bern, Switzerland.` (source: sitemap row description, verbatim.)
2. **`/imprint` — old note: none →** `- [Imprint — Patrick Hux](https://www.patrickhux.com/imprint): imprint and privacy note for patrickhux.com — who runs the site and how it handles your data.` (source: sitemap row description, verbatim.)
3. **`https://www.designtakt.ch` — insufficient evidence in case.** The URL appears only as an outbound anchor; there is no resource-table row, no HTTP status, no page title and no description for it. I can state that Patrick co-founded it from the on-page prose, but I cannot truthfully tell an agent what fetching that domain returns. **This is a finding, not a licence to invent.**
4. **`https://www.betrgsc.com` — insufficient evidence in case.** Same: outbound anchor only, no crawl row. The on-page prose calls it an SEO tool built on Google Search Console data, but nothing in the case establishes what the URL itself serves.
5. **`https://www.linkedin.com/in/patrickhux` — insufficient evidence in case.** Third-party profile, no crawl row, no title or description. Off-origin and unverified.

## Findings

**Summary.** `/llms.txt` is not an llms.txt. It is the site's HTML homepage served under that path with `content-type: text/html`. There is no H1, no summary blockquote, no `## section` and no link list, so the entire question I was asked to answer — does each line tell an agent when to fetch and what it gets — has no surface to attach to. Both of the site's two sitemap pages are unlisted, and neither has a markdown twin, so an agent has no cheap route to any content.

**Evidence.** Deterministic: `NO_H1` (BLOCKING), `NO_SECTIONS` (BLOCKING), `NO_SUMMARY` (ADVISORY), `MARKDOWN_COVERAGE: 0 of 0`, `SITEMAP_PAGES_NOT_LISTED: 2 of 2`, `NO_DESCRIBEDBY_LINK`. Observed in the verbatim body: HTTP 200 with `text/html; charset=utf-8`, 5263 bytes, `<!DOCTYPE html>` opening, `<link rel="stylesheet" href="/_astro/global.Ci-jRvA8.css">`, three `srcset` variants of a 72×72 avatar, an Astro preview-popup module script, and two Cloudflare scripts. The contact route is `/cdn-cgi/l/email-protection#b6c6d7...`, an obfuscated stub.

**Cost to an agent.** The 5263 bytes are roughly 1,300–1,500 tokens, of which the genuinely useful payload — the bio prose and the JSON-LD `Person` block — is perhaps 250. So about 80% of the budget is Tailwind class strings, hashed asset filenames, font preloads, CSS and script tags that an agent must parse and discard. Worse, the file is self-referential: it duplicates the homepage instead of pointing at it, so an agent that fetches `/llms.txt` and then the homepage pays twice for identical bytes. The `/imprint` page is reachable only by noticing a footer `href` inside markup, with no note telling the agent it holds the privacy and data-handling answers. The email is unresolvable without running JavaScript, which is a dead end for a fetch-only agent.

The measured agent test scored 10/10 with 0 wrong, but this does not rescue the file. It passes for an accidental reason: the site is five pages, and dumping the homepage HTML happens to inline nearly every fact the questions probe. Two answers (privacy handling, imprint existence) required the agent to guess `/imprint` and spend a second fetch, and one answer wandered off-origin to `designtakt.ch`. On any site larger than five pages, this file returns nothing navigable.

**Severity: BLOCKING.** Two blocking deterministic findings, no link list at all, and a content-type that tells every well-behaved client this is a web page rather than a machine-readable index.

**Confidence: high.** The verbatim body is unambiguous and the deterministic findings agree with it.

**Cheapest fix.** Replace the path with plain text: an H1 (`# Patrick Hux`), a one-line summary drawn from the existing meta description, and one `## Pages` section carrying the two rewrites above. That file is under 400 bytes and strictly more useful than the 5263 currently served.

VERDICT: BLOCKING
