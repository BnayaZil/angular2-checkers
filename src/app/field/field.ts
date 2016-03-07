import {Component, Output, EventEmitter, Input, OnChanges, SimpleChange} from 'angular2/core';
import {Soldier} from './../soldier/soldier';
import {Destination} from './../destination/destination';
import {NgClass} from 'angular2/common';

import * as _ from 'lodash';

/*
 * We're loading this component asynchronously
 * We are using some magic with es6-promise-loader that will wrap the module with a Promise
 * see https://github.com/gdi2290/es6-promise-loader for more info
 */

@Component({
  selector: 'field',
  directives: [Soldier, Destination, NgClass],
  template: `
    <soldier *ngIf="fieldData.soldier" (square)="square" (click)="onSelectSoldier()" [ngClass]="{white: fieldData.side === 'white', black: fieldData.side === 'black'}"></soldier>
    <destination *ngIf="fieldData.destination" (square)="square" (click)="onSelectDestination()"></destination>
  `,
  inputs: ['square'],
  styles: [`
    :host {
      width: 12.5%;
      height: 12.5%;
      background: brown;
      box-sizing: border-box;
      float: left;
      position: relative;
    }
    :host:nth-child(n):nth-child(odd):nth-child(-n+8) {
      background: #fff;
    }
    :host:nth-child(n+9):nth-child(even):nth-child(-n+16) {
      background: #fff;
    }
    :host:nth-child(n+17):nth-child(odd):nth-child(-n+24) {
      background: #fff;
    }
    :host:nth-child(n+25):nth-child(even):nth-child(-n+32) {
      background: #fff;
    }
    :host:nth-child(n+33):nth-child(odd):nth-child(-n+40) {
      background: #fff;
    }
    :host:nth-child(n+41):nth-child(even):nth-child(-n+48) {
      background: #fff;
    }
    :host:nth-child(n+49):nth-child(odd):nth-child(-n+56) {
      background: #fff;
    }
    :host:nth-child(n+57):nth-child(even):nth-child(-n+64) {
      background: #fff;
    }
  `]
})
export class Field {
  col: number;
  row: number;
  square: number;
  @Output() soldierChoosing: EventEmitter<any> = new EventEmitter();
  @Output() destinationChoosing: EventEmitter<any> = new EventEmitter();
  @Input() fieldData: any;

  constructor() {
  }
    ngOnChanges(changes) {
        console.log('onChange!', this.fieldData);
    }
  ngOnInit() {
      this.row = Math.ceil(this.square / 8);
      if(this.square % 8 == 0) {
        this.col = 8;
      } else {
        this.col = this.square % 8;
      }
  }

    onSelectSoldier() {
        this.soldierChoosing.next({id: this.square, position: [this.row, this.col], fieldData: this.fieldData});
    }
    onSelectDestination() {
        this.destinationChoosing.next({id: this.square, position: [this.row, this.col], fieldData: this.fieldData});
    }

}
