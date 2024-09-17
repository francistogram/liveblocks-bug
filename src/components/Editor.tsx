"use client";

import * as React from "react";
import {
  $getRoot,
  $getSelection,
  SerializedEditorState,
  SerializedLexicalNode,
} from "lexical";

import { AutoFocusPlugin } from "@lexical/react/LexicalAutoFocusPlugin";
import {
  InitialEditorStateType,
  LexicalComposer,
} from "@lexical/react/LexicalComposer";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import { PlainTextPlugin } from "@lexical/react/LexicalPlainTextPlugin";
import SplitEditorPlugin from "./SplitEditorPlugin";
import initialPlainTextEditorState from "~/constants/initialPlainTextEditorState";

const Editor = ({
  id,
  editorState,
  addEditor,
}: {
  id: string;
  editorState: InitialEditorStateType | null;
  addEditor: (editorState: InitialEditorStateType) => void;
}) => {
  return (
    <LexicalComposer
      initialConfig={{
        namespace: "MyEditor",
        editable: true,
        onError: (error: Error) => console.error(error),
        editorState:
          editorState == null || Object.keys(editorState).length === 0
            ? JSON.stringify(initialPlainTextEditorState)
            : JSON.stringify(editorState),
      }}
    >
      <div className="w-full rounded-md bg-white px-2 text-black">
        <PlainTextPlugin
          contentEditable={<ContentEditable className="editor-input" />}
          ErrorBoundary={LexicalErrorBoundary}
          placeholder={<div>Enter text...</div>}
        />
        <HistoryPlugin />
        <AutoFocusPlugin />
        <SplitEditorPlugin editorID={id} addEditor={addEditor} />
      </div>
    </LexicalComposer>
  );
};

export default Editor;
