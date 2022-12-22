import { ImageByAspectRatio, Observable, React, useSelector, useStyleSheet } from "../../deps.ts";
import Dialog from "../base/dialog/dialog.tsx";
import Button from "../base/button/button.tsx";
import { useDialog } from "../base/dialog-container/dialog-service.ts";
import styleSheet from "./delete-dialog.scss.js";

const TRASH_ICON_URL = "https://cdn.bio/assets/images/features/browser_extension/trash-red.svg";

export default function DeleteDialog(
  props: { title: string; onDelete: () => void; error$?: Observable<string> },
) {
  useStyleSheet(styleSheet);
  const { popDialog } = useDialog();

  const onCancel = () => {
    popDialog();
  };
  const error = useSelector(() => props.error$?.get());
  return (
    <div className="c-delete-dialog">
      <Dialog>
        <div className="body">
          <div className="icon">
            <ImageByAspectRatio
              imageUrl={TRASH_ICON_URL}
              aspectRatio={1}
              width={56}
              height={56}
            />
            <div className="title">
              {props.title}
            </div>
          </div>
          {error && <div className="error">{error}</div>}
          <div className="footer">
            <Button style="bg-tertiary" className="cancel" onClick={onCancel}>
              Cancel
            </Button>
            <Button style="primary" className="delete" onClick={props.onDelete} shouldHandleLoading>
              Yes, delete
            </Button>
          </div>
        </div>
      </Dialog>
    </div>
  );
}
