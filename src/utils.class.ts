export interface AnimateParams {
	timing?: Function;
	draw?: Function;
	duration?: number;
	element?: HTMLElement;
	loop?: boolean;
	start?: number;
	before?: Function;
	complete?: Function;
}

export class Utils {

	public static addClass( el: HTMLElement, value: string ): void {
		!this.hasClass( el, value ) && el.classList.add( value );
	}

	public static removeClass( el: HTMLElement, value: string ): void {
		this.hasClass( el, value ) && ( el.classList.remove( value ) );
	}

	public static hasClass( el: HTMLElement, value: string ): boolean {
		return el.classList.contains( value );
	}

	public static toggleClass( el: HTMLElement, value: string ): void {
		this.hasClass( el, value ) ? this.removeClass( el, value ) : this.addClass( el, value );
	}

	private static requestAnimFrame( callback: Function ) {
		return window.requestAnimationFrame( callback as FrameRequestCallback )
			|| ( window as any ).mozRequestAnimationFrame( callback as FrameRequestCallback )
			|| ( window as any ).webkitRequestAnimationFrame( callback as FrameRequestCallback )
			|| window.setTimeout( callback, 16 );
	}

	public static animate( p: AnimateParams ): Function {
		const defaults: AnimateParams = {
			timing: ( t: number ) => t,
			draw: () => {},
			duration: 300,
			element: document.body,
			loop: false,
			start: performance.now(),
			before: () => {},
			complete: () => {},
		};

		const params: AnimateParams = { ...defaults, ...p };

		const animation_start = () =>
			params.element.setAttribute( 'data-frame', this.requestAnimFrame( animation_loop ) );

		const animation_stop = () =>
			window.cancelAnimationFrame( parseInt( params.element.getAttribute( 'data-frame' ) ) );

		const animation_loop = ( time: number ) => {
			let timeFraction: number = ( time - params.start ) / params.duration;

			if ( timeFraction > 1 ) {
				timeFraction = 1;
			}

			const progress = params.timing( timeFraction );

			params.draw( progress );

			if ( timeFraction < 1 ) {
				animation_start();
			} else {
				animation_stop();
				if ( params.loop ) {
					params.start = performance.now();
					animation_start();
				} else {
					params.complete();
				}
			}
		}

		params.before();

		animation_start();

		return animation_stop;
	}

	public static easeInOutQuad( time: number ): number {
		return time < 0.5
			? 2 * time * time
			: -1 + ( 4 - 2 * time ) * time;
	}

	public static easeOutQuad( time: number ): number {
		return time * ( 2 - time );
	}

	public static easeOutCubic( time: number ) {
		return (--time ) * time * time + 1;
	}

	public static linear( time: number ): number {
		return time;
	}

	public static serialize( obj: any ): string {
		return Object.keys( obj )
		.reduce(
			( a: any, k: any ) => {
				a.push( k + '=' + encodeURIComponent( obj[k] ) );
				return a;
			}, [] )
		.join( '&' );
	}

	public static stringToSlug( str: string ): string {

		str = str.replace( /^\s+|\s+$/g, "" );
		str = str.toLowerCase();

		const from: string = "àáäâèéëêìíïîòóöôùúüûñç·/_,:;";
		const to: string =	 "aaaaeeeeiiiioooouuuunc------";

		for ( let i = 0, len = from.length; i < len; i++ ) {
			str = str.replace( new RegExp( from.charAt( i ), 'g' ), to.charAt( i ) );
		}

		str = str
			.replace( /[^a-z0-9 -]/g, "" )
			.replace( /\s+/g, '-' )
			.replace( /-+/g, '-' );

		return str;

	}

	public static urlencode( element: any, key?: string, list?: any[] ): string {
		list = list || [];
		if ( typeof( element ) == "object" )
			for ( let idx in element )
				this.urlencode( element[idx], key ? key + '[' + idx + ']' : idx, list );
		else list.push( key + '=' + ( encodeURIComponent( element ) ) );
		return list.join( '&' ).split( "%20" ).join( "+" );
	}

	public static formatMoney( val: number, decPlaces: number, decSep: string, thouSep: string ): string {

		decPlaces = isNaN( Math.abs( decPlaces ) ) ? 2 : Math.abs( decPlaces );
		decSep = typeof decSep === "undefined" ? "." : decSep;
		thouSep = typeof thouSep === "undefined" ? "," : thouSep;

		const sign: string = val < 0 ? "-" : "";
		const i: string = Math.abs( val || 0 ).toFixed( decPlaces );
		const j: number = i.length > 3 ? i.length % 3 : 0;

		return sign + ( j ? i.substr( 0, j ) + thouSep : "" ) +
					 i.substr( j ).replace( /(\decSep{3})(?=\decSep)/g, "$1" + thouSep ) +
					 ( decPlaces ? decSep + Math.abs( val - parseFloat( i ) ).toFixed( decPlaces ).slice( 2 ) : "" );

	}

	public static setCookie( name: string, value:string, days: number = 7, path: string= "/" ): void {
		const date: Date = new Date();
		date.setTime( date.getTime() + ( days * 24 * 60 * 60 * 1000 ) );
		document.cookie = `${ name }=${ value }; expires=${ date.toUTCString() }; path=${ path };`;
	}

	public static readCookie( name: string ): string {
		const cookieName = `${ name }=`;
		const tokens: string[] = document.cookie.split( ";" );

		for ( let i: number = 0; i < tokens.length; i++ ) {
			let token: string = tokens[i];

			while ( token.charAt( 0 ) == " " )
				token = token.substr( 1, token.length );

			if ( token.indexOf( cookieName ) == 0 )
				return token.substr( cookieName.length, token.length );
		}

		return "";
	}

	public static eraseCookie( name: string, path: string = "/" ): void {
		document.cookie = `${ name }=; expires=Thu, 01 Jan 1970 00:00:01 GMT; path=${ path }`;
	}

}
