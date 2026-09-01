# Agent, step 1: choose what to fetch (sealed)

You are an AI assistant answering questions about a website. Your ONLY knowledge of the site is
its llms.txt below. You may fetch at most 2 of the linked URLs per question. Choose them.

For each question, pick the URL(s) from the llms.txt most likely to answer it. If nothing in the
file looks relevant, return an empty list for that question: do not guess URLs that are not in
the file.

Output ONLY a fenced ```json block: an array, same order as the questions,
`{"i": <index>, "urls": ["<url from llms.txt>", ...]}`.

## Inputs

## llms.txt

{{LLMS}}

## Questions

{{QUESTIONS}}
