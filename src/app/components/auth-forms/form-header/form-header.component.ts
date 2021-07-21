import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-form-header',
  templateUrl: './form-header.component.html',
  styleUrls: ['./form-header.component.scss']
})
export class FormHeaderComponent implements OnInit {

  constructor() { }

  @Input() formTitle?: String;
  @Input() logo?: String;

  ngOnInit(): void {
  }

}
