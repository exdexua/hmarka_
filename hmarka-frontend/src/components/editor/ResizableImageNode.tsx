import { NodeViewWrapper } from '@tiptap/react';
import React, { useState, useEffect, useRef } from 'react';

export default function ResizableImageNode(props: any) {
  const { node, updateAttributes, selected } = props;
  const [initWidth, setInitWidth] = useState<number | null>(null);
  const [initMouseX, setInitMouseX] = useState<number | null>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  const startDrag = (e: React.MouseEvent) => {
    e.preventDefault();
    if (imageRef.current) {
      setInitWidth(imageRef.current.offsetWidth);
      setInitMouseX(e.clientX);
    }
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (initWidth !== null && initMouseX !== null) {
        const dx = e.clientX - initMouseX;
        const newWidth = Math.max(50, initWidth + dx); // min width 50px
        updateAttributes({ width: `${newWidth}px` });
      }
    };

    const handleMouseUp = () => {
      setInitWidth(null);
      setInitMouseX(null);
    };

    if (initWidth !== null) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [initWidth, initMouseX, updateAttributes]);

  const align = node.attrs.align || 'left';
  let justifyClass = 'justify-start';
  if (align === 'center') justifyClass = 'justify-center';
  if (align === 'right') justifyClass = 'justify-end';

  return (
    <NodeViewWrapper className={`relative w-full flex ${justifyClass} py-4 ${selected ? 'z-20' : 'z-10'}`}>
      <div className={`relative ${selected ? 'ring-2 ring-primary ring-offset-2 ring-offset-gray-950 rounded-sm' : ''}`}>
      <img
        ref={imageRef}
        src={node.attrs.src}
        alt={node.attrs.alt}
        title={node.attrs.title}
        width={node.attrs.width}
        style={{ width: node.attrs.width }}
        className="max-w-full h-auto block"
        draggable={false}
      />
      
      {/* Drag handle visible only when selected/clicked on image block */}
      {selected && (
        <div 
          className="absolute right-0 bottom-0 w-5 h-5 bg-primary border-4 border-gray-900 rounded-full cursor-se-resize shadow-lg transform translate-x-1/2 translate-y-1/2 z-10"
          onMouseDown={startDrag}
        />
      )}
      </div>
    </NodeViewWrapper>
  );
}
