import { ImageByAspectRatio, React } from "../../deps.ts";

export default function ChannelPointsIcon(
  { size = 20, variant = "light" }: {
    size?: number;
    variant?: "light" | "dark";
  },
) {
  const channelPointsSrc = variant === "light"
    ? "https://cdn.bio/assets/images/features/browser_extension/channel-points-default.svg"
    : "https://cdn.bio/assets/images/features/browser_extension/channel-points-default-dark.svg";
  return (
    <ImageByAspectRatio
      imageUrl={channelPointsSrc}
      aspectRatio={1}
      width={size}
      height={size}
    />
  );
}
