import {Component} from 'angular2/core';

//import {About} from './../about/about';

/*
 * We're loading this component asynchronously
 * We are using some magic with es6-promise-loader that will wrap the module with a Promise
 * see https://github.com/gdi2290/es6-promise-loader for more info
 */

@Component({
  selector: 'destination',
  //directives: [Clicks],
  template: `
  `,
  inputs: ['square'],
  styles: [`
    :host {
      position: absolute;
      width: 40%;
      height: 40%;
      background: #fff;
      border-radius: 50%;
      display: block;
      cursor: pointer;
      top: 30%;
      left: 30%;
    }
  `]
})

export class Destination {
  constructor() {
  }

  ngOnInit() {
  }

  onSelectSoldier() {
    //console.log("selected!");
  }

}
