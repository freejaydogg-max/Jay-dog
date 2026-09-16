import { Composition } from "remotion";
import { ToolReviewVideo, TOOLS_EXAMPLE } from "./ToolReviewVideo";

const FPS = 30;
const INTRO_FRAMES = 90; // 3s
const OUTRO_FRAMES = 120; // 4s
const PER_TOOL_FRAMES = 150; // 5s each

export const RemotionRoot: React.FC = () => {
  const totalFrames =
    INTRO_FRAMES + TOOLS_EXAMPLE.length * PER_TOOL_FRAMES + OUTRO_FRAMES;

  return (
    <>
      <Composition
        id="ToolReviewVideo"
        component={ToolReviewVideo}
        durationInFrames={totalFrames}
        fps={FPS}
        width={1920}
        height={1080}
        defaultProps={{
          channelName: "AI Creator Desk",
          episodeTitle: "5 AI Tools Every Creator Needs This Month",
          tools: TOOLS_EXAMPLE,
        }}
      />
    </>
  );
};
