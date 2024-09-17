"use client";

import { InitialEditorStateType } from "@lexical/react/LexicalComposer";
import Link from "next/link";
import { useState } from "react";
import Editor from "~/components/Editor";

export default function HomePage() {
  const [content, setContent] = useState<
    {
      id: string;
      editorState: InitialEditorStateType;
    }[]
  >([
    {
      id: Math.random().toString(),
      editorState: null,
    },
  ]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-black text-white">
      <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16">
        <h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-[5rem]">
          Liveblocks Bug Demo
        </h1>
        {content.map(({ id, editorState }) => (
          <Editor
            key={id}
            id={id}
            editorState={editorState}
            addEditor={(editorState) => {
              setContent((prev) => {
                const currentIndex = prev.findIndex((item) => item.id === id);
                const newContent = [...prev];
                newContent.splice(currentIndex + 1, 0, {
                  id: Math.random().toString(),
                  editorState,
                });
                return newContent;
              });
            }}
          />
        ))}
      </div>
    </main>
  );
}
