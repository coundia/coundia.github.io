# Signs of AI writing

Summary of the Wikipedia guide [Wikipedia:Signs of AI writing](https://en.wikipedia.org/wiki/Wikipedia:Signs_of_AI_writing), read on 2026-11-14.

It was written to spot undisclosed AI text on Wikipedia, but most of the signs apply to any prose, including the texts of this portfolio (`src/data/**/*.json`, README, commit messages). Use it as a checklist when you write or review a text.

## How to read this list

- These are **signs, not proof**. Models learn from human text, so humans also write this way. One or two signs can be chance; a **cluster** of them in the same text is what counts.
- The signs point to a **deeper problem**: vague, generic, inflated content. Replacing a word with a synonym hides the sign without fixing the text. Fix the substance: say a concrete fact instead.
- Detectors (GPTZero, Pangram...) make mistakes and can be fooled. People are not much better: one 2025 study found detection no better than chance.
- The signs change with the models. A list from 2023 does not describe 2026 output.

## 1. Content

Models drift toward what is statistically common: specific facts get replaced by vague, positive language.

| Sign | Words and patterns to watch |
| :--- | :--- |
| Inflated significance, legacy, broader trends | "stands / serves as", "is a testament / reminder", "a pivotal / crucial / vital / key role", "underscores its importance", "evolving landscape", "setting the stage for", "indelible mark" |
| Emphasis on notability and media coverage | "independent coverage", "national media outlets", "trade publications", "featured / profiled in" |
| Emphasis on how sources describe the subject | "is listed in", "describe X as", "his professional profile lists" (common since 2026) |
| Emphasis on online presence | "maintains an active social media presence" |
| Superficial analysis, often as a trailing "-ing" clause | "highlighting", "underscoring", "ensuring", "reflecting", "symbolizing", "contributing to", "fostering", "enhancing", "valuable insights", "aligns / resonates with" |
| Vague connection | "in connection with", "associated with", "particularly / widely associated" |
| Vague attribution, generalised opinion | "Experts argue", "Observers have cited", "Industry reports", "several sources" (when there are few) |
| Formulaic conclusion on challenges and outlook | "Despite its... faces several challenges", "Despite these challenges", "Future Outlook" sections |
| "X and Y" headings | "Awards and recognition", "Challenges and Legacy" |

## 2. Language and grammar

### Overused vocabulary, by period

A single word means nothing. **Many** of these words in the same text is a strong sign. The list is literal: overusing one word does not mean its synonyms are overused too.

- **2023 – mid-2024 (GPT-4):** additionally, boasts, bolstered, crucial, delve, emphasizing, enduring, garner, intricate / intricacies, interplay, key, landscape, meticulously, pivotal, underscore, tapestry, testament, valuable, vibrant.
- **Mid-2024 – mid-2025 (GPT-4o):** align with, bolstered, crucial, emphasizing, enhance, enduring, fostering, highlighting, pivotal, showcasing, underscore, vibrant.
- **Mid-2025 – mid-2026 (GPT-5):** emphasizing, enhance, highlighting, showcasing, plus the notability vocabulary above.
- **Since mid-2026:** challenge, clearer, dependable, echoed, foster, leverage, matters, multifaceted, practical, prioritize, quietly, steady, universally. Also: more periods and commas, sentences of about 8 to 20 words.
- **Grok:** causal, empirical, correlate, underscore.

### Constructions

- **Avoiding "is / are":** "serves as", "stands as", "marks", "functions as", "represents", "boasts", "features", "offers", "refers to".
- **Negative parallelisms:** "not only... but also...", "It's not X, it's Y", "no X, no Y, just Z", and the reversed form, which is frequent recently: "Y rather than X".
- **Rule of three:** "adjective, adjective, adjective" or three short phrases in a row, to make a thin analysis look complete.
- **Elegant variation:** a rotation of synonyms to refer to the same thing (an older sign).

## 3. Style and formatting

- Title Case in headings.
- Bold everywhere.
- Lists with a bold inline header ("**Term:** explanation").
- Emoji at the start of headings or list items.
- Curly quotes and apostrophes in a context that normally uses straight ones.
- Markdown where it doesn't belong: `**bold**`, `#` headings, `---`, `[text](url)` links, code blocks.
- Leftover internal markup, such as `contentReference[oaicite:1]`.

## 4. Text addressed to the user, left in place

- **Chatbot phrases:** "I hope this helps", "Certainly!", "You're absolutely right!", "Would you like...", "let me know", "here is a more detailed breakdown", "In this section, we will discuss...".
- **Hedging about sources:** "While specific details are limited", "not widely documented", "based on available information", "does not by itself establish". Since mid-2026 these also include "should be treated as... rather than..." and "should not be confused with...".
- **Placeholders:** "[Your Name]", "[Describe...]", dates like `2025-XX-XX`, URLs like `INSERT_SOURCE_URL` or `example.com`.

## 5. Sources and links

- Dead links that cannot be found in the Internet Archive.
- Invalid ISBNs and DOIs, or DOIs that lead to an unrelated article.
- Book citations without page numbers, or with pages that do not support the text.
- Tracking parameters such as `utm_source=chatgpt.com`, `utm_source=openai`, `copilot.com` or `referrer=grok.com`. These show a chatbot was used to find the source, not that it wrote the text.

## 6. Change notes and comments

These apply to Wikipedia edit summaries, and likewise to commit messages:

- **Canned assurances:** "ensured that... adheres to", "refined", "enhanced", "streamlined", "improved clarity and flow", "neutral tone".
- **Preservation claims:** "preserved", "retained", "avoided".
- **Procedural detail:** long lists of every parameter or markup element touched.
- **Customer-service tone:** "carefully reviewed", "apologies for any inconvenience".

## 7. Older signs (rarer now)

- **Promotional tone:** "boasts a", "vibrant", "rich", "nestled", "in the heart of", "groundbreaking", "renowned", "diverse array".
- **Knowledge-cutoff statements:** "as of my last knowledge update".
- **Closing summaries:** "In summary", "In conclusion", "Overall".
- **Refusals:** "As an AI language model...".
- **Em dashes (—):** used heavily until September 2026, where a comma, parentheses or a colon would fit. Some recent models avoid them, so the sign has shifted to heavy use of commas and periods.
- **Text cut off** mid-sentence.

## 8. What is NOT a reliable sign

- Perfect grammar.
- Bland or overly polished prose.
- Mixed registers.
- Isolated transition words ("Additionally", "Notably").
- Unsourced content.
- Clean markup.

A false accusation is costly, so watch out for confirmation bias.

## 9. Signs of human writing

- The text predates ChatGPT's launch (30 November 2022).
- The author can explain their choices.
- Simple constructions: "there is a", "it has a".
- Plain verbs: "wrote" rather than "authored", "died" rather than "passed away".
- Superlatives ("one of the best", "was the first") and nuance ("very", "perhaps", "tends to").
- Wordy phrases: "in order to", "as a result of", "the fact that".

## Checklist for this portfolio

Before publishing a text (experience, case study, open source project, README):

1. Does every sentence carry a **verifiable fact** (number, tech, client, result)? Otherwise cut it or make it concrete.
2. Look for the vocabulary in section 2. More than one or two hits in one paragraph means rewrite.
3. Replace "serves as / stands as / represents" with "is".
4. Remove "not only... but also", "X rather than Y" and rule-of-three lists that add nothing.
5. No trailing "-ing" clause that adds unsourced praise ("..., highlighting his commitment to quality").
6. Headings in sentence case, no emoji, bold kept to a minimum.
7. Commit messages: say what changed, without "improved clarity", "ensured consistency" or "enhanced".
