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
  soldierEating = new Array();

  constructor() {
    let square;
    for(let i = 0; i < 64; i++) {
      square = i + 1;
      if(square <= 8 && square % 2 == 0 || square <= 16 && (square + 1) % 2 == 0 && square > 8 || square <= 24 && square % 2 == 0 && square > 16) {
        this.boardFields[i] = {soldier: true, destination: false, side: 'black'};
      } else if(square > 56 && (square + 1) % 2 == 0 || square > 48 && square % 2 == 0 && square <= 56 || square > 40 && (square + 1) % 2 == 0 && square <= 48) {
        this.boardFields[i] = {soldier: true, destination: false, side: 'white'};
      } else {
        this.boardFields[i] = {soldier: false, destination: false, side: false};
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
    console.log('e', e);
    let move = this.moveOption(e.position[0], e.position[1], e.fieldData.side);
    let index = this.getIndexFromMoveOptions(move);
    _.forEach(index, (value, key) => {
      if(value !== 'undefiend'){
        this.boardFields[value].destination = true;
        this.destinationChoosing.push(value);
      }
    })
  }

  onDestinationChoosing(e) {
    console.log('this.destinationChoosing', e.id);
    this.clearDestination(this.destinationChoosing);
    this.eatSoldier(e.id);
    this.moveSoldier(this.soldierChoosing, e);
  }

  eatSoldier(destinationIndex) {
    let index;
    if(this.soldierEating.length > 0) {
      console.log('this.soldierEating[destinationIndex]', this.soldierEating);
      index = this.getIndexFromCoordinates(this.soldierEating[destinationIndex - 1]);
      this.boardFields[index].soldier = false;
      this.boardFields[index].side = false;
      this.soldierEating = [];
    }
  }

  moveSoldier(soldier, destination) {
    console.log(soldier);
    console.log(destination);
    this.boardFields[destination.id - 1].soldier = true;
    this.boardFields[destination.id - 1].side = soldier.fieldData.side;
    this.boardFields[soldier.id - 1].soldier = false;
    this.boardFields[soldier.id - 1].side = false;

  }

  clearDestination(destinationArray) {
    _.forEach(destinationArray, (value, key)=> {
      console.log(key);
      this.boardFields[value].destination = false;
      this.destinationChoosing = [];
    });
  }

  getIndexFromMoveOptions(move) {
    let object = {};
    if(typeof move.right !== 'undefined') {
      object.right = this.getIndexFromCoordinates(move.right);
    }
    if(typeof move.left !== 'undefined') {
      object.left = this.getIndexFromCoordinates(move.left);
    }
    return object;
  }

  getIndexFromCoordinates(Coordinates) {
    let index;
    index = ((Coordinates[0] - 1) * 8);
    index += Coordinates[1];
    index -= 1;
    return index;
  }

  isFieldMoveAble(move) {
    let index = this.getIndexFromCoordinates(move);
    if(this.boardFields[index].side === false)
      return {success: false};
    let eatAble = this.canEatAble(move);
    if(eatAble.success)
      return {success: true, nextMove: eatAble.nextMove};
    else
      return {success: false, nextMove: eatAble.nextMove};
  }

  canEatAble(move) {
    let nextMove = [];
    if(this.soldierChoosing.position[1] > move[1])
      nextMove[1] = move[1] - 1;
    else
      nextMove[1] = move[1] + 1;
    if(this.soldierChoosing.position[0] > move[0])
      nextMove[0] = move[0] - 1;
    else
      nextMove[0] = move[0] + 1;

    let index = this.getIndexFromCoordinates(nextMove);
    if(this.boardFields[index].side === false)
        return {success: true, nextMove: nextMove}
    return {success: false, nextMove: nextMove};
  }

  moveOption(row, col, side) {
    this.destination = {};
    let destinationRow;
    let moveAble;
    if(side === 'black')
      destinationRow = row + 1;
    else
      destinationRow = row - 1;

    let destinationColLeft = col - 1;
    let destinationColRight = col + 1;
    if(col !== 1) {
      moveAble = this.isFieldMoveAble([destinationRow, destinationColLeft])
      if(!moveAble.success || typeof moveAble.nextMove === 'undefined') {
        this.destination.left = [destinationRow, destinationColLeft];
      } else {
        this.soldierEating[this.getIndexFromCoordinates(moveAble.nextMove)] = [destinationRow, destinationColLeft];
        this.destination.left = moveAble.nextMove;
      }
    }
    if(col !== 8) {
      moveAble = this.isFieldMoveAble([destinationRow, destinationColRight])
      if(!moveAble.success || typeof moveAble.nextMove === 'undefined') {
        this.destination.right = [destinationRow, destinationColRight];
      } else {
        this.soldierEating[this.getIndexFromCoordinates(moveAble.nextMove)] = [destinationRow, destinationColRight];
        this.destination.right = moveAble.nextMove;
      }
    }
    return this.destination;
  }

}
