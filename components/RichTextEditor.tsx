// components/RichTextEditor.tsx
// TipTap rich text editor component for blog post content
// Supports: headings, bold, italic, lists, code blocks, blockquotes, links

"use client"

import { useEditor, EditorContent } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import Placeholder from "@tiptap/extension-placeholder"
import CharacterCount from "@tiptap/extension-character-count"
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight"
import { createLowlight } from "lowlight"
import javascript from "highlight.js/lib/languages/javascript"
import typescript from "highlight.js/lib/languages/typescript"
import python from "highlight.js/lib/languages/python"
import css from "highlight.js/lib/languages/css"
import sql from "highlight.js/lib/languages/sql"
import bash from "highlight.js/lib/languages/bash"
import {
  Bold,
  Italic,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Code,
  Code2,
  Minus,
  Undo,
  Redo,
} from "lucide-react"

const lowlight = createLowlight()
lowlight.register("javascript", javascript)
lowlight.register("typescript", typescript)
lowlight.register("python", python)
lowlight.register("css", css)
lowlight.register("sql", sql)
lowlight.register("bash", bash)

type ToolbarButtonProps = {
  onClick: () => void
  active?: boolean
  disabled?: boolean
  title: string
  children: React.ReactNode
}

function ToolbarButton({ onClick, active, disabled, title, children }: ToolbarButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={title}
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        width: "2rem",
        height: "2rem",
        borderRadius: "0.3rem",
        border: "none",
        background: active ? "var(--accent-subtle)" : "transparent",
        color: active ? "var(--accent)" : "var(--text-secondary)",
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.4 : 1,
        transition: "all 0.15s ease",
      }}
      onMouseEnter={(e) => {
        if (!disabled && !active) {
          e.currentTarget.style.background = "var(--bg-secondary)"
          e.currentTarget.style.color = "var(--text-primary)"
        }
      }}
      onMouseLeave={(e) => {
        if (!active) {
          e.currentTarget.style.background = "transparent"
          e.currentTarget.style.color = "var(--text-secondary)"
        }
      }}
    >
      {children}
    </button>
  )
}

function Divider() {
  return (
    <div style={{
      width: "1px",
      height: "1.25rem",
      background: "var(--border)",
      margin: "0 0.25rem",
    }} />
  )
}

type Props = {
  content: string
  onChange: (html: string) => void
  placeholder?: string
}

export default function RichTextEditor({ content, onChange, placeholder }: Props) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        codeBlock: false,
      }),
      Placeholder.configure({
        placeholder: placeholder ?? "Start writing your post...",
      }),
      CharacterCount,
      CodeBlockLowlight.configure({
        lowlight,
        defaultLanguage: "javascript",
      }),
    ],
    content: content || "",
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML())
    },
    editorProps: {
      attributes: {
        style: [
          "min-height: 400px",
          "padding: 1.25rem",
          "outline: none",
          "color: var(--text-primary)",
          "font-size: 1rem",
          "line-height: 1.85",
          "font-family: DM Sans, sans-serif",
        ].join(";"),
      },
    },
  })

  if (!editor) return null

  const wordCount = editor.storage.characterCount?.words() ?? 0
  const charCount = editor.storage.characterCount?.characters() ?? 0

  // Estimate reading time (avg 200 words per minute)
  const readingTime = Math.max(1, Math.ceil(wordCount / 200))

  return (
    <div style={{
      border: "1.5px solid var(--border)",
      borderRadius: "0.5rem",
      background: "var(--surface)",
      overflow: "hidden",
      transition: "border-color 0.2s ease",
    }}>
      {/* Toolbar */}
      <div style={{
        display: "flex",
        flexWrap: "wrap",
        alignItems: "center",
        gap: "0.1rem",
        padding: "0.5rem 0.75rem",
        borderBottom: "1px solid var(--border)",
        background: "var(--bg-secondary)",
      }}>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBold().run()}
          active={editor.isActive("bold")}
          title="Bold"
        >
          <Bold size={14} />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleItalic().run()}
          active={editor.isActive("italic")}
          title="Italic"
        >
          <Italic size={14} />
        </ToolbarButton>

        <Divider />

        <ToolbarButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          active={editor.isActive("heading", { level: 2 })}
          title="Heading 2"
        >
          <Heading2 size={14} />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          active={editor.isActive("heading", { level: 3 })}
          title="Heading 3"
        >
          <Heading3 size={14} />
        </ToolbarButton>

        <Divider />

        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          active={editor.isActive("bulletList")}
          title="Bullet list"
        >
          <List size={14} />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          active={editor.isActive("orderedList")}
          title="Numbered list"
        >
          <ListOrdered size={14} />
        </ToolbarButton>

        <Divider />

        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          active={editor.isActive("blockquote")}
          title="Blockquote"
        >
          <Quote size={14} />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleCode().run()}
          active={editor.isActive("code")}
          title="Inline code"
        >
          <Code size={14} />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          active={editor.isActive("codeBlock")}
          title="Code block"
        >
          <Code2 size={14} />
        </ToolbarButton>

        <Divider />

        <ToolbarButton
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
          title="Horizontal rule"
        >
          <Minus size={14} />
        </ToolbarButton>

        <Divider />

        <ToolbarButton
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
          title="Undo"
        >
          <Undo size={14} />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
          title="Redo"
        >
          <Redo size={14} />
        </ToolbarButton>
      </div>

      {/* Editor area */}
      <EditorContent editor={editor} />

      {/* Footer stats */}
      <div style={{
        display: "flex",
        gap: "1.5rem",
        padding: "0.5rem 1.25rem",
        borderTop: "1px solid var(--border)",
        background: "var(--bg-secondary)",
        fontSize: "0.75rem",
        color: "var(--text-muted)",
      }}>
        <span>{wordCount} words</span>
        <span>{charCount} characters</span>
        <span>{readingTime} min read</span>
      </div>

      {/* Editor styles */}
      <style>{`
        .tiptap p { margin-bottom: 1rem; }
        .tiptap h2 { font-family: "DM Serif Display", serif; font-size: 1.5rem; color: var(--text-primary); margin: 1.75rem 0 0.75rem; }
        .tiptap h3 { font-family: "DM Serif Display", serif; font-size: 1.2rem; color: var(--text-primary); margin: 1.5rem 0 0.5rem; }
        .tiptap ul, .tiptap ol { padding-left: 1.5rem; margin-bottom: 1rem; }
        .tiptap li { margin-bottom: 0.35rem; }
        .tiptap blockquote { border-left: 3px solid var(--accent); padding-left: 1.1rem; margin: 1.25rem 0; color: var(--text-muted); font-style: italic; }
        .tiptap code { background: var(--bg-secondary); border: 1px solid var(--border); padding: 0.15rem 0.4rem; border-radius: 0.25rem; font-size: 0.875em; color: var(--accent); }
        .tiptap pre { background: var(--bg-secondary); border: 1px solid var(--border); padding: 1.25rem; border-radius: 0.5rem; overflow-x: auto; margin-bottom: 1.25rem; }
        .tiptap pre code { background: none; border: none; padding: 0; color: var(--text-primary); font-size: 0.9rem; }
        .tiptap hr { border: none; border-top: 1px solid var(--border); margin: 2rem 0; }
        .tiptap p.is-editor-empty:first-child::before { content: attr(data-placeholder); float: left; color: var(--text-muted); pointer-events: none; height: 0; }
        .tiptap a { color: var(--accent); text-decoration: underline; }
        .tiptap strong { font-weight: 700; color: var(--text-primary); }
      `}</style>
    </div>
  )
}
