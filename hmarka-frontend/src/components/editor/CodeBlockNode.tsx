import { NodeViewWrapper, NodeViewContent } from '@tiptap/react';
import React from 'react';

export default function CodeBlockNode({ node }: any) {
  const language = node.attrs.language || 'code';

  return (
    <NodeViewWrapper className="relative group mt-6 mb-8 rounded-sm overflow-hidden code-block">
      {/* Top Bar */}
      <div className="flex items-center justify-between px-4 py-2 bg-[#1A1A1A] border-b border-border-color" contentEditable={false}>
        <span className="font-mono text-xs text-text-muted">{language}</span>
        
        <button 
          type="button"
          className="flex items-center gap-1 px-2 py-1 bg-surface border border-border-color rounded-sm font-mono text-xs text-text-muted opacity-50 cursor-not-allowed"
          disabled
        >
          <span className="material-symbols-outlined text-[14px]">content_copy</span>
          Редагування
        </button>
      </div>

      {/* Code Input Area */}
      <div className="p-4 overflow-x-auto bg-[#0A0A0A] w-full min-w-full">
        <pre className="font-mono text-[14px] leading-relaxed m-0 text-gray-300 block">
          <NodeViewContent as={"code" as any} className={`language-${language} outline-none border-none min-w-full block`} />
        </pre>
      </div>
    </NodeViewWrapper>
  );
}
