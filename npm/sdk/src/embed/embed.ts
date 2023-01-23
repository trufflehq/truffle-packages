import { jumper } from '../jumper/jumper-instance'

type Styles = Record<string, unknown>;

export class Embed {

  private _currentStyles: Styles = {};

  private _setIframeStyles(styles: Styles) {
    jumper.call("layout.applyLayoutConfigSteps", {
      layoutConfigSteps: [
        { action: "useSubject" }, // start with our iframe
        {
          action: "setStyle",
          value: styles,
        },
      ],
    });
  }

  private _resetIframStyles() {
    jumper.call("layout.applyLayoutConfigSteps", {
      layoutConfigSteps: [
        { action: "useSubject" }, // start with our iframe
        { action: "resetStyles" },
      ],
    });
  }

  /**
   * Set styles on the embed
   * @param newStyles styles to add
    */
  public setStyles(newStyles: Styles) {
    this._currentStyles = {
      ...this._currentStyles,
      ...newStyles,
    }

    this._setIframeStyles(this._currentStyles);
  }

  /**
   * Clear all styles on the embed
   */
  public resetStyles() {
    this._currentStyles = {};
    this._resetIframStyles();
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

}

export const embed = new Embed();