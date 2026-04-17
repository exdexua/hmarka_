import { ReactNodeViewRenderer } from '@tiptap/react';
import Image from '@tiptap/extension-image';
import CodeBlock from '@tiptap/extension-code-block';
import ResizableImageNode from './ResizableImageNode';
import CodeBlockNode from './CodeBlockNode';

// Extend the image extension to allow width attribute for resizing
export const ResizableImage = Image.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      width: {
        default: null,
        parseHTML: element => element.getAttribute('width'),
        renderHTML: attributes => {
          if (!attributes.width) return {};
          return { width: attributes.width };
        }
      },
      align: {
        default: 'left',
        parseHTML: element => element.getAttribute('data-align') || 'left',
        renderHTML: attributes => {
          return { 'data-align': attributes.align };
        }
      }
    };
  },
  addStorage() {
    return {
      markdown: {
        serialize(state: any, node: any) {
          const align = node.attrs.align || 'left';
          const width = node.attrs.width || 'auto';
          const src = node.attrs.src;
          const alt = node.attrs.alt || '';
          const title = node.attrs.title || '';
          
          if (width !== 'auto' || align !== 'left') {
            const titleAttr = title ? ` title="${title}"` : '';
            state.write(`<img src="${src}" alt="${alt}" width="${width}" data-align="${align}"${titleAttr}>`);
          } else {
            state.write(`![${alt}](${src}${title ? ` "${title}"` : ''})`);
          }
        }
      }
    };
  },
  addNodeView() {
    return ReactNodeViewRenderer(ResizableImageNode);
  }
});

// Extend CodeBlock to use our interactive frontend component layout
export const CustomCodeBlock = CodeBlock.extend({
  addNodeView() {
    return ReactNodeViewRenderer(CodeBlockNode);
  }
});
