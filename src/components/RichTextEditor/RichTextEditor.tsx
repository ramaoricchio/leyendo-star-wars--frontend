import React, { useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';

interface Props {
  value: string;
  onChange: (html: string) => void;
}

const btnBase: React.CSSProperties = {
  background: 'none',
  border: 'none',
  borderRadius: 4,
  color: '#9C9788',
  fontFamily: "'DM Sans', sans-serif",
  fontSize: 13,
  fontWeight: 600,
  padding: '4px 8px',
  cursor: 'pointer',
  transition: 'color 0.15s, background 0.15s',
  lineHeight: 1,
};

const btnActive: React.CSSProperties = {
  ...btnBase,
  color: '#C9A84C',
  background: 'rgba(201,168,76,0.1)',
};

const ToolbarBtn: React.FC<{
  onClick: () => void;
  active?: boolean;
  title: string;
  children: React.ReactNode;
}> = ({ onClick, active, title, children }) => (
  <button
    type="button"
    title={title}
    onMouseDown={(e) => { e.preventDefault(); onClick(); }}
    style={active ? btnActive : btnBase}
    onMouseEnter={(e) => {
      if (!active) (e.currentTarget as HTMLButtonElement).style.color = '#F2EEDF';
    }}
    onMouseLeave={(e) => {
      if (!active) (e.currentTarget as HTMLButtonElement).style.color = '#9C9788';
    }}
  >
    {children}
  </button>
);

const RichTextEditor: React.FC<Props> = ({ value, onChange }) => {
  const editor = useEditor({
    extensions: [StarterKit],
    content: value,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  useEffect(() => {
    if (!editor) return;
    const current = editor.getHTML();
    if (current !== value) {
      editor.commands.setContent(value);
    }
  }, [value, editor]);

  if (!editor) return null;

  return (
    <div className="rich-editor">
      {/* Toolbar */}
      <div className="rich-editor__toolbar">
        <ToolbarBtn
          onClick={() => editor.chain().focus().toggleBold().run()}
          active={editor.isActive('bold')}
          title="Negrita"
        >
          <strong>B</strong>
        </ToolbarBtn>
        <ToolbarBtn
          onClick={() => editor.chain().focus().toggleItalic().run()}
          active={editor.isActive('italic')}
          title="Cursiva"
        >
          <em>I</em>
        </ToolbarBtn>

        <div className="rich-editor__sep" />

        <ToolbarBtn
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          active={editor.isActive('heading', { level: 2 })}
          title="Título H2"
        >
          H2
        </ToolbarBtn>
        <ToolbarBtn
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          active={editor.isActive('heading', { level: 3 })}
          title="Título H3"
        >
          H3
        </ToolbarBtn>

        <div className="rich-editor__sep" />

        <ToolbarBtn
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          active={editor.isActive('bulletList')}
          title="Lista"
        >
          ≡
        </ToolbarBtn>
        <ToolbarBtn
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          active={editor.isActive('orderedList')}
          title="Lista numerada"
        >
          1.
        </ToolbarBtn>

        <div className="rich-editor__sep" />

        <ToolbarBtn
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          active={editor.isActive('blockquote')}
          title="Cita"
        >
          "
        </ToolbarBtn>
      </div>

      <EditorContent editor={editor} />
    </div>
  );
};

export default RichTextEditor;
