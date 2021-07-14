import { Component, Input, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

declare var $: any;

@Component({
  selector: 'app-preview-details',
  templateUrl: './preview-details.component.html',
  styleUrls: ['./preview-details.component.scss']
})
export class PreviewDetailsComponent implements OnInit {

  @Input() eventContent?: any;
  @Input() hostingContent?: any;

  facebookLinkCopied = false;
  youtubeLinkCopied = false;
  zoomLinkCopied = false;
  zoomIdCopied = false;
  zoomPasswordCopied = false;
  meetLinkCopied = false;
  meetPasswordCopied = false;
  teamsLinkCopied = false;
  teamsPasswordCopied = false;

  constructor(private _snackBar: MatSnackBar) {
  }

  ngOnInit(): void {
  }

  openSnackBar() {
    this._snackBar.open('Copied to clipboard', 'x', {
      duration: 3000
    });
  }

  copyFacebookLink(){
    this.facebookLinkCopied = true;
    setTimeout(() => { this.facebookLinkCopied = false }, 3000);
    this.openSnackBar();
  }

  copyYoutubeLink(){
    this.youtubeLinkCopied = true;
    setTimeout(() => { this.youtubeLinkCopied = false }, 3000);
    this.openSnackBar();
  }

  copyZoomLink(){
    this.zoomLinkCopied = true;
    setTimeout(() => { this.zoomLinkCopied = false }, 3000);
    this.openSnackBar();
  }

  copyZoomId(){
    this.zoomIdCopied = true;
    setTimeout(() => { this.zoomIdCopied = false }, 3000);
    this.openSnackBar();
  }

  copyZoomPassword(){
    this.zoomPasswordCopied = true;
    setTimeout(() => { this.zoomPasswordCopied = false }, 3000);
    this.openSnackBar();
  }

  copyMeetLink(){
    this.meetLinkCopied = true;
    setTimeout(() => { this.meetLinkCopied = false }, 3000);
    this.openSnackBar();
  }

  copyMeetPassword(){
    this.meetLinkCopied = true;
    setTimeout(() => { this.meetLinkCopied = false }, 3000);
    this.openSnackBar();
  }

  copyTeamsLink(){
    this.teamsLinkCopied = true;
    setTimeout(() => { this.teamsLinkCopied = false }, 3000);
    this.openSnackBar();
  }

  copyTeamsPassword(){
    this.teamsPasswordCopied = true;
    setTimeout(() => { this.teamsPasswordCopied = false }, 3000);
    this.openSnackBar();
  }

}
