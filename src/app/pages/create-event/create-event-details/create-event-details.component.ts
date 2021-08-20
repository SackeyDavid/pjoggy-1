import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { EventDetailsService } from 'src/app/services/event-details/event-details.service';
import { BasicInfoService } from 'src/app/services/basic-info/basic-info.service';
import _ from 'lodash';
import { ImageCroppedEvent } from 'ngx-image-cropper';

@Component({
  selector: 'app-create-event-details',
  templateUrl: './create-event-details.component.html',
  styleUrls: ['./create-event-details.component.scss']
})
export class CreateEventDetailsComponent implements OnInit {

  eventTitle: string = ''
  eventDate: string = ''
  eventID: string = ''

  eventOrganizers: any;

  isLoading: boolean;
  isBannerSet: boolean;
  saved: boolean;
  form: FormGroup = new FormGroup({});
  imgSrc: string;
  imageChangedEvent: any;
  imageQuality: number = 100;

  video: any;
  isVideoSet: boolean;
  videoSrcList: any[];
  createdVideoSrc: string;
  isVideoSaving: boolean;
  videoError: boolean;

  facebookVisibility: boolean;
  zoomVisibility: boolean;
  youtubeVisibility: boolean;
  meetVisibility: boolean;
  teamsVisibility: boolean;

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private eventDetailsService: EventDetailsService,
    private basicInfoService: BasicInfoService
  ) {
    this.isLoading = false;
    this.isBannerSet = false;
    this.saved = false;
    this.imgSrc = '../../../../assets/images/placeholder.png';


    this.isVideoSet = false;
    this.videoSrcList = [];
    this.createdVideoSrc = '';
    this.isVideoSaving = false;
    this.videoError = false;

    this.facebookVisibility = false;
    this.zoomVisibility = false;
    this.youtubeVisibility = false;
    this.meetVisibility = false;
    this.teamsVisibility = false;
  }

  ngOnInit(): void {
    this.initForm();
    var data: any =  sessionStorage.getItem('created_event')
    data = JSON.parse(data)
    this.eventTitle = data.event[0].title;
    this.eventDate = data.event[0].start_date_time;
    this.eventID = data.event[0].id;
    this.eventOrganizers = data.organizers;

    this.getExistingVideos();
  }

  previous() {
    this.router.navigateByUrl('/create_event/schedule');
  }

  save() {
    this.isLoading = true;
    setTimeout(() => {
      this.router.navigateByUrl('/create_event/ticketing');
    }, 3500);
  }

  public get f(): any {
    return this.form.controls;
  }

  initForm(): void {
    const urlRegex = /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/;

    this.form = this.formBuilder.group({
      email: ['', Validators.email],
      phone: ['', [Validators.minLength(12), Validators.maxLength(12), Validators.pattern("^[0-9]*$")]],
      hosted_on: [''],
      banner_image: [''],
      organizer: [''],
      facebook_hosting: ['', Validators.pattern(urlRegex)],
      zoom_hosting: ['', Validators.pattern(urlRegex)],
      zoom_hosting_id: [''],
      zoom_hosting_password: [''],
      youtube_hosting: ['', Validators.pattern(urlRegex)],
      meet_hosting: ['', Validators.pattern(urlRegex)],
      meet_hosting_password: [''],
      teams_hosting: ['', Validators.pattern(urlRegex)],
      teams_hosting_password: [''],
      facebook_checkbox: [''],
      zoom_checkbox: [''],
      youtube_checkbox: [''],
      meet_checkbox: [''],
      teams_checkbox: [''],
    });
  }

  create(): void {
    // var data: any =  sessionStorage.getItem('created_event');
    // data = JSON.parse(data);
    // var eventId = data.event[0].id;
    console.log(this.f.email);
    this.saved = true;
    if (this.form.valid) {
      console.log('form is valid');
      console.log(this.getFormData());
      console.log( this.f.banner_image.value)
      this.isLoading = true;
      this.eventDetailsService.editEventDetails(this.getFormData(), this.f.banner_image.value, this.eventID).then(
        res => {
          if (res) {
            this.isLoading = false;
            this.getCreatedEvent(this.eventID);

            this.saveCreatedEvent(this.eventID).then(
              ok => {
                if (ok) this.router.navigateByUrl('/create_event/ticketing');
              }
            );
          }
          else {
            this.isLoading = false;
            alert('oops, didn\'t create');
          }
        },
        err => {
          console.log(err);
          this.isLoading = false;
        }
      );
    }
    else{
      window.scrollTo(0,0);
    }
  }

  onFileSelected(e: any){
    const file:File = e.target.files[0];
    this.imageChangedEvent = e
    if (file) {
      this.isBannerSet = true;
      // this.f.banner_image.value = file;
      console.log(file);

      var reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (e: any) => {
        // console.log(e.target);
        // this.imgSrc = e.target.result;
        this.imageCropped(e);
      }
    }
  }

  getFormData(): any {
    let hostedObject = [
      { 'id': 0, 'password': '', 'meeting_id': '', 'platform': 'Facebook', 'link': this.f.facebook_hosting.value },
      { 'id': 0, 'password': this.f.zoom_hosting_password.value, 'meeting_id': this.f.zoom_hosting_id.value, 'platform': 'Zoom', 'link': this.f.zoom_hosting.value },
      { 'id': 0, 'password': '', 'meeting_id': '', 'platform': 'Youtube', 'link': this.f.youtube_hosting.value },
      { 'id': 0, 'password': this.f.meet_hosting_password.value, 'meeting_id': '', 'platform': 'Meet', 'link': this.f.meet_hosting.value },
      { 'id': 0, 'password': this.f.teams_hosting_password.value, 'meeting_id': '', 'platform': 'Teams', 'link': this.f.teams_hosting.value }
    ]

    let organizer = this.f.organizer.value;
    for(let x of this.eventOrganizers){
      if(this.f.organizer.value == x?.name) organizer = x?.id;
    }

    const data = {
      email: this.f.email.value,
      phone: this.f.phone.value,
      hosted_on: hostedObject,
      organizer: organizer,
    };

    console.log(data);
    return data;
  }

  setFacebookVisibility(){
    this.facebookVisibility = this.f.facebook_checkbox.value;
  }

  setZoomVisibility(){
    this.zoomVisibility = this.f.zoom_checkbox.value;
  }

  setYoutubeVisibility(){
    this.youtubeVisibility = this.f.youtube_checkbox.value;
  }

  setMeetVisibility(){
    this.meetVisibility = this.f.meet_checkbox.value;
  }

  setTeamsVisibility(){
    this.teamsVisibility = this.f.teams_checkbox.value;
  }

  getCreatedEvent(eventId: any): void {
    this.eventDetailsService.getCreatedEvent(eventId).then(
      res => {
        console.log(res);
        sessionStorage.setItem('created_event', JSON.stringify(res));
      },
      err => {
        console.log(err);
      }
    );
  }

  saveCreatedEvent(eventId: any): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.basicInfoService.getCreatedEvent(eventId).then(
        res => {
          console.log(res);
          sessionStorage.removeItem('created_event');
          sessionStorage.setItem('created_event', JSON.stringify(res));
          resolve(true);
        },
        err => {
          console.log(err);
          reject(err);
        }
      );
    });
  }


  // ----------------------------------------------------------------------------------------------------
  // live videos

  createVideo(): void {
    if(this.isVideoSet) {
      this.isVideoSaving = true;
      console.log(this.video)
      this.eventDetailsService.storeVideo(this.video, this.eventID).then(
        res => {
          if (res) {
            this.isLoading = false;
            this.videoSrcList.unshift(this.createdVideoSrc)
            this.isVideoSet = false;
            this.isVideoSaving = false;
          }
          else {
            this.isLoading = false;
            alert('oops, didn\'t create');
          }
        },
        err => {
          console.log(err);
          this.isLoading = false;
          this.isVideoSaving = false;
        }
      );
    }
    else {
      this.videoError = true;
    }
  }

  getExistingVideos(): any {
    console.log('getting live events');
    this.eventDetailsService.getVideos(this.eventID).then(
      videos => {
        _.forEach(videos, (video, i) => {
          this.videoSrcList[i] = 'http://events369.logitall.biz/storage/live_videos/' + videos[i].url;
          console.log(this.videoSrcList[i]);
        });
      }
    );
  }

  onVideoSelected(e: any){
    const file:File = e.target.files[0];
    if (file) {
      this.isVideoSet = true;

      this.video = file;

      var reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (e: any) => {
        this.createdVideoSrc = e.target.result;
        // console.log(e.target.result);
      }
    }
  }

  openUsersEvents() {
    console.log(this.f.email);
    this.saved = true;
    if (this.form.valid) {
      console.log('form is valid');
      console.log(this.getFormData());
      console.log( this.f.banner_image.value)
      this.isLoading = true;
      this.eventDetailsService.editEventDetails(this.getFormData(), this.f.banner_image.value, this.eventID).then(
        res => {
          if (res) {
            this.isLoading = false;
            this.getCreatedEvent(this.eventID);

            this.saveCreatedEvent(this.eventID).then(
              ok => {
                if (ok) this.router.navigateByUrl('/user_events');
              }
            );
          }
          else {
            this.isLoading = false;
            alert('oops, didn\'t create');
          }
        },
        err => {
          console.log(err);
          this.isLoading = false;
        }
      );
    }
    else{
      window.scrollTo(0,0);
    }
  }

  // convert base64 to file blob
  urltoFile(url: any, filename: string, mimeType: any){
    return (fetch(url)
        .then(function(res){return res.arrayBuffer();})
        .then(function(buf){return new File([buf], filename,{type:mimeType});})
    );
  }

  imageCropped(event: ImageCroppedEvent) {

    this.urltoFile(event.base64!, 'cropped.wep','image/webp')
    .then((file) =>{ 
      // console.log(file);
      this.f.banner_image.value = file;
      
    });


    // const file:File = event..target.files[0];
    
    // console.log(event)
    this.imgSrc  = event.base64!;
  }
  imageLoaded() {
      // show cropper
  }
  cropperReady() {
      // cropper ready
  }
  loadImageFailed() {
      // show message
  }

}
