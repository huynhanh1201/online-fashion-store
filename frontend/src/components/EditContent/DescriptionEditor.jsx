import { useEditor, EditorContent } from '@tiptap/react'
import { useEffect } from 'react'
import { Controller } from 'react-hook-form'
import styled from '@emotion/styled'
import { extensions } from './editorExtensions'
import MenuBar from './MenuBar'
import { useController } from 'react-hook-form'
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
    pointer-events: none;
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
  border: 1px solid ${({ hasError }) => (hasError ? '#f00' : '#aaa')};
  position: relative;
  overflow: auto;
  max-height: 500px;
`

const StyledMenuBar = styled.div`
  position: sticky;
  top: 0;
  z-index: 10;
  background-color: white;
`

export default function DescriptionEditor({
  control,
  name,
  setValue,
  initialHtml,
  onImageInsert,
  isEditMode = false,
  rules = {}
}) {
  const editor = useEditor({
    extensions,
    content: initialHtml || '',
    onUpdate: ({ editor }) => {
      const html = editor.getHTML()
      setValue(name, html, { shouldValidate: true })
    }
  })

  const {
    fieldState: { error }
  } = useController({ name, control })

  useEffect(() => {
    if (editor && initialHtml) {
      editor.commands.setContent(initialHtml)
    }
  }, [editor, initialHtml])

  return (
    <StyledContainer hasError={!!error}>
      <StyledMenuBar>
        <MenuBar editor={editor} onImageInsert={onImageInsert} />
      </StyledMenuBar>

      <StyledEditor>
        <Controller
          name={name}
          control={control}
          rules={{
            ...(isEditMode
              ? {}
              : {
                  required: 'Nội dung không được để trống',
                  validate: (value) =>
                    value?.replace(/<[^>]*>?/gm, '').trim() !== '' ||
                    'Nội dung không được để trống'
                }),
            ...rules
          }}
          render={({ fieldState }) => (
            <>
              <EditorContent editor={editor} />
              {fieldState.error && (
                <div style={{ color: 'red', marginTop: 4, fontSize: 13 }}>
                  {fieldState.error.message}
                </div>
              )}
            </>
          )}
        />
      </StyledEditor>
    </StyledContainer>
  )
}
