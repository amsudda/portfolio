import { Figure } from "@/components/ui/media";
import type { PublicAsset } from "@/lib/queries";

export function assetLabel(a: Pick<PublicAsset, "label" | "kind" | "ratio">): string {
  const kind = a.label?.trim() || (a.kind === "video_frame" ? "Video frame" : "Photo");
  return `${kind.toUpperCase()} — ${a.ratio}`;
}

export function AssetFigure({ asset, sizes }: { asset: PublicAsset; sizes: string }) {
  const caption = [asset.clientLabel, asset.caption].filter(Boolean).join(" — ");
  return <Figure src={asset.url} ratio={asset.ratio} label={assetLabel(asset)} caption={caption} sizes={sizes} />;
}
