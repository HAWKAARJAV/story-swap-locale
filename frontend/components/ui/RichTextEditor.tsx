'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import CharacterCount from '@tiptap/extension-character-count';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import { motion } from 'framer-motion';
import {
  Bold,
  Italic,
  Underline,
  List,
  ListOrdered,
  Quote,
  Link as LinkIcon,
  Image as ImageIcon,
  Type,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Undo,
  Redo,
  Eye,
  Edit3
} from 'lucide-react';
import { useState, useCallback } from 'react';
import { Button } from './Button';

interface RichTextEditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
  maxLength?: number;
  className?: string;
  readOnly?: boolean;
  showWordCount?: boolean;
}

export default function RichTextEditor({
  content,
  onChange,
  placeholder = "Start writing your story...",
  maxLength = 5000,
  className = "",
  readOnly = false,
  showWordCount = true
}: RichTextEditorProps) {
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');
  const [showLinkDialog, setShowLinkDialog] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
      }),
      Placeholder.configure({
        placeholder,
      }),
      CharacterCount.configure({
        limit: maxLength,
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-primary-500 hover:text-primary-600 underline cursor-pointer',
        },
      }),
      Image.configure({
        HTMLAttributes: {
          class: 'max-w-full h-auto rounded-lg shadow-md my-4',
        },
      }),
    ],
    content,
    editable: !readOnly,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: `prose prose-lg max-w-none focus:outline-none ${
          readOnly ? 'cursor-default' : 'min-h-[300px] cursor-text'
        } p-4`,
      },
    },
  });

  const addLink = useCallback(() => {
    const url = linkUrl;
    if (url && editor) {
      editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
      setLinkUrl('');
      setShowLinkDialog(false);
    }
  }, [editor, linkUrl]);

  const addImage = useCallback(() => {
    const url = window.prompt('Enter image URL:');
    if (url && editor) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  }, [editor]);

  if (!editor) {
    return (
      <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 animate-pulse">
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
      </div>
    );
  }

  const ToolbarButton = ({ 
    onClick, 
    isActive = false, 
    disabled = false, 
    children,
    tooltip 
  }: {
    onClick: () => void;
    isActive?: boolean;
    disabled?: boolean;
    children: React.ReactNode;
    tooltip: string;
  }) => (
    <motion.button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`p-2 rounded-md transition-all duration-200 ${
        isActive
          ? 'bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-300'
          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:bg-gray-700'
      } ${
        disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
      }`}
      whileHover={!disabled ? { scale: 1.05 } : {}}
      whileTap={!disabled ? { scale: 0.95 } : {}}
      title={tooltip}
    >
      {children}
    </motion.button>
  );

  return (
    <div className={`border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden bg-white dark:bg-gray-800 ${className}`}>
      {!readOnly && (
        <>
          {/* Main Toolbar */}
          <div className="border-b border-gray-200 dark:border-gray-700 p-2 flex flex-wrap items-center gap-1">
            {/* Text Formatting */}
            <div className="flex items-center gap-1 pr-2 border-r border-gray-200 dark:border-gray-700">
              <ToolbarButton
                onClick={() => editor.chain().focus().toggleBold().run()}
                isActive={editor.isActive('bold')}
                tooltip="Bold (Ctrl+B)"
              >
                <Bold className="w-4 h-4" />
              </ToolbarButton>
              
              <ToolbarButton
                onClick={() => editor.chain().focus().toggleItalic().run()}
                isActive={editor.isActive('italic')}
                tooltip="Italic (Ctrl+I)"
              >
                <Italic className="w-4 h-4" />
              </ToolbarButton>
              
              <ToolbarButton
                onClick={() => editor.chain().focus().toggleStrike().run()}
                isActive={editor.isActive('strike')}
                tooltip="Strikethrough"
              >
                <Underline className="w-4 h-4" />
              </ToolbarButton>
            </div>

            {/* Headings */}
            <div className="flex items-center gap-1 pr-2 border-r border-gray-200 dark:border-gray-700">
              <select
                onChange={(e) => {
                  const level = parseInt(e.target.value);
                  if (level === 0) {
                    editor.chain().focus().setParagraph().run();
                  } else {
                    editor.chain().focus().toggleHeading({ level: level as any }).run();
                  }
                }}
                value={
                  editor.isActive('heading', { level: 1 }) ? 1 :
                  editor.isActive('heading', { level: 2 }) ? 2 :
                  editor.isActive('heading', { level: 3 }) ? 3 : 0
                }
                className="text-sm border-none bg-transparent focus:outline-none cursor-pointer"
              >
                <option value={0}>Paragraph</option>
                <option value={1}>Heading 1</option>
                <option value={2}>Heading 2</option>
                <option value={3}>Heading 3</option>
              </select>
            </div>

            {/* Lists */}
            <div className="flex items-center gap-1 pr-2 border-r border-gray-200 dark:border-gray-700">
              <ToolbarButton
                onClick={() => editor.chain().focus().toggleBulletList().run()}
                isActive={editor.isActive('bulletList')}
                tooltip="Bullet List"
              >
                <List className="w-4 h-4" />
              </ToolbarButton>
              
              <ToolbarButton
                onClick={() => editor.chain().focus().toggleOrderedList().run()}
                isActive={editor.isActive('orderedList')}
                tooltip="Numbered List"
              >
                <ListOrdered className="w-4 h-4" />
              </ToolbarButton>
              
              <ToolbarButton
                onClick={() => editor.chain().focus().toggleBlockquote().run()}
                isActive={editor.isActive('blockquote')}
                tooltip="Quote"
              >
                <Quote className="w-4 h-4" />
              </ToolbarButton>
            </div>

            {/* Media & Links */}
            <div className="flex items-center gap-1 pr-2 border-r border-gray-200 dark:border-gray-700">
              <ToolbarButton
                onClick={() => setShowLinkDialog(true)}
                isActive={editor.isActive('link')}
                tooltip="Add Link"
              >
                <LinkIcon className="w-4 h-4" />
              </ToolbarButton>
              
              <ToolbarButton
                onClick={addImage}
                tooltip="Add Image"
              >
                <ImageIcon className="w-4 h-4" />
              </ToolbarButton>
            </div>

            {/* Undo/Redo */}
            <div className="flex items-center gap-1 pr-2 border-r border-gray-200 dark:border-gray-700">
              <ToolbarButton
                onClick={() => editor.chain().focus().undo().run()}
                disabled={!editor.can().undo()}
                tooltip="Undo (Ctrl+Z)"
              >
                <Undo className="w-4 h-4" />
              </ToolbarButton>
              
              <ToolbarButton
                onClick={() => editor.chain().focus().redo().run()}
                disabled={!editor.can().redo()}
                tooltip="Redo (Ctrl+Y)"
              >
                <Redo className="w-4 h-4" />
              </ToolbarButton>
            </div>

            {/* Preview Toggle */}
            <div className="ml-auto">
              <ToolbarButton
                onClick={() => setIsPreviewMode(!isPreviewMode)}
                isActive={isPreviewMode}
                tooltip={isPreviewMode ? "Edit Mode" : "Preview Mode"}
              >
                {isPreviewMode ? <Edit3 className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </ToolbarButton>
            </div>
          </div>

          {/* Link Dialog */}
          {showLinkDialog && (
            <motion.div 
              className="p-4 bg-gray-50 dark:bg-gray-750 border-b border-gray-200 dark:border-gray-700"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
            >
              <div className="flex items-center gap-2">
                <input
                  type="url"
                  placeholder="Enter URL..."
                  value={linkUrl}
                  onChange={(e) => setLinkUrl(e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      addLink();
                    } else if (e.key === 'Escape') {
                      setShowLinkDialog(false);
                    }
                  }}
                  autoFocus
                />
                <Button onClick={addLink} size="sm">
                  Add Link
                </Button>
                <Button 
                  onClick={() => setShowLinkDialog(false)} 
                  variant="outline" 
                  size="sm"
                >
                  Cancel
                </Button>
              </div>
            </motion.div>
          )}
        </>
      )}

      {/* Editor Content */}
      <div className={`${isPreviewMode ? 'bg-gray-50 dark:bg-gray-750' : ''}`}>
        <EditorContent 
          editor={editor} 
          className={`prose-editor ${isPreviewMode ? 'preview-mode' : ''}`}
        />
      </div>

      {/* Footer */}
      {showWordCount && (
        <div className="px-4 py-2 bg-gray-50 dark:bg-gray-750 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
          <div className="flex items-center gap-4">
            <span>
              {editor.storage.characterCount.words()} words
            </span>
            <span>
              {editor.storage.characterCount.characters()}/{maxLength} characters
            </span>
          </div>
          
          {editor.storage.characterCount.characters() > maxLength * 0.8 && (
            <motion.div 
              className="text-yellow-600 dark:text-yellow-400"
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ repeat: Infinity, duration: 2 }}
            >
              Approaching character limit
            </motion.div>
          )}
        </div>
      )}
    </div>
  );
}