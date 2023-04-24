import { TransframeConsumer } from '@trufflehq/transframe';
import { EmbedSourceApi, getEmbedConsumer } from '../transframe/embed-consumer';

type Styles = Record<string, unknown>;

export class Embed {
  private _currentStyles: Styles = {};
  private _embedConsumer: TransframeConsumer<EmbedSourceApi>;

  constructor() {
    this._embedConsumer = getEmbedConsumer();
  }

  private _setIframeStyles(styles: Styles) {
    this._embedConsumer.call('embedSetStyles', styles);
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
      display: isVisible ? 'block' : 'none',
    });
  }

  /**
   * Set the embed container
   */
  public setContainer(
    querySelector: string,
    insertionMethod?: 'append' | 'prepend'
  ) {
    this._embedConsumer.call(
      'embedSetContainer',
      querySelector,
      insertionMethod
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
}
