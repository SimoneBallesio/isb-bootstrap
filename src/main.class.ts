import { Observable, Subject, Subscription, fromEvent } from "rxjs";
import { map, take } from "rxjs/operators";

export class Main {

	private init$: Observable<boolean>;
	private emitters: { [key: string]: Subject<any> };

	public createEvent( ...args: string[] ): void {
		args.forEach( name => !this.emitters[name] && ( this.emitters[name] = new Subject<boolean>() ) );
	}

	public on( name: string, callback: Function ): Subscription[] {

		return name.split( " " ).map( label => {

			if ( !this.emitters[label] )
				this.createEvent( label );

			return this.emitters[label].subscribe( ( arg: any ) => callback( arg ) );

		} );

	}

	public trigger( evt: string, arg: any = true ): void {
		!!this.emitters[evt] && this.emitters[evt].next( arg );
	}

	constructor() {

		this.emitters = {};
		this.createEvent( "content-init" );

		this.init$ =
			fromEvent( window, "load" )
				.pipe( map( () => true ), take( 1 ) );

		this.init$.subscribe( () => this.trigger( "content-init" ) );

	}

}
