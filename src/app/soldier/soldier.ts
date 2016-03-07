import {Component} from 'angular2/core';

//import {About} from './../about/about';

/*
 * We're loading this component asynchronously
 * We are using some magic with es6-promise-loader that will wrap the module with a Promise
 * see https://github.com/gdi2290/es6-promise-loader for more info
 */

@Component({
  selector: 'soldier',
  //directives: [Clicks],
  template: `
  `,
  inputs: ['square'],
  styles: [`
    :host {
      width: 80%;
      height: 80%;
      border-radius: 50%;
      display: block;
      cursor: pointer;
      position: absolute;
      top: 10%;
      left: 10%;
    }
    :host.black {
      background: #000;
    }
    :host.white {
      background: #fff;
    }
  `]
})

export class Soldier {
  constructor() {
  }

  ngOnInit() {
  }

  onSelectSoldier() {
    //console.log("selected!");
  }

}
