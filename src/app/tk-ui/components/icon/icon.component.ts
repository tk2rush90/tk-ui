import {AfterViewInit, Component, ElementRef, HostBinding, Input, OnInit, Renderer2} from '@angular/core';
import {IconDefinitions} from '@tk-ui/components/icon/icon-defs';

@Component({
  selector: 'app-icon',
  templateUrl: './icon.component.html',
  styleUrls: ['./icon.component.scss']
})
export class IconComponent implements OnInit, AfterViewInit {
  /**
   * set icon name
   * @param name name
   */
  @Input() set name(name: keyof typeof IconDefinitions | undefined) {
    this._name = name;
    this._setIcon();
  }

  /**
   * bind name to attribute
   */
  @HostBinding('attr.tk-name') get bindName(): keyof typeof IconDefinitions | undefined {
    return this._name;
  }

  /**
   * name of icon
   */
  private _name: keyof typeof IconDefinitions | undefined;

  /**
   * svg element from `icon-defs.ts`
   */
  private _icon: SVGElement | undefined;

  constructor(
    private renderer: Renderer2,
    private elementRef: ElementRef<HTMLElement>,
  ) { }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    this._setIcon();
  }

  /**
   * set icon with name
   */
  private _setIcon(): void {
    this._removeExistingIcon();
    this._parseSvgIcon();
    this._appendSvgToView();
  }

  /**
   * remove existing icon from element
   */
  private _removeExistingIcon(): void {
    if (this._icon && this.elementRef?.nativeElement) {
      this.renderer.removeChild(this.elementRef.nativeElement, this._icon);
    }
  }

  /**
   * parse svg icon to element
   */
  private _parseSvgIcon(): void {
    if (this._name) {
      const domParser = new DOMParser();
      const html = domParser.parseFromString(IconDefinitions[this._name], 'text/html');

      this._icon = html.querySelector('svg') as SVGElement;
    }
  }

  /**
   * append svg icon to view
   */
  private _appendSvgToView(): void {
    if (this._icon && this.elementRef?.nativeElement) {
      this.renderer.appendChild(this.elementRef.nativeElement, this._icon);
    }
  }
}
