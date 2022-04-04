import { Main } from "./main.class";

export class Module {

  private _main: Main;
  private _classes: any[];

  public get bootstrap(): Main {
    return this._main;
  }

  public add( ...args: any[] ): void {
    this._classes = [
      ...this._classes,
      ...args.map( instance => new instance( this._main ) )
    ];
  }

  public getInstance( value: any ): any | boolean {
    return this._classes
      .filter( instance => instance instanceof value )
      .length > 0
      && this._classes
        .filter( instance => instance instanceof value )[0];
  }

  constructor() {
    this._main = new Main();
    this._classes = [];
  }

}
