# Mastra semantic Markdown: final heading disappears

Minimal reproduction for `@mastra/rag` 2.8.2. Found through AI-assisted source inspection, then reproduced through the public `MDocument` API. No model, embedding service, API key, or network request is needed to run the script after installation.

## Run

```sh
npm ci --ignore-scripts
npm start
```

Tested with Node 24.11.1 on Windows. Dependencies are pinned by `package-lock.json`.

## Expected and actual

| Input | Actual result | Expected |
| --- | --- | --- |
| `# Deployment checklist` | No chunks | Preserve the heading |
| A section with content followed by `## Rollback checklist` | The final heading disappears | Preserve both headings |
| Final heading followed by a body | Heading and body survive | Same |
| Empty parent heading before a child with content | Both headings survive | Same |

The script runs all four cases with `joinThreshold: 1` and `joinThreshold: 500`. The first two lose content at either threshold. This matters when indexing an outline or an incomplete document: the missing heading cannot be embedded or retrieved.

## Cause and candidate fix

In `packages/rag/src/document/transformers/semantic-markdown.ts`, the section flush when a new heading is encountered preserves a heading even when its body is empty. The end-of-input flush only checks the body.

Use the same condition for the final flush:

```diff
-    if (currentContent.trim() !== '') {
+    if (currentContent.trim() !== '' || (currentTitle && currentDepth > 0)) {
       sections.push({
```

This change was checked separately against the installed package's corresponding JavaScript condition. The two failing cases retain their headings; both control cases keep their previous output. The reproduction here uses the unmodified released package. The full Mastra test suite was not run.
