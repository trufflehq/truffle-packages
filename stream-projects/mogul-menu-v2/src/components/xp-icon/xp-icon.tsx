import { ImageByAspectRatio, React } from "../../deps.ts";

export default function XPIcon({ size = 24 }: { size?: number }) {
  const xpSrc =
    "https://cdn.bio/assets/images/features/browser_extension/xp.svg";
  return (
    <ImageByAspectRatio
      imageUrl={xpSrc}
      aspectRatio={1}
      width={size}
      height={size}
    />
  );
}
