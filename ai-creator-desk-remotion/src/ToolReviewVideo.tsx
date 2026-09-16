import React from "react";
import {
  AbsoluteFill,
  Sequence,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  Easing,
} from "remotion";

// ---------- Types ----------
export type ToolCard = {
  name: string;
  tagline: string;
  rating: number; // 0-5
  bestFor: string;
  accentColor: string;
};

export type ToolReviewVideoProps = {
  channelName: string;
  episodeTitle: string;
  tools: ToolCard[];
};

// ---------- Example data (swap per video) ----------
export const TOOLS_EXAMPLE: ToolCard[] = [
  {
    name: "Runway ML",
    tagline: "AI video generation & editing",
    rating: 4.5,
    bestFor: "B-roll and generative video clips",
    accentColor: "#7C3AED",
  },
  {
    name: "ElevenLabs",
    tagline: "Realistic AI voiceovers",
    rating: 5,
    bestFor: "Faceless channel narration",
    accentColor: "#F97316",
  },
  {
    name: "Descript",
    tagline: "Edit video like a text doc",
    rating: 4,
    bestFor: "Fast rough cuts & filler-word removal",
    accentColor: "#22C55E",
  },
];

const BG_DARK = "#0B0F19";
const TEXT_LIGHT = "#F5F7FA";
const FPS = 30;
const INTRO_FRAMES = 90;
const OUTRO_FRAMES = 120;
const PER_TOOL_FRAMES = 150;

