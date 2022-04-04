import { Main } from "./main.class";
import { Observable, fromEvent, of, merge } from "rxjs";
import { switchMap, pairwise, filter, map } from "rxjs/operators";

export interface ScrollDelta {
  delta: number;
}

export class StandardEvents {

  private onResize$: Observable<Event>;
  private beforeUnload$: Observable<Event>;
  private onScroll$: Observable<ScrollDelta>;

  constructor( private main: Main ) {

    this.main.createEvent( "resize", "resize-to-mobile", "resize-to-desktop", "before-unload", "scroll" );

    this.onResize$ = fromEvent( window, "resize" );
    this.beforeUnload$ = fromEvent( window, "beforeunload" );
    this.onResize$.subscribe( () => this.main.trigger( "resize" ) );
    this.beforeUnload$.subscribe( () => this.main.trigger( "before-unload" ) );

    this.onScroll$ = merge(
      fromEvent( document.scrollingElement, "wheel" )
        .pipe( map( ( e: WheelEvent ) => ( { delta: e.deltaY } ) ) ),
      fromEvent<TouchEvent>( document.scrollingElement, "touchmove" )
        .pipe( pairwise(), map( values => {
          const [evt1, evt2] = values;
          return { delta: -evt2.touches[0].clientY + evt1.touches[0].clientY }
        } ) ) );

    this.onScroll$.subscribe( e => this.main.trigger( "scroll", e ) );

    this.onResize$
      .pipe(
        switchMap( () => of( window.matchMedia( "( max-width: 767px )" ).matches ) ),
        pairwise(),
        filter( values => values[0] !== values[1] ) )
      .subscribe( () => this.main.trigger( "resize-to-mobile" ) );

    this.onResize$
      .pipe(
        switchMap( () => of( window.matchMedia( "( min-width: 768px )" ).matches ) ),
        pairwise(),
        filter( values => values[0] !== values[1] ) )
      .subscribe( () => this.main.trigger( "resize-to-desktop" ) );

  }
}
