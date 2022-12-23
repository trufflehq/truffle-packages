import { getSrcByImageObj, React, useStyleSheet } from "../../../../deps.ts";
import { File } from "../../../../types/mod.ts";
import styleSheet from "./default-dialog-content-fragment.scss.js";

const IMAGE_WIDTH_PX = 72;

export default function DefaultDialogContentFragment({
  imageRel,
  imageUrl,
  primaryText,
  secondaryText,
}: {
  imageRel?: File;
  imageUrl?: string;
  primaryText?: React.ReactNode | string;
  secondaryText?: string;
}) {
  useStyleSheet(styleSheet);
  return (
    <div className="c-default-dialog-content-fragment">
      <div className="image">
        {imageUrl && <img src={imageUrl} width={IMAGE_WIDTH_PX} />}
        {imageRel && (
          <img src={getSrcByImageObj(imageRel)} width={IMAGE_WIDTH_PX} />
        )}
      </div>
      <div className="primary-text mm-text-subtitle-1">{primaryText}</div>
      <div className="secondary-text mm-text-body-2">{secondaryText}</div>
    </div>
  );
}