// ---------- Reusable: animated gradient background ----------
const AnimatedBackground: React.FC<{ accent?: string }> = ({
  accent = "#7C3AED",
}) => {
  const frame = useCurrentFrame();
  const shift = interpolate(frame, [0, 300], [0, 40], {
    extrapolateRight: "extend",
  });
  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(circle at ${50 + Math.sin(shift / 20) * 15}% ${
          50 + Math.cos(shift / 25) * 15
        }%, ${accent}22 0%, ${BG_DARK} 60%)`,
      }}
    />
  );
};

// ---------- Intro ----------
const Intro: React.FC<{ channelName: string; episodeTitle: string }> = ({
  channelName,
  episodeTitle,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const logoScale = spring({ frame, fps, config: { damping: 12 } });
  const titleOpacity = interpolate(frame, [15, 35], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const titleY = interpolate(frame, [15, 35], [30, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  const subOpacity = interpolate(frame, [35, 55], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
      <AnimatedBackground accent="#7C3AED" />
      <div
        style={{
          transform: `scale(${logoScale})`,
          fontSize: 56,
          fontWeight: 800,
          color: TEXT_LIGHT,
          letterSpacing: 2,
          fontFamily: "Inter, Arial, sans-serif",
        }}
      >
        {channelName}
      </div>
      <div
        style={{
          opacity: titleOpacity,
          transform: `translateY(${titleY}px)`,
          fontSize: 34,
          color: "#A78BFA",
          marginTop: 24,
          fontFamily: "Inter, Arial, sans-serif",
          textAlign: "center",
          maxWidth: 1200,
        }}
      >
        {episodeTitle}
      </div>
      <div
        style={{
          opacity: subOpacity,
          marginTop: 40,
          fontSize: 20,
          color: "#8B93A7",
          fontFamily: "Inter, Arial, sans-serif",
        }}
      >
        Let's dive in
      </div>
    </AbsoluteFill>
  );
};

// ---------- Star rating ----------
const Stars: React.FC<{ rating: number; delay: number }> = ({
  rating,
  delay,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <div style={{ display: "flex", gap: 6 }}>
      {Array.from({ length: 5 }).map((_, i) => {
        const filled = i < Math.floor(rating);
        const half = !filled && i < rating;
        const pop = spring({
          frame: frame - delay - i * 3,
          fps,
          config: { damping: 10 },
        });
        return (
          <span
            key={i}
            style={{
              display: "inline-block",
              transform: `scale(${pop})`,
              fontSize: 28,
              color: filled || half ? "#FACC15" : "#3A3F4B",
            }}
          >
            ★
          </span>
        );
      })}
    </div>
  );
};

// ---------- Tool card ----------
const ToolCardScene: React.FC<{ tool: ToolCard; index: number }> = ({
  tool,
  index,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const cardIn = spring({ frame, fps, config: { damping: 14 } });
  const cardX = interpolate(cardIn, [0, 1], [200, 0]);
  const cardOpacity = interpolate(frame, [0, 15], [0, 1], {
    extrapolateRight: "clamp",
  });

  const exitStart = PER_TOOL_FRAMES - 20;
  const exitOpacity = interpolate(
    frame,
    [exitStart, PER_TOOL_FRAMES],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  const badgeScale = spring({
    frame: frame - 10,
    fps,
    config: { damping: 10 },
  });

  return (
    <AbsoluteFill
      style={{
        justifyContent: "center",
        alignItems: "center",
        opacity: exitOpacity,
      }}
    >
      <AnimatedBackground accent={tool.accentColor} />

      <div
        style={{
          transform: `translateX(${cardX}px)`,
          opacity: cardOpacity,
          background: "rgba(20, 24, 36, 0.85)",
          border: `2px solid ${tool.accentColor}`,
          borderRadius: 24,
          padding: "48px 64px",
          width: 1100,
          boxShadow: `0 0 60px ${tool.accentColor}33`,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div
            style={{
              fontSize: 22,
              color: tool.accentColor,
              fontWeight: 700,
              fontFamily: "Inter, Arial, sans-serif",
              letterSpacing: 1,
            }}
          >
            TOOL #{index + 1}
          </div>
          <div
            style={{
              transform: `scale(${badgeScale})`,
              background: tool.accentColor,
              color: "#0B0F19",
              fontWeight: 800,
              fontSize: 18,
              padding: "6px 16px",
              borderRadius: 999,
              fontFamily: "Inter, Arial, sans-serif",
            }}
          >
            {tool.rating.toFixed(1)} / 5
          </div>
        </div>

        <div
          style={{
            fontSize: 64,
            fontWeight: 800,
            color: TEXT_LIGHT,
            marginTop: 20,
            fontFamily: "Inter, Arial, sans-serif",
          }}
        >
          {tool.name}
        </div>
        <div
          style={{
            fontSize: 28,
            color: "#C4C9D4",
            marginTop: 12,
            fontFamily: "Inter, Arial, sans-serif",
          }}
        >
          {tool.tagline}
        </div>

        <div style={{ marginTop: 28 }}>
          <Stars rating={tool.rating} delay={20} />
        </div>

        <div
          style={{
            marginTop: 32,
            fontSize: 22,
            color: "#8B93A7",
            fontFamily: "Inter, Arial, sans-serif",
          }}
        >
          Best for: <span style={{ color: TEXT_LIGHT }}>{tool.bestFor}</span>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ---------- Outro ----------
const Outro: React.FC<{ channelName: string }> = ({ channelName }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const pop = spring({ frame, fps, config: { damping: 12 } });
  const pulse = 1 + Math.sin(frame / 8) * 0.03;

  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
      <AnimatedBackground accent="#F97316" />
      <div
        style={{
          transform: `scale(${pop * pulse})`,
          fontSize: 48,
          fontWeight: 800,
          color: TEXT_LIGHT,
          fontFamily: "Inter, Arial, sans-serif",
        }}
      >
        Subscribe to {channelName}
      </div>
      <div
        style={{
          marginTop: 20,
          fontSize: 24,
          color: "#A78BFA",
          fontFamily: "Inter, Arial, sans-serif",
        }}
      >
        New AI tool breakdowns every week
      </div>
    </AbsoluteFill>
  );
};

// ---------- Master composition ----------
export const ToolReviewVideo: React.FC<ToolReviewVideoProps> = ({
  channelName,
  episodeTitle,
  tools,
}) => {
  return (
    <AbsoluteFill style={{ backgroundColor: BG_DARK }}>
      <Sequence durationInFrames={INTRO_FRAMES}>
        <Intro channelName={channelName} episodeTitle={episodeTitle} />
      </Sequence>

      {tools.map((tool, i) => (
        <Sequence
          key={tool.name}
          from={INTRO_FRAMES + i * PER_TOOL_FRAMES}
          durationInFrames={PER_TOOL_FRAMES}
        >
          <ToolCardScene tool={tool} index={i} />
        </Sequence>
      ))}

      <Sequence
        from={INTRO_FRAMES + tools.length * PER_TOOL_FRAMES}
        durationInFrames={OUTRO_FRAMES}
      >
        <Outro channelName={channelName} />
      </Sequence>
    </AbsoluteFill>
  );
};
