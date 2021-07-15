import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-preview-minimised-sponsors',
  templateUrl: './preview-minimised-sponsors.component.html',
  styleUrls: ['./preview-minimised-sponsors.component.scss']
})
export class PreviewMinimisedSponsorsComponent implements OnInit {

  constructor() { }

  @Input() sponsors?: any;

  ngOnInit(): void {
  }

}
