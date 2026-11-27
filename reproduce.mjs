import { MDocument } from '@mastra/rag';

const cases = [
  ['heading only', '# Deployment checklist'],
  ['final empty section', '# Setup\nInstall the package.\n\n## Rollback checklist'],
  ['same section with content', '# Setup\nInstall the package.\n\n## Rollback checklist\nRestore the previous version.'],
  ['empty parent before child', '# Setup\n## Install\nInstall the package.'],
];

for (const [label, markdown] of cases) {
  for (const joinThreshold of [1, 500]) {
    const document = MDocument.fromMarkdown(markdown);
    await document.chunk({ strategy: 'semantic-markdown', joinThreshold });
    console.log(JSON.stringify({ label, joinThreshold, chunks: document.getDocs().map(({ text }) => text) }));
  }
}
