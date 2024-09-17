import { FloatingComposer, FloatingThreads } from "@liveblocks/react-lexical";
import { useThreads } from "@liveblocks/react/suspense";

const ThreadOverlay = () => {
  const { threads } = useThreads({ query: { resolved: false } });

  return (
    <>
      <FloatingComposer className="w-[350px]" />
      <FloatingThreads threads={threads} className="z-20 w-[350px]" />
      {/* <AnchoredThreads
        threads={threads}
        className="w-[350px] hidden sm:block"
      /> */}
    </>
  );
};

export default ThreadOverlay;
