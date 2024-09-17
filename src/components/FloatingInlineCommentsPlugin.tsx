import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { OPEN_FLOATING_COMPOSER_COMMAND } from "@liveblocks/react-lexical";

const FloatingInlineCommentsPlugin = () => {
  const [editor] = useLexicalComposerContext();

  return (
    <button
      onClick={() => {
        editor.dispatchCommand(OPEN_FLOATING_COMPOSER_COMMAND, undefined);
      }}
    >
      💬 New comment
    </button>
  );
};

export default FloatingInlineCommentsPlugin;
