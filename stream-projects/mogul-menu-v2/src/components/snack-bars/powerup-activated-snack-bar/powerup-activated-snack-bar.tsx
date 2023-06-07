import { getSrcByImageObj, ImageByAspectRatio, React } from "../../../deps.ts";
import AccountAvatar from "../../account-avatar/account-avatar.tsx";
import { ActivePowerupRedeemData, Collectible } from "../../../types/mod.ts";
import { SnackBar } from "../../snackbar/mod.ts";

export function PowerupActivatedSnackBar(
  { collectible }: { collectible?: Collectible<ActivePowerupRedeemData> },
) {
  const powerupSrc = getSrcByImageObj(collectible?.fileRel?.fileObj);

  return (
    <SnackBar
      message={collectible?.name ? `${collectible?.name} activated!` : ""}
      style="flat"
      value={
        <>
          <AccountAvatar />
          <ImageByAspectRatio
            imageUrl={powerupSrc}
            aspectRatio={collectible?.fileRel?.fileObj?.data?.aspectRatio ?? 1}
            widthPx={24}
            height={24}
          />
        </>
      }
    />
  );
}
