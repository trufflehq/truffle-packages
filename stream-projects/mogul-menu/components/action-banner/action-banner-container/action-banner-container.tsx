import { React } from "../../../deps.ts";
import { useActionBanner } from '../mod.ts'

export default function ActionBannerContainer() {
  const { actionBannerMap } = useActionBanner();

  return (
    <div className="c-action-banner-container">
      {Object.entries(actionBannerMap).map(([id, { Component }]) => (
        <div key={id} className="action-banner-container">
          {Component}
        </div>
      ))}
    </div>
  );
}
