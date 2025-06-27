// ./editorExtensions/CustomImage.js
import { Node, mergeAttributes } from '@tiptap/core'
import { ReactNodeViewRenderer, NodeViewWrapper } from '@tiptap/react'

const CustomImageComponent = (props) => {
  const { node, editor, getPos } = props
  const { src, alt } = node.attrs

  return (
    <NodeViewWrapper
      className='custom-image-wrapper'
      style={{ position: 'relative', display: 'inline-block' }}
    >
      <img
        src={src}
        alt={alt}
        style={{
          maxWidth: '400px',
          maxHeight: '300px',
          borderRadius: '6px',
          border: '1px solid #ccc'
        }}
      />
      <div
        style={{
          position: 'absolute',
          top: 4,
          right: 4,
          background: 'rgba(255,255,255,0.9)',
          borderRadius: '4px',
          padding: '2px 6px',
          display: 'flex',
          gap: '6px',
          zIndex: 10
        }}
      >
        <button
          onClick={() => {
            const newUrl = prompt('Nhập URL ảnh mới:', src)
            if (newUrl) {
              editor
                .chain()
                .focus()
                .command(({ tr }) => {
                  tr.setNodeMarkup(getPos(), undefined, {
                    ...node.attrs,
                    src: newUrl
                  })
                  return true
                })
                .run()
            }
          }}
          style={{
            border: 'none',
            background: 'transparent',
            cursor: 'pointer'
          }}
        >
          ✏️
        </button>
        <button
          onClick={() => {
            editor.chain().focus().deleteNode().run()
          }}
          style={{
            border: 'none',
            background: 'transparent',
            cursor: 'pointer'
          }}
        >
          ❌
        </button>
      </div>
    </NodeViewWrapper>
  )
}

export const CustomImage = Node.create({
  name: 'customImage',
  group: 'inline',
  inline: true,
  draggable: true,
  selectable: true,

  addAttributes() {
    return {
      src: { default: null },
      alt: { default: null }
    }
  },

  parseHTML() {
    return [{ tag: 'img[src]' }]
  },

  renderHTML({ HTMLAttributes }) {
    return ['img', mergeAttributes(HTMLAttributes)]
  },

  addNodeView() {
    return ReactNodeViewRenderer(CustomImageComponent)
  }
})
