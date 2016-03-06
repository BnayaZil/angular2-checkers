import {Component, Output, EventEmitter} from 'angular2/core';
import * as _ from 'lodash';
import {Field} from './../field/field';

/*
 * We're loading this component asynchronously
 * We are using some magic with es6-promise-loader that will wrap the module with a Promise
 * see https://github.com/gdi2290/es6-promise-loader for more info
 */

@Component({
  selector: 'board',
  directives: [Field],
  template: `
    <field *ngFor="#field of boardFields; #i=index" [square]="i+1" [fieldData]="field" (soldierChoosing)="onSoldierChoosing($event)" (destinationChoosing)="onDestinationChoosing($event)"></field>
  `,
  styles: [`
    :host {
      width: 500px;
      float: left;
      height: 500px;
    }
  `]
})
export class Board {
  boardFields = new Array(64);
  destination: any;
  soldierChoosing: any;
  destinationChoosing: any;

  constructor() {
    let square;
    for(let i = 0; i < 64; i++) {
      square = i + 1;
      if(square <= 8 && square % 2 == 0 || square <= 16 && (square + 1) % 2 == 0 && square > 8) {
        this.boardFields[i] = {soldier: true, destination: false};
      } else {
        this.boardFields[i] = {soldier: false, destination: false};
      }
    }
  }

  ngOnInit() {
    console.log('In Board route');
  }

  onSoldierChoosing(e) {
    this.clearDestination(this.destinationChoosing);
    this.soldierChoosing = e;
    this.destinationChoosing = [];
    let move = this.moveOption(e.position[0], e.position[1]);
    let index = this.getIndexFromMove(move);
    _.forEach(index, (value, key) => {
      if(value !== 'undefiend'){
        this.boardFields[value].destination = true;
        this.destinationChoosing.push(value);
      }
    })
  }

  onDestinationChoosing(e) {
    console.log('onDestinationChoosing', e);
    this.clearDestination(this.destinationChoosing);
    this.moveSoldier(this.soldierChoosing, e);
  }

  moveSoldier(soldier, destination) {
    console.log(soldier);
    console.log(destination);
    this.boardFields[soldier.id - 1].soldier = false;
    this.boardFields[destination.id - 1].soldier = true;
  }

  clearDestination(destinationArray) {
    _.forEach(destinationArray, (value, key)=> {
      console.log(key);
      this.boardFields[value].destination = false;
      this.destinationChoosing = [];
    });
  }

  getIndexFromMove(move) {
    let object = {};
    if(typeof move.right !== 'undefined') {
      let indexRight;
      indexRight = ((move.right[0] - 1) * 8);
      indexRight += move.right[1];
      indexRight -= 1;
      object.right = indexRight;
    }
    if(typeof move.left !== 'undefined') {
      let indexLeft;
      indexLeft = ((move.left[0] - 1) * 8);
      indexLeft += move.left[1];
      indexLeft -= 1;
      object.left = indexLeft;
    }
    return object;
  }

  moveOption(row, col) {
    this.destination = {};
    let destinationRow = row + 1;
    let destinationColLeft = col - 1;
    let destinationColRight = col + 1;
    if(col !== 1) {
      this.destination.left = [destinationRow, destinationColLeft];
    }
    if(col !== 8) {
      this.destination.right = [destinationRow, destinationColRight];
    }
    return this.destination;
  }

}
