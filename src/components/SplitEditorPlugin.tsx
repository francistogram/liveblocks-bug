import { useEffect, useState } from "react";

import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $getRoot } from "lexical";
import { useAutosave } from "react-autosave";
import initialPlainTextEditorState from "~/constants/initialPlainTextEditorState";
import { useEditorMergeContent } from "~/providers/EditorMergeContentProvider";
import { InitialEditorStateType } from "@lexical/react/LexicalComposer";

const formatTextAsLexicalContent = (
  text: string,
  editorType: "simple" | "rich",
) => {
  if (text.trim().length === 0) {
    return {};
  }

  const splitNewLines = text.split("\n");

  let children = [];

  if (editorType === "rich") {
    children = splitNewLines.map((line) => {
      if (line.length === 0) {
        return {
          type: "paragraph",
          format: "",
          indent: 0,
          version: 1,
          children: [],
          direction: null,
        };
      } else {
        return {
          type: "paragraph",
          format: "",
          indent: 0,
          version: 1,
          children: [
            {
              mode: "normal",
              text: line,
              type: "text",
              style: "",
              detail: 0,
              format: 0,
              version: 1,
            },
          ],
          direction: "ltr",
        };
      }
    });
  } else {
    let subChildren: {}[] = [];

    splitNewLines.forEach((line, index) => {
      if (line.length === 0) {
        subChildren.push({
          type: "linebreak",
          version: 1,
        });
      } else {
        subChildren.push({
          mode: "normal",
          text: line,
          type: "text",
          style: "",
          detail: 0,
          format: 0,
          indent: 0,
          version: 1,
        });
        if (index !== splitNewLines.length - 1) {
          subChildren.push({
            type: "linebreak",
            version: 1,
          });
        }
      }
    }),
      (children = [
        {
          type: "paragraph",
          format: "",
          indent: 0,
          version: 1,
          direction: "ltr",
          children: subChildren,
        },
      ]);
  }

  return {
    root: {
      type: "root",
      format: "",
      indent: 0,
      version: 1,
      children,
      direction: "ltr",
    },
  };
};

type Props = {
  editorID: string;
  addEditor: (editorState: InitialEditorStateType) => void;
};

const SplitEditorPlugin = ({ editorID, addEditor }: Props) => {
  const [editor] = useLexicalComposerContext();

  const { editorContent, clearEditorContent } = useEditorMergeContent();

  const [textContent, setTextContent] = useState<string | null>(null);

  const editorContentIDs = Object.keys(editorContent);
  useEffect(() => {
    const currentEditorContent = editorContent[editorID];

    if (currentEditorContent) {
      if (currentEditorContent.additionalEditorState) {
        const currentEditorState = editor.getEditorState().toJSON();
        const additionalEditorState = editorContent.additionalEditorState;

        const newChildren = [
          // @ts-ignore children are there
          ...currentEditorState.root.children[0].children,
          { type: "linebreak", version: 1 },
          { type: "linebreak", version: 1 },
          // @ts-ignore children are there
          ...additionalEditorState.root.children[0].children,
        ];

        const combinedEditorState = {
          ...currentEditorState,
          root: {
            ...currentEditorState.root,
            children: [
              {
                ...currentEditorState.root.children[0],
                children: newChildren,
              },
            ],
          },
        };

        editor.setEditorState(
          editor.parseEditorState(JSON.stringify(combinedEditorState)),
        );
        editor.focus(() => {}, { defaultSelection: "rootEnd" });
      } else if (
        currentEditorContent.editorState &&
        Object.keys(currentEditorContent.editorState).length > 0
      ) {
        editor.setEditorState(
          editor.parseEditorState(
            JSON.stringify(currentEditorContent.editorState),
          ),
        );
      }
      clearEditorContent(editorID);
    }
  }, [editorContentIDs]);

  useAutosave({
    data: textContent,
    onSave: (data) => {
      if (data) {
        const splits = data.split("\n\n\n\n\n");
        let newTextContent = "";
        let nextTextContent = null;
        if (splits.length === 1) {
          return;
        } else if (splits.length === 2) {
          newTextContent = splits[0]!.trimEnd();
          nextTextContent = splits[1]!.trimEnd();
        } else {
          newTextContent = splits[0]!.trimEnd();
          nextTextContent = splits.slice(1).join("\n\n").trimEnd();
        }

        if (nextTextContent != null) {
          const newEditorState =
            newTextContent.length === 0
              ? initialPlainTextEditorState
              : formatTextAsLexicalContent(newTextContent, "simple");

          const nextEditorState = formatTextAsLexicalContent(
            nextTextContent,
            "simple",
          );

          editor.setEditorState(
            editor.parseEditorState(JSON.stringify(newEditorState)),
          );

          //@ts-expect-error
          addEditor(nextEditorState);
          setTextContent(null);
        } else if (data.endsWith("\n\n\n")) {
          const newTextContent = data.trimEnd();
          const newEditorState =
            data.length === 0
              ? initialPlainTextEditorState
              : formatTextAsLexicalContent(newTextContent, "simple");

          editor.setEditorState(
            editor.parseEditorState(JSON.stringify(newEditorState)),
          );

          addEditor(null);
          setTextContent(null);
        }
      }
    },
    interval: 150,
  });

  useEffect(() => {
    editor.registerUpdateListener(({ editorState }) => {
      const currentTextContent = editorState.read(() =>
        $getRoot().getTextContent(),
      );

      if (
        currentTextContent.includes("\n\n\n\n\n") ||
        currentTextContent.includes("\n\n\n")
      ) {
        setTextContent(currentTextContent);
      }
    });
  }, [editor]);

  return null;
};

export default SplitEditorPlugin;
