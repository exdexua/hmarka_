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
          if (!attributes.align || attributes.align === 'left') return {};
          return { 'data-align': attributes.align };
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
