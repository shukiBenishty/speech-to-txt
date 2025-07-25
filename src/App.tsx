import { SimpleEditor } from '@/components/tiptap-templates/simple/simple-editor';
import '@/components/tiptap-templates/simple/simple-editor.scss';
import '@/styles/_keyframe-animations.scss';
import '@/styles/_variables.scss';
import './App.css';
import Speech from './Speech';


// --- Tiptap Core Extensions ---
import { StarterKit } from "@tiptap/starter-kit"
import { Image } from "@tiptap/extension-image"
import { TaskItem, TaskList } from "@tiptap/extension-list"
import { TextAlign } from "@tiptap/extension-text-align"
import { Typography } from "@tiptap/extension-typography"
import { Highlight } from "@tiptap/extension-highlight"
import { Subscript } from "@tiptap/extension-subscript"
import { Superscript } from "@tiptap/extension-superscript"
import { Selection } from "@tiptap/extensions"

// --- Tiptap Node ---
import { ImageUploadNode } from "@/components/tiptap-node/image-upload-node/image-upload-node-extension"
import { HorizontalRule } from "@/components/tiptap-node/horizontal-rule-node/horizontal-rule-node-extension"

// --- Lib ---
import { handleImageUpload, MAX_FILE_SIZE } from "@/lib/tiptap-utils"
import { EditorContext, useEditor } from '@tiptap/react';
import { Interim } from './Mark';
import { Placeholder } from '@tiptap/extensions'


export default function App() {
  const editor = useEditor({
    immediatelyRender: false,
    shouldRerenderOnTransaction: false,
    editorProps: {
      attributes: {
        autocomplete: "off",
        autocorrect: "off",
        autocapitalize: "off",
        "aria-label": "Main content area, start typing to enter text.",
        class: "simple-editor",
      },
    },
    extensions: [
      StarterKit.configure({
        horizontalRule: false,
        link: {
          openOnClick: false,
          enableClickSelection: true,
        },
      }),
      HorizontalRule,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      TaskList,
      TaskItem.configure({ nested: true }),
      Highlight.configure({ multicolor: true }),
      Image,
      Typography,
      Superscript,
      Subscript,
      Selection,
      ImageUploadNode.configure({
        accept: "image/*",
        maxSize: MAX_FILE_SIZE,
        limit: 3,
        upload: handleImageUpload,
        onError: (error) => console.error("Upload failed:", error),
      }),
      Interim,
      Placeholder.configure({
        placeholder: "כאן כותבים..."
      })
    ],
    // content: content,
    onUpdate: () => {
      //   onContentChange(editor.getHTML());
    },
  })
  return (
    <div className="app-container">
      <Speech editor={editor} />
      <EditorContext.Provider value={{ editor: editor }}>
        <SimpleEditor
          content={""}
        />
      </EditorContext.Provider>

    </div>
  );
}
