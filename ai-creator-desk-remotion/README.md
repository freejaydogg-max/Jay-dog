# AI Creator Desk — Remotion Tool Review Template

A reusable video template: animated intro → one card per AI tool (name,
tagline, star rating, "best for") → subscribe outro. Swap the `tools`
array in `src/Root.tsx` for each new episode instead of rebuilding the
animation.

## Run this with Claude Code

1. Open this folder in Claude Code (or point Claude Code at it):
   `claude` (from inside the project folder), or drag the folder in.
2. Ask Claude Code to:
   - `npm install`
   - `npm start` — opens Remotion Studio in the browser to preview/scrub
   - `npm run build` — renders `out/video.mp4`

## Customizing per video

Edit the `tools` array (in `src/Root.tsx` or pass your own props):

```ts
{
  name: "Tool Name",
  tagline: "One-line description",
  rating: 4.5,        // 0-5, supports .5 half-star look
  bestFor: "Use case",
  accentColor: "#7C3AED", // hex, drives glow + background tint
}
```

Timing constants (in both `Root.tsx` and `ToolReviewVideo.tsx` — keep
them in sync, or better, ask Claude Code to refactor them into one
shared `constants.ts`):
- `INTRO_FRAMES = 90` (3s @ 30fps)
- `PER_TOOL_FRAMES = 150` (5s per tool)
- `OUTRO_FRAMES = 120` (4s)

## Ideas to ask Claude Code to add next
- Swap in real logos/screenshots (`<Img src={staticFile(...)}>`)
- Add ElevenLabs-generated voiceover audio synced to each scene
- Add lower-third captions synced to a script/transcript
- Export vertical (1080x1920) version for Shorts by duplicating the
  Composition with different width/height
- Batch-render multiple episodes by looping `remotion render` over a
  JSON file of tool lists
