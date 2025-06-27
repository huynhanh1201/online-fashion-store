import { Node, mergeAttributes } from '@tiptap/core'
import {
  NodeViewWrapper,
  NodeViewContent,
  ReactNodeViewRenderer
} from '@tiptap/react'
import { IconButton } from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'
import React from 'react'

const ImageComponent = ({ node, updateAttributes, deleteNode }) => {
  const { src, alt, title } = node.attrs

  return (
    <NodeViewWrapper
      as='div'
      style={{ position: 'relative', display: 'inline-block' }}
    >
      <img
        src={src}
        alt={alt}
        title={title}
        style={{
          maxWidth: '100%',
          height: 'auto',
          display: 'block',
          borderRadius: 4
        }}
      />
      <div
        style={{
          position: 'absolute',
          top: 4,
          right: 4,
          display: 'flex',
          gap: 4,
          background: 'rgba(255, 255, 255, 0.8)',
          borderRadius: 4,
          padding: '2px'
        }}
      >
        <IconButton size='small' onClick={() => deleteNode()}>
          <DeleteIcon fontSize='small' />
        </IconButton>
        <IconButton size='small' onClick={() => alert('Edit chưa xử lý')}>
          <EditIcon fontSize='small' />
        </IconButton>
      </div>
    </NodeViewWrapper>
  )
}

export const CustomImage = Node.create({
  name: 'image',
  inline: false,
  group: 'block',
  draggable: true,
  selectable: true,

  addAttributes() {
    return {
      src: { default: null },
      alt: { default: null },
      title: { default: null },
      inline: { default: false }
    }
  },

  parseHTML() {
    return [{ tag: 'img[src]' }]
  },

  renderHTML({ HTMLAttributes }) {
    return ['img', mergeAttributes(HTMLAttributes)]
  },

  addNodeView() {
    return ReactNodeViewRenderer(ImageComponent)
  },

  addCommands() {
    return {
      setImage:
        (attrs) =>
        ({ commands }) => {
          return commands.insertContent({
            type: this.name,
            attrs
          })
        }
    }
  }
})
