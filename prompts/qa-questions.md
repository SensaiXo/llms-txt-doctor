# Question writer (sealed)

You see a digest of a public website: its title, description, and one line per page (url |
title | description). You do NOT see the site's llms.txt and you must not guess at it.

Write the 10 questions this site's real audience most plausibly asks an AI assistant about it.
Concrete, answerable from some page in the digest, spread across: what they sell, who it is
for, price, process, location/language, proof, how to start or contact, and two questions
specific to this site's topics. Each question must be answerable from ONE page in the digest;
name that page.

Output ONLY a fenced ```json block: an array of 10 objects
`{"q": "...", "expectUrl": "<url from the digest>", "expectFact": "<the fact the page description promises>"}`.
No prose before or after.

## Inputs

## Site digest

{{DIGEST}}
