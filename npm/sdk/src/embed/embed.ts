import { TransframeConsumer } from "@trufflehq/transframe";
import { EmbedSourceApi, getEmbedConsumer } from "../transframe/embed-consumer";
import { EnvironmentInfo, PageInfo } from "../types/embed";

type Styles = Record<string, unknown>;

export class Embed {
  private _currentStyles: Styles = {};
  private _embedConsumer: TransframeConsumer<EmbedSourceApi>;

  constructor() {
    this._embedConsumer = getEmbedConsumer();
  }

  private _setIframeStyles(styles: Styles) {
    this._embedConsumer.call("embedSetStyles", styles);
    this._currentStyles = styles;
  }

  /**
   * Set styles on the embed
   * @param newStyles styles to add
   */
  public setStyles(newStyles: Styles) {
    this._currentStyles = {
      ...this._currentStyles,
      ...newStyles,
    };

    this._setIframeStyles(this._currentStyles);
  }

  /**
   * Set the size of the embed
   * @param width css width
   * @param height css height
   */
  public setSize(width: string, height: string) {
    this.setStyles({
      width,
      height,
    });
  }

  /**
   * Sets the position of the embed
   * @param x distance from left (css value)
   * @param y distance from top (css value)
   */
  public setPosition(x: string, y: string) {
    this.setStyles({
      left: x,
      top: y,
    });
  }

  /**
   * Set the visibility of the embed
   */
  public setVisibility(isVisible: boolean) {
    this.setStyles({
      display: isVisible ? "block" : "none",
    });
  }

  /**
   * Set the embed container
   */
  public setContainer(
    querySelector: string,
    insertionMethod?: "append" | "prepend",
  ) {
    this._embedConsumer.call(
      "embedSetContainer",
      querySelector,
      insertionMethod,
    );
  }

  /**
   * Hide the embed
   */
  public hide() {
    this.setVisibility(false);
  }

  /**
   * Show the embed
   */
  public show() {
    this.setVisibility(true);
  }

  /**
   * Set the visibility of the window.
   */
  public setWindowVisibility(isVisible: boolean) {
    this._embedConsumer.call("embedWindowSetVisibility", isVisible);
  }

  /**
   * Get the visibility state of the window.
   */
  public async getWindowVisibility() {
    return await this._embedConsumer.call("embedWindowGetVisibility");
  }

  /**
   * Open the window.
   */
  public openWindow() {
    this.setWindowVisibility(true);
  }

  /**
   * Close the window.
   */
  public closeWindow() {
    this.setWindowVisibility(false);
  }

  /**
   * Shows a toast message.
   */
  public showToast(options: {
    body: string;
    title?: string;
    iconUrl?: string;
    onClick?: () => void;
  }) {
    return this._embedConsumer.call(
      "embedShowToast",
      {
        body: options.body,
        title: options.title,
        iconUrl: options.iconUrl,
      },
      // transframe callbacks only work if they're passed as top level arguments to a function
      options.onClick,
    );
  }

  public getPageInfo(onChange?: (pageInfo: PageInfo) => void) {
    return this._embedConsumer.call("pageInfoGet", onChange) as Promise<PageInfo>;
  }

  public getEnvironmentInfo(onChange?: (environmentInfo: EnvironmentInfo) => void) {
    return this._embedConsumer.call("environmentInfoGet", onChange) as Promise<EnvironmentInfo>;
  }
}
