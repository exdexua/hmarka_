import { Editor } from '@tiptap/react';

interface EditorToolbarProps {
  editor: Editor | null;
  isFullscreen: boolean;
  onToggleFullscreen: () => void;
  onImageUploadClick: () => void;
}

export default function EditorToolbar({ editor, isFullscreen, onToggleFullscreen, onImageUploadClick }: EditorToolbarProps) {
  if (!editor) return null;

  const setLink = () => {
    const previousUrl = editor.getAttributes('link').href;
    const url = window.prompt('URL посилання:', previousUrl);

    // cancelled
    if (url === null) {
      return;
    }

    // empty
    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
      return;
    }

    // update link
    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
  };

  const ToolbarButton = ({ 
    onClick, 
    isActive = false, 
    icon, 
    title 
  }: { 
    onClick: () => void, 
    isActive?: boolean, 
    icon: string, 
    title: string 
  }) => (
    <button
      type="button"
      onClick={onClick}
      title={title}
      className={`p-2 flex items-center justify-center rounded-md transition-all ${
        isActive 
          ? 'bg-purple-500/20 text-purple-400' 
          : 'text-gray-400 hover:text-gray-100 hover:bg-gray-800'
      }`}
    >
      <span className="material-symbols-outlined text-[20px]">{icon}</span>
    </button>
  );

  return (
    <div className="flex flex-wrap items-center gap-1 p-2 bg-gray-950/80 border-b border-gray-800 sticky top-0 z-10 rounded-t-xl transition-all">
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleBold().run()}
        isActive={editor.isActive('bold')}
        icon="format_bold"
        title="Жирний"
      />
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleItalic().run()}
        isActive={editor.isActive('italic')}
        icon="format_italic"
        title="Курсив"
      />
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleStrike().run()}
        isActive={editor.isActive('strike')}
        icon="format_strikethrough"
        title="Закреслений"
      />
      
      <div className="w-px h-6 bg-gray-800 mx-1"></div>

      <ToolbarButton
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        isActive={editor.isActive('heading', { level: 1 })}
        icon="format_h1"
        title="Заголовок 1"
      />
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        isActive={editor.isActive('heading', { level: 2 })}
        icon="format_h2"
        title="Заголовок 2"
      />
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        isActive={editor.isActive('heading', { level: 3 })}
        icon="format_h3"
        title="Заголовок 3"
      />

      <div className="w-px h-6 bg-gray-800 mx-1"></div>

      <ToolbarButton
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        isActive={editor.isActive('bulletList')}
        icon="format_list_bulleted"
        title="Маркований список"
      />
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        isActive={editor.isActive('orderedList')}
        icon="format_list_numbered"
        title="Нумерований список"
      />
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        isActive={editor.isActive('blockquote')}
        icon="format_quote"
        title="Цитата"
      />

      <div className="w-px h-6 bg-gray-800 mx-1"></div>

      <ToolbarButton
        onClick={() => {
          if (editor.isActive('image')) {
            editor.chain().focus().updateAttributes('image', { align: 'left' }).run();
          } else {
            editor.chain().focus().setTextAlign('left').run();
          }
        }}
        isActive={editor.isActive({ textAlign: 'left' }) || editor.isActive('image', { align: 'left' })}
        icon="format_align_left"
        title="Ліворуч"
      />
      <ToolbarButton
        onClick={() => {
          if (editor.isActive('image')) {
            editor.chain().focus().updateAttributes('image', { align: 'center' }).run();
          } else {
            editor.chain().focus().setTextAlign('center').run();
          }
        }}
        isActive={editor.isActive({ textAlign: 'center' }) || editor.isActive('image', { align: 'center' })}
        icon="format_align_center"
        title="По центру"
      />
      <ToolbarButton
        onClick={() => {
          if (editor.isActive('image')) {
            editor.chain().focus().updateAttributes('image', { align: 'right' }).run();
          } else {
            editor.chain().focus().setTextAlign('right').run();
          }
        }}
        isActive={editor.isActive({ textAlign: 'right' }) || editor.isActive('image', { align: 'right' })}
        icon="format_align_right"
        title="Праворуч"
      />
      <ToolbarButton
        onClick={() => {
          if (!editor.isActive('image')) {
            editor.chain().focus().setTextAlign('justify').run();
          }
        }}
        isActive={editor.isActive({ textAlign: 'justify' })}
        icon="format_align_justify"
        title="По ширині"
      />

      <div className="w-px h-6 bg-gray-800 mx-1"></div>

      <ToolbarButton
        onClick={setLink}
        isActive={editor.isActive('link')}
        icon="link"
        title="Вставити посилання"
      />

      <ToolbarButton
        onClick={onImageUploadClick}
        icon="image"
        title="Вставити фото"
      />

      <div className="flex-grow"></div>

      <ToolbarButton
        onClick={onToggleFullscreen}
        isActive={isFullscreen}
        icon={isFullscreen ? 'fullscreen_exit' : 'fullscreen'}
        title="Повноекранний режим"
      />
    </div>
  );
}
