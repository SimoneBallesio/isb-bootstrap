export class HTMLNode {

  private el: HTMLElement[];

  public get length(): number {
    return this.el.length;
  }

  public get nativeElement(): HTMLElement[] | HTMLElement {
    if ( this.el.length === 1 ) return this.el[0];
    return this.el;
  }

  public get nativeArray(): HTMLElement[] {
    return this.el;
  }

  public get classList(): DOMTokenList {
    if ( this.length === 1 ) return this.el[0].classList;
  }

  public get style(): CSSStyleDeclaration {
    if ( this.length === 1 ) return this.el[0].style;
  }

  public get dataset(): DOMStringMap {
    if ( this.length === 1 ) return this.el[0].dataset;
  }

  public querySelectorAll( selector: string ): HTMLElement[] {
    return this.el.map( el => [].slice.call( el.querySelectorAll( selector ) ) )
      .reduce( ( flat: any, next: any ) => flat.concat( next ), [] );
  }

  public querySelector( selector: string ): HTMLElement {
    return this.querySelectorAll( selector ).shift();
  }

  public map( callback: ( value: HTMLElement, index: number, array: HTMLElement[] ) => HTMLElement ): HTMLElement[] {
    return this.el.map( callback );
  }

  public filter( callback: ( value: HTMLElement, index: number, array: HTMLElement[] ) => any ): HTMLElement[] {
    return this.el.filter( callback );
  }

  public forEach( callback: ( value: HTMLElement, index: number, array: HTMLElement[] ) => void ): void {
    this.el.forEach( callback );
  }

  public findIndex( callback: ( value: HTMLElement, index: number, array: HTMLElement[] ) => number ): number {
    return this.el.findIndex( callback );
  }

  public setAttribute( attribute: string, value: string ): void {
    this.el.forEach( el => el.setAttribute( attribute, value ) );
  }

  public getAttribute( attribute: string ): string {
    return this.el[0].getAttribute( attribute );
  }

  public hasAttribute( attribute: string ): boolean {
    return this.el[0].hasAttribute( attribute );
  }

  constructor( private selector: string ) {
    this.el = [].slice.call( document.querySelectorAll( this.selector ) );
  }
}
