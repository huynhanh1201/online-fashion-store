import { useEditor, EditorContent } from '@tiptap/react'
import { extensions } from './editorExtensions'
import { useEffect } from 'react'
import MenuBar from './MenuBar' // Thanh công cụ bạn tự xây dựng
import styled from '@emotion/styled'

const StyledEditor = styled.div`
  .ProseMirror {
    min-height: 300px;
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
  .custom-image-wrapper {
    display: block;
    margin: 16px 0;
    max-width: 100%;
    pointer-events: none; /* Disable pointer events */
    height: auto;
  }
  .custom-image-wrapper img {
    display: block;
    margin: 0 auto;
    max-width: 100%;
    height: auto;
    border-radius: 4px;
  }
`

const StyledContainer = styled.div`
  border: 1px solid #aaa;
  position: relative;
  overflow: auto;
  max-height: 500px; /* Set a max height for the container */
`

const StyledMenuBar = styled.div`
  position: sticky;
  top: 0;
  z-index: 10;
  background-color: white; /* Ensure the background is solid */
`

export default function DescriptionEditor({
  control,
  name,
  setValue,
  initialHtml,
  onImageInsert
}) {
  const editor = useEditor({
    extensions,
    content: initialHtml || '',
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
    <StyledContainer>
      <StyledMenuBar>
        <MenuBar editor={editor} onImageInsert={onImageInsert} />
      </StyledMenuBar>
      <StyledEditor>
        <EditorContent editor={editor} />
      </StyledEditor>
    </StyledContainer>
  )
}
