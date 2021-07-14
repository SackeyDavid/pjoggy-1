import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PreviewOrganizerModalComponent } from '../preview-organizer-modal/preview-organizer-modal.component';

@Component({
  selector: 'app-preview-minimised-organizers',
  templateUrl: './preview-minimised-organizers.component.html',
  styleUrls: ['./preview-minimised-organizers.component.scss']
})
export class PreviewMinimisedOrganizersComponent implements OnInit {

  @Input() organizers?: any;

  constructor(public dialog: MatDialog) { }

  ngOnInit(): void {
  }

  openModal(e: any, i: any) {
    e.preventDefault();
    this.dialog.open(PreviewOrganizerModalComponent, {data: this.organizers[i]});
  }


}
