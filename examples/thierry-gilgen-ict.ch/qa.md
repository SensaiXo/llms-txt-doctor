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
