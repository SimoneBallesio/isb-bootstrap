import { Main } from "./main.class";
import { HTMLNode } from "./html-node.class";

export abstract class BaseComponent {

  protected abstract selector: string;
  protected abstract init(): void;
  protected destroy(): void {};
  protected el: HTMLNode;
  protected deepSync: boolean = false;

  private check(): void {
    const candidate: HTMLNode = new HTMLNode( this.selector );
    const mustDestroy: boolean = ( !!this.el && this.deepSync )
      || ( !!this.el && this.el.nativeElement !== candidate.nativeElement );
    const mustStart: boolean = ( !this.el || mustDestroy ) && candidate.length > 0;
    if ( mustDestroy ) this.destroy();
    if ( mustStart ) this.start( candidate );
  }

  private start( candidate: HTMLNode ): void {
    this.el = candidate;
    this.init();
  }

  constructor( protected main: Main ) {
    this.main.on( "content-init", () => this.check() );
  }
}
