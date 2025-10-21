import type { Guide, Section, Block } from '../types';

const parseInlineFormatting = (text: string): string => {
  // **bold** -> <strong>bold</strong>
  text = text.replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold text-slate-700 dark:text-slate-100">$1</strong>');
  // `code` -> <code>code</code>
  text = text.replace(/`([^`]+)`/g, '<code class="bg-slate-200 dark:bg-slate-700 text-primary-600 dark:text-primary-400 font-mono text-sm rounded-md px-1 py-0.5">$1</code>');
  // [text](url) -> <a href="url">text</a>
  text = text.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-primary-600 dark:text-primary-400 hover:underline">$1</a>');
  return text;
};

const parseSectionContent = (content: string): Block[] => {
  const lines = content.split('\n');
  const blocks: Block[] = [];
  let currentList: string[] | null = null;

  const pushList = () => {
    if (currentList) {
      blocks.push({ type: 'list', items: currentList });
      currentList = null;
    }
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    if (line.startsWith('```')) {
      pushList();
      const language = line.substring(3).trim();
      let codeContent = '';
      i++;
      while (i < lines.length && !lines[i].startsWith('```')) {
        codeContent += lines[i] + '\n';
        i++;
      }
      blocks.push({ type: 'code', language, content: codeContent.trim() });
    } else if (line.startsWith('∘') || line.startsWith('-') || /^\d+\./.test(line)) {
      if (!currentList) {
        currentList = [];
      }
      const listItem = line.replace(/^(∘|-|\d+\.)\s*/, '');
      currentList.push(parseInlineFormatting(listItem));
    } else if (line.startsWith('>')) {
       pushList();
       const blockquoteContent = line.substring(1).trim();
       blocks.push({ type: 'blockquote', content: parseInlineFormatting(blockquoteContent) });
    } else {
      pushList();
      blocks.push({ type: 'paragraph', content: parseInlineFormatting(line) });
    }
  }

  pushList(); // Push any remaining list
  return blocks;
};

const parseSingleGuide = (guideText: string): Guide => {
  const lines = guideText.trim().split('\n');
  const title = lines[0].replace(/^#\s*/, '').trim();
  const description = lines.slice(1).find(line => line.trim() !== '' && !line.startsWith('**') && !line.startsWith('---')) || '';
  
  const sectionsContent = guideText.split('-----------------');
  sectionsContent.shift(); // Remove the intro part

  const sections: Section[] = sectionsContent.map(sectionStr => {
    const sectionLines = sectionStr.trim().split('\n');
    const sectionTitle = sectionLines.shift()?.replace(/^##\s*/, '').trim() || 'Untitled';
    const content = sectionLines.join('\n');
    
    return {
      title: parseInlineFormatting(sectionTitle),
      blocks: parseSectionContent(content)
    };
  });
  
  return { title: parseInlineFormatting(title), description: parseInlineFormatting(description), sections };
};

export const parseGuides = (rawText: string): { rpc: Guide, aztec: Guide } => {
  const [rpcGuideText, aztecGuideText] = rawText.split('GUIDE_SEPARATOR');
  return {
    rpc: parseSingleGuide(rpcGuideText),
    aztec: parseSingleGuide(aztecGuideText)
  };
};
