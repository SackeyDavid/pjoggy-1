import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PreviewSpeakerModalComponent } from '../preview-speaker-modal/preview-speaker-modal.component';

@Component({
  selector: 'app-preview-minimised-speakers',
  templateUrl: './preview-minimised-speakers.component.html',
  styleUrls: ['./preview-minimised-speakers.component.scss']
})
export class PreviewMinimisedSpeakersComponent implements OnInit {

  @Input() speakers?: any;
  closeResult = '';

  constructor(public dialog: MatDialog) { }

  ngOnInit(): void {
  }

  openModal(e: any, i: any) {
    e.preventDefault();
    this.dialog.open(PreviewSpeakerModalComponent, {data: this.speakers[i]});
  }


}
