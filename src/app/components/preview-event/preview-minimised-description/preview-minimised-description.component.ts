import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-preview-minimised-description',
  templateUrl: './preview-minimised-description.component.html',
  styleUrls: ['./preview-minimised-description.component.scss']
})
export class PreviewMinimisedDescriptionComponent implements OnInit {

  constructor() { }

  @Input() eventContent?: any;

  ngOnInit(): void {
  }

}
