## Agent test (measured, model sonnet)
With ONLY the llms.txt and up to 2 fetches per question, an agent answered 7/10 correctly, 2 WRONG (invented or contradicted), 1 declined.

- [CORRECT] Was bietet designtakt als Agentur an (Webseiten, Branding, SEO)?
  answer: designtakt bietet Webseiten (Webdesign, Webflow-Entwicklung, CMS-Integration, Migration), SEO & AEO (Strategie, technisches SEO, Content-Strategie, Keyword-Recherche, Linking, Analytics) sowie Branding & Identity (Brand-Strategie, Naming, Logo-Design, Visual Identity, Guidelines) an.
  fetched: https://www.designtakt.ch/services; expected: https://www.designtakt.ch/services
  grader: Accurately summarizes Webseiten, SEO & AEO, and Branding services as per expected page.
- [WRONG] Für wen ist die Webflow-Agentur designtakt geeignet – nur Startups oder auch grössere Firmen?
  answer: Laut FAQ eignet sich Webflow gut für Unternehmen, die eine hochwertige, performante Website wollen und Inhalte selbst verwalten möchten; designtakt arbeitet mit Teams von Early-Stage-Startups bis zu etablierten B2B-Marken. Weniger geeignet ist Webflow für hochkomplexe Backend-Anwendungen oder sehr g…
  fetched: https://www.designtakt.ch/services/webflow-agentur; expected: https://www.designtakt.ch/services/webflow-agentur
  grader: Claims designtakt works with 'Early-Stage-Startups bis zu etablierten B2B-Marken' which is not supported by the cited or expected page text.
- [DECLINED] Was kostet eine Migration von Webflow zu Sanity?
  answer: CANNOT ANSWER – die bereitgestellten Seiten enthalten keinen Preis für eine Migration von Webflow zu Sanity; es wird lediglich ein Blogartikel-Titel dazu erwähnt, aber kein Inhalt/Preis geliefert.
  fetched: nothing; expected: https://www.designtakt.ch/blog/webflow-zu-sanity-migrieren-wann-es-sich-lohnt-und-was-es-kostet
  grader: Assistant explicitly said CANNOT ANSWER, citing no source.
- [CORRECT] Wie läuft der Prozess einer Webseiten-Erstellung bei designtakt ab?
  answer: Der Prozess läuft in 5 Schritten ab: 1) Analytics & Strategy (Datenanalyse, Marktverständnis), 2) Messaging & Content (Struktur und Botschaften), 3) Konzept & Design (Figma-Layouts, Designsystem), 4) Entwicklung & Testing (Umsetzung in Webflow, SEO, Tracking, Tests) und 5) Go-Live & Handover (Launch…
  fetched: https://www.designtakt.ch/blog/der-prozess-einer-webseite-bei-designtakt-unser-system-mit-30-umgesetzten-projekten; expected: https://www.designtakt.ch/blog/der-prozess-einer-webseite-bei-designtakt-unser-system-mit-30-umgesetzten-projekten
  grader: Correctly lists the 5-step process matching the cited page.
- [WRONG] Wo sitzt designtakt und in welcher Region arbeitet die Agentur?
  answer: designtakt sitzt in Bern, Schweiz (Hallerstrasse 60, 3012 Bern) und ist zu 100% Swiss Made – alles wird in Bern designt und entwickelt.
  fetched: https://www.designtakt.ch/ueber-uns; expected: https://www.designtakt.ch/services/web-applikationen-softwareentwicklung
  grader: Adds unsupported '100% Swiss Made' claim not found on the cited kontakt page or expected page.
- [CORRECT] Gibt es Referenzprojekte, die zeigen, dass designtakt für SaaS-Startups gearbeitet hat?
  answer: Ja, z.B. der B2B-Webflow-Relaunch für das SaaS-Startup ecoplanet sowie die modulare Webflow-Plattform für das Schweizer SaaS-Startup Pricenow.
  fetched: https://www.designtakt.ch/projekte, https://www.designtakt.ch/projekte/pricenow; expected: https://www.designtakt.ch/projekte/pricenow
  grader: Cites ecoplanet and Pricenow as SaaS-startup projects, consistent with cited page content.
- [CORRECT] Wie kann ich designtakt kontaktieren und wie schnell antworten sie?
  answer: Man kann designtakt über das Kontaktformular auf der Kontaktseite, per E-Mail oder unter der Adresse designtakt GmbH, Hallerstrasse 60, 3012 Bern erreichen; sie melden sich in der Regel innerhalb weniger Stunden zurück.
  fetched: https://www.designtakt.ch/kontakt; expected: https://www.designtakt.ch/kontakt
  grader: Matches contact info and response time from expected/cited page.
- [CORRECT] Wie viele Jahre Erfahrung hat das Team von designtakt?
  answer: Das Team von designtakt arbeitet seit über 8 Jahren als eingespieltes Team zusammen.
  fetched: https://www.designtakt.ch/ueber-uns; expected: https://www.designtakt.ch/ueber-uns
  grader: Matches '8+ Jahre' team experience fact exactly.
- [CORRECT] Wie optimiere ich meinen Content, damit ChatGPT und Perplexity ihn zitieren?
  answer: designtakt bietet AEO (Answer Engine Optimization) an, um sicherzustellen, dass Inhalte von KI-Assistenten wie ChatGPT, Claude, Gemini oder Perplexity korrekt verstanden und als Quelle/Empfehlung/Antwort genannt werden – u.a. durch technische Optimierung, Schema Markup und eine klare Content-/Themen…
  fetched: https://www.designtakt.ch/services/seo-aeo; expected: https://www.designtakt.ch/blog/wie-optimiert-man-content-fur-chatgpt-perplexity-claude
  grader: Answer's claims about AEO, schema markup, and content strategy are supported by the cited seo-aeo page.
- [CORRECT] Warum sollte man Webflow als CMS/Plattform für die nächste Webseite wählen?
  answer: Webflow bietet Design- und Entwicklungsflexibilität ohne umfangreiche Programmierkenntnisse, spart durch Automatisierung (Hosting, Code-Generierung) Zeit und Ressourcen, ermöglicht einfache Integrationen (z.B. mit Figma, Google Analytics), bietet volle Kontrolle über SEO (Meta-Tags, URLs, Sitemaps) …
  fetched: https://www.designtakt.ch/blog/5-grunde-warum-webflow-deine-nachste-webdesign-plattform-sein-sollte; expected: https://www.designtakt.ch/blog/5-grunde-warum-webflow-deine-nachste-webdesign-plattform-sein-sollte
  grader: Accurately lists the 5 reasons for Webflow matching the cited page content.
