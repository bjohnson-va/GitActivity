import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { ProgressSpinnerMode } from '@angular/material';

@Component({
  selector: 'app-stat',
  templateUrl: './stat.component.html',
  styleUrls: ['./stat.component.scss']
})
export class StatComponent implements OnInit, OnChanges {

  @Input() value: number;
  @Input() warnPercent = 0;
  @Input() title: string;
  mode: ProgressSpinnerMode = 'indeterminate';

  constructor() { }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.mode = this.value >= 0 ? 'determinate' : 'indeterminate';
  }

}
