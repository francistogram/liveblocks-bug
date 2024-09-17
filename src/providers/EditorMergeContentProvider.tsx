import { SerializedEditorState, SerializedLexicalNode } from "lexical";
import { ReactNode, createContext, useContext, useState } from "react";

type Context = {
  editorContent: {
    [id: string]: {
      additionalEditorState: SerializedEditorState<SerializedLexicalNode> | null;
      editorState: SerializedEditorState<SerializedLexicalNode> | null;
    };
  };
  setEditorContent: (editorContent: {
    [id: string]: {
      additionalEditorState: SerializedEditorState<SerializedLexicalNode> | null;
      editorState: SerializedEditorState<SerializedLexicalNode> | null;
    };
  }) => void;
  clearEditorContent: (editorID: string) => void;
};

const EditorMergeContext = createContext<Context>({
  editorContent: {},
  setEditorContent: () => {},
  clearEditorContent: () => {},
});

type Props = {
  children: ReactNode;
};

const EditorMergeContentProvider = ({ children }: Props) => {
  const [editorContent, setEditorContent] = useState<{
    [id: string]: {
      additionalEditorState: SerializedEditorState<SerializedLexicalNode> | null;
      editorState: SerializedEditorState<SerializedLexicalNode> | null;
    };
  }>({});

  const clearEditorContent = (editorID: string) => {
    setEditorContent((prevEditorContent) => {
      delete prevEditorContent[editorID];

      return prevEditorContent;
    });
  };

  const updateEditorContent = (additionalEditorContent: {
    [id: string]: {
      additionalEditorState: SerializedEditorState<SerializedLexicalNode> | null;
      editorState: SerializedEditorState<SerializedLexicalNode> | null;
    };
  }) => {
    setEditorContent({
      ...editorContent,
      ...additionalEditorContent,
    });
  };

  return (
    <EditorMergeContext.Provider
      value={{
        editorContent,
        setEditorContent: updateEditorContent,
        clearEditorContent,
      }}
    >
      {children}
    </EditorMergeContext.Provider>
  );
};

const useEditorMergeContent = () => {
  return useContext(EditorMergeContext);
};

export { EditorMergeContentProvider, useEditorMergeContent };
