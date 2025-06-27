// Core extensions từ Tiptap
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'
import Underline from '@tiptap/extension-underline'
import TextStyle from '@tiptap/extension-text-style'
import BulletList from '@tiptap/extension-bullet-list'
import OrderedList from '@tiptap/extension-ordered-list'
import TaskList from '@tiptap/extension-task-list'
import TaskItem from '@tiptap/extension-task-item'
import Link from '@tiptap/extension-link'
import { Video } from 'reactjs-tiptap-editor/video'
import HorizontalRule from '@tiptap/extension-horizontal-rule'
import Blockquote from '@tiptap/extension-blockquote'
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight'
// import { lowlight } from 'lowlight'
import Table from '@tiptap/extension-table'
import TableRow from '@tiptap/extension-table-row'
import TableCell from '@tiptap/extension-table-cell'
import TableHeader from '@tiptap/extension-table-header'
import CharacterCount from '@tiptap/extension-character-count'
import { Indent } from 'reactjs-tiptap-editor/indent'

import { FontSize } from 'reactjs-tiptap-editor/fontsize'
import { FontFamily } from 'reactjs-tiptap-editor/fontfamily'
import { Color } from 'reactjs-tiptap-editor/color'
import { Highlight } from 'reactjs-tiptap-editor/highlight'
import { Emoji } from 'reactjs-tiptap-editor/emoji'
import { TextAlign } from 'reactjs-tiptap-editor/textalign'
import { Iframe } from 'reactjs-tiptap-editor/iframe'

import { CustomImage } from './CustomImage'

export const extensions = [
  StarterKit.configure({
    codeBlock: false
  }),
  // CodeBlockLowlight.configure({ lowlight }),
  Placeholder.configure({ placeholder: 'Nhập nội dung...' }),
  Underline,
  TextStyle,
  FontSize,
  FontFamily,
  Color,
  Highlight,
  Emoji,
  TextAlign.configure({ types: ['heading', 'paragraph'] }),
  BulletList,
  OrderedList,
  TaskList,
  TaskItem.configure({ nested: true }),
  Link.configure({ openOnClick: false }),
  CustomImage,
  Video,
  HorizontalRule,
  Blockquote,
  Table.configure({ resizable: true }),
  TableRow,
  TableHeader,
  TableCell,
  Iframe,
  Indent,
  CharacterCount.configure({ limit: 10000 })
]
