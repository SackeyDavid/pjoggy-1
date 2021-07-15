import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-preview-minimised-pricing',
  templateUrl: './preview-minimised-pricing.component.html',
  styleUrls: ['./preview-minimised-pricing.component.scss']
})
export class PreviewMinimisedPricingComponent implements OnInit {

  constructor() { }

  @Input() pricing?: any;

  ngOnInit(): void {
  }

}
