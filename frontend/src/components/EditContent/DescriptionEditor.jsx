import { useEditor, EditorContent } from '@tiptap/react'
import { extensions } from './editorExtensions'
import { useEffect } from 'react'
import MenuBar from './MenuBar' // Thanh công cụ bạn tự xây dựng
import styled from '@emotion/styled'
const StyledEditor = styled.div`
  .ProseMirror {
    min-height: 240px;
    padding: 20px;
    font-size: 16px;
    line-height: 1.5;
    border: 1px solid #ccc;
    border-radius: 6px;
    outline: none;
    white-space: pre-wrap;
    color: #000;
  }

  .ProseMirror:focus {
    border-color: #000;
    box-shadow: 0 0 0 1px #000;
  }
`
export default function DescriptionEditor({
  control,
  name,
  setValue,
  initialHtml,
  onImageInsert
}) {
  const generateEmptyLines = (count) =>
    Array(count).fill('<p><br></p>').join('')

  const editor = useEditor({
    extensions,
    content: initialHtml || generateEmptyLines(10),
    onUpdate: ({ editor }) => {
      const html = editor.getHTML()
      setValue(name, html)
    }
  })

  useEffect(() => {
    if (editor && initialHtml) {
      editor.commands.setContent(initialHtml)
    }
  }, [editor, initialHtml])

  return (
    <div>
      <MenuBar editor={editor} onImageInsert={onImageInsert} />
      <StyledEditor>
        <EditorContent editor={editor} />
      </StyledEditor>
    </div>
  )
}
