import { Main } from "./main.class";
import { HTMLNode } from "./html-node.class";

export abstract class BaseComponent {

	protected abstract selector: string;
	protected abstract init(): void;
	protected destroy(): void {};
	protected main: Main;
	protected el: HTMLNode;
	protected deepSync: boolean = false;

	private check(): void {
		const candidate: HTMLNode = new HTMLNode( this.selector );
		const mustDestroy: boolean = ( !!this.el && this.deepSync )
			|| ( !!this.el && this.el.nativeArray.filter( li => candidate.nativeArray.indexOf( li ) < 0 ).length > 0 );
		const mustStart: boolean = ( !this.el || mustDestroy ) && candidate.length > 0;
		if ( mustDestroy ) this.destroy();
		if ( mustStart ) this.start( candidate );
	}

	private start( candidate: HTMLNode ): void {
		this.el = candidate;
		this.init();
	}

	constructor( main: Main ) {
		this.main = main;
		this.main.on( "content-init", () => this.check() );
	}
}
