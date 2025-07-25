"use client"

import * as React from "react"
import { type Editor, useEditorState } from "@tiptap/react"
import { useHotkeys } from "react-hotkeys-hook"
import { NodeSelection, TextSelection } from "@tiptap/pm/state"

// --- Hooks ---
import { useTiptapEditor } from "@/hooks/use-tiptap-editor"

// --- Lib ---
import {
  findNodePosition,
  isNodeInSchema,
  isNodeTypeSelected,
  isValidPosition,
} from "@/lib/tiptap-utils"

// --- Icons ---
import { CodeBlockIcon } from "@/components/tiptap-icons/code-block-icon"

export const CODE_BLOCK_SHORTCUT_KEY = "mod+alt+c"

/**
 * Configuration for the code block functionality
 */
export interface UseCodeBlockConfig {
  /**
   * The Tiptap editor instance.
   */
  editor?: Editor | null
  /**
   * Whether the button should hide when code block is not available.
   * @default false
   */
  hideWhenUnavailable?: boolean
  /**
   * Callback function called after a successful code block toggle.
   */
  onToggled?: () => void
}

/**
 * Checks if code block can be toggled in the current editor state
 */
export function canToggle(
  editor: Editor | null,
  turnInto: boolean = true
): boolean {
  if (!editor || !editor.isEditable) return false
  if (
    !isNodeInSchema("codeBlock", editor) ||
    isNodeTypeSelected(editor, ["image"])
  )
    return false

  if (!turnInto) {
    return editor.can().toggleNode("codeBlock", "paragraph")
  }

  try {
    const view = editor.view
    const state = view.state
    const selection = state.selection

    if (selection.empty || selection instanceof TextSelection) {
      const pos = findNodePosition({
        editor,
        node: state.selection.$anchor.node(1),
      })?.pos
      if (!isValidPosition(pos)) return false
    }

    return true
  } catch {
    return false
  }
}

/**
 * Toggles code block in the editor
 */
export function toggleCodeBlock(editor: Editor | null): boolean {
  if (!editor || !editor.isEditable) return false
  if (!canToggle(editor)) return false

  try {
    const view = editor.view
    let state = view.state
    let tr = state.tr

    // No selection, find the the cursor position
    if (state.selection.empty || state.selection instanceof TextSelection) {
      const pos = findNodePosition({
        editor,
        node: state.selection.$anchor.node(1),
      })?.pos
      if (!isValidPosition(pos)) return false

      tr = tr.setSelection(NodeSelection.create(state.doc, pos))
      view.dispatch(tr)
      state = view.state
    }

    const selection = state.selection

    let chain = editor.chain().focus()

    // Handle NodeSelection
    if (selection instanceof NodeSelection) {
      const firstChild = selection.node.firstChild?.firstChild
      const lastChild = selection.node.lastChild?.lastChild

      const from = firstChild
        ? selection.from + firstChild.nodeSize
        : selection.from + 1

      const to = lastChild
        ? selection.to - lastChild.nodeSize
        : selection.to - 1

      chain = chain.setTextSelection({ from, to }).clearNodes()
    }

    const toggle = editor.isActive("codeBlock")
      ? chain.setNode("paragraph")
      : chain.toggleNode("codeBlock", "paragraph")

    toggle.run()

    editor.chain().focus().selectTextblockEnd().run()

    return true
  } catch {
    return false
  }
}

/**
 * Determines if the code block button should be shown
 */
export function shouldShowButton(props: {
  editor: Editor | null
  hideWhenUnavailable: boolean
  canToggle: boolean
}): boolean {
  const { editor, hideWhenUnavailable, canToggle } = props

  if (!editor || !editor.isEditable) return false
  if (!isNodeInSchema("codeBlock", editor)) return false

  if (hideWhenUnavailable) {
    return canToggle
  }

  return true
}


/**
 * Custom hook that provides code block functionality for Tiptap editor
 *
 * @example
 * ```tsx
 * // Simple usage - no params needed
 * function MySimpleCodeBlockButton() {
 *   const { isVisible, isActive, handleToggle } = useCodeBlock()
 *
 *   if (!isVisible) return null
 *
 *   return (
 *     <button
 *       onClick={handleToggle}
 *       aria-pressed={isActive}
 *     >
 *       Code Block
 *     </button>
 *   )
 * }
 *
 * // Advanced usage with configuration
 * function MyAdvancedCodeBlockButton() {
 *   const { isVisible, isActive, handleToggle, label } = useCodeBlock({
 *     editor: myEditor,
 *     hideWhenUnavailable: true,
 *     onToggled: (isActive) => console.log('Code block toggled:', isActive)
 *   })
 *
 *   if (!isVisible) return null
 *
 *   return (
 *     <MyButton
 *       onClick={handleToggle}
 *       aria-label={label}
 *       aria-pressed={isActive}
 *     >
 *       Toggle Code Block
 *     </MyButton>
 *   )
 * }
 * ```
 */
export function useCodeBlock(config?: UseCodeBlockConfig) {
  const {
    editor: providedEditor,
    hideWhenUnavailable = false,
    onToggled,
  } = config || {}

  const { editor } = useTiptapEditor(providedEditor)

  const { isActive= false, canToggle: canToggleState= false } = useEditorState({
    editor,
    selector: (state) => {
      const { from, to } = state.editor?.state.selection || { from: 0, to: 0 }
      const isSame = from === to
      const isCode = editor?.isActive("code")

      return {
        isActive: editor?.isActive("codeBlock") || false,
        canToggle:
          !isCode || (isCode && isSame) ? canToggle(editor, false) : false,
      }
    },
  }) || {}

  const isVisible = shouldShowButton({
    editor,
    hideWhenUnavailable,
    canToggle: canToggleState,
  })

  const handleToggle = React.useCallback(() => {
    if (!editor) return false

    const success = toggleCodeBlock(editor)
    if (success) {
      onToggled?.()
    }
    return success
  }, [editor, onToggled])

  useHotkeys(
    CODE_BLOCK_SHORTCUT_KEY,
    (event) => {
      event.preventDefault()
      handleToggle()
    },
    {
      enabled: isVisible && canToggleState,
      enableOnContentEditable: true,
      enableOnFormTags: true,
    }
  )

  return {
    isVisible,
    isActive,
    handleToggle,
    canToggle: canToggleState,
    label: "Code Block",
    shortcutKeys: CODE_BLOCK_SHORTCUT_KEY,
    Icon: CodeBlockIcon,
  }
}