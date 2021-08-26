import _ from 'lodash';
import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SpeakersService } from 'src/app/services/speakers/speakers.service';


@Component({
  selector: 'app-create-event-speakers',
  templateUrl: './create-event-speakers.component.html',
  styleUrls: ['./create-event-speakers.component.scss']
})
export class CreateEventSpeakersComponent implements OnInit {

  eventTitle: string = ''
  eventDate: string = ''

  isLoading: boolean;
  saved: boolean;
  isImageSet: boolean;
  imgSrcList: any[];
  createdImgSrc: string;
  eventId: string;
  isEditMode: boolean;
  isSaving: boolean;
  selectedSpeakerId: string;
  selectedSpeakerIndex: number;
  isLoadingSpeakers: boolean;
  createdSpeakerList: Array<any>;
  form: FormGroup = new FormGroup({});

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private speakerService: SpeakersService
  ) {
    this.isLoading = false;
    this.saved = false;
    this.eventId = '';
    this.isSaving = false;
    this.isEditMode = false;
    this.isLoadingSpeakers = false;
    this.isImageSet = false;
    this.imgSrcList = [];
    this.createdImgSrc = '';
    this.createdSpeakerList = [];
    this.selectedSpeakerIndex = -1;
    this.selectedSpeakerId = '';

    this.getEventDetails();
    this.getExistingSpeakers();
  }

  ngOnInit(): void {
    this.initForm();

    var data: any =  sessionStorage.getItem('created_event')
    data = JSON.parse(data)
    this.eventTitle = data.event[0].title;
    this.eventDate = data.event[0].start_date_time
  }

  
  public get f(): any {
    return this.form.controls;
  }
  

  initForm(): void {
    const urlRegex = /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/;

    this.form = this.formBuilder.group({
      name: ['', Validators.required],      
      title: [''],
      profile_image: [''],
      bio: [''],
      facebook: ['', Validators.pattern(urlRegex)],
      twitter: ['', Validators.pattern(urlRegex)],
      linkedin: ['', Validators.pattern(urlRegex)],
      instagram: ['', Validators.pattern(urlRegex)],
    });
  }

  displayFailedDeleteToast(): void {}

  getEventDetails(): any {
    const rawData = sessionStorage.getItem('created_event');
    const eventData = rawData != null ? JSON.parse(rawData) : {};
    this.eventId = eventData.event[0].id;
    console.log(this.eventId);
  }

  create(): void {
    this.saved = true;
    if (this.form.valid) {
      console.log('form is valid');
      if (!this.isEditMode) {
        this.isSaving = true;
        this.createSpeaker().then(
          ok => {
            if (ok) {
              this.isSaving = false;
              this.saved = false;
              this.form.reset();
              this.createdImgSrc = '';
              this.isImageSet = false;
            }
            else {
              this.isSaving = false;
              alert('didnt create');
            }
          },
          err => {}
        );
      }
      else {
        this.editSpeaker(this.selectedSpeakerId, this.selectedSpeakerIndex);
      }
    }
  }

  getFormData(): any {
    const data = {
      event_id: this.eventId,
      name: this.f.name.value,
      title: this.f.title.value,
      profile_image: this.f.profile_image,
      bio: this.f.bio.value,
      facebook: this.f.facebook.value,
      twitter: this.f.twitter.value,
      linkedin: this.f.linkedin.value,
      instagram: this.f.instagram.value,
    };
    return data;
  }
  
  getCreatedSpeakerData(speakerId: string): any {
    const speaker = this.getFormData();
    const data = {
      speakerId: speakerId,
      name: speaker.name,
      title: speaker.title,
      bio: speaker.bio,
      profile_image: this.createdImgSrc,
      facebook: speaker.facebook,
      twitter: speaker.twitter,
      linkedin: speaker.linkedin,
      instagram: speaker.instagram,
    };
    console.log(data);
    return data;
  }

  getExistingSpeakers(): any {
    this.isLoadingSpeakers = true;
    this.speakerService.getSpeakers(this.eventId).then(
      speakers => {
        console.log(speakers);
        this.isLoadingSpeakers = false;
        _.forEach(speakers, (speaker, i) => {
          this.createdSpeakerList.push(speaker);

          if (!(speakers[i].image == null)){
            this.imgSrcList[i] = 'http://events369.logitall.biz/storage/host/' + speakers[i].image;
          }
          else{
            this.imgSrcList[i] = '../../../../assets/images/avatar-placeholder.png';
          }
          
          console.log(this.imgSrcList[i]);
        });
      }
    );
  }

  async createSpeaker(): Promise<boolean> {
    return new Promise((resolve, reject) => {
      var speakerData = this.getFormData();
      var image = this.f.profile_image.value;
      this.speakerService.createSpeaker(speakerData, image, this.eventId).then(
        speakerId => {          
            const createdSpeaker = this.getCreatedSpeakerData(speakerId);
            this.createdSpeakerList.unshift(createdSpeaker);
            
            if (!(this.createdImgSrc == '')){
              this.imgSrcList.unshift(this.createdImgSrc)
            }
            else{
              this.imgSrcList.unshift('../../../../assets/images/avatar-placeholder.png')
            }

            resolve(true);
        },
        err => {
          console.log(err);
          reject(err);
        }
      );
    });
  }

  onFileSelected(e: any){
    const file:File = e.target.files[0];
    if (file) {
      this.isImageSet = true;

      this.f.profile_image.value = file;

      var reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (e: any) => {
        this.createdImgSrc = e.target.result;
      }
    }
  }
  
  edit(speaker: any, index: number): void {
    this.isEditMode = true;
    this.f.name.setValue(speaker.name);
    this.f.title.setValue(speaker.title);
    this.f.bio.setValue(speaker.bio);
    this.f.facebook.setValue(speaker.facebook);
    this.f.linkedin.setValue(speaker.linkedin);
    this.f.twitter.setValue(speaker.twitter);
    this.f.instagram.setValue(speaker.instagram);
    this.createdImgSrc = this.imgSrcList[index];
    this.isImageSet = true;

    this.selectedSpeakerId = speaker.id;
    this.selectedSpeakerIndex = index;
  }

  editSpeaker(speakerId: string, index: number): void {
    this.isSaving = true;
    const speaker = this.getFormData();
    var image = this.f.profile_image.value;
    console.log(speaker);
    this.speakerService.editSpeaker(speakerId, speaker, image).then(
      ok => {
        if (ok) {          
          const editedSpeaker = this.createdSpeakerList[index];
          editedSpeaker.name = speaker.name;
          editedSpeaker.title = speaker.title;
          editedSpeaker.bio = speaker.bio;
          editedSpeaker.facebook = speaker.facebook,
          editedSpeaker.linkedin = speaker.linkedin,
          editedSpeaker.twitter = speaker.twitter,
          editedSpeaker.instagram = speaker.instagram;
          this.imgSrcList[index] = this.createdImgSrc;

          this.isSaving = false;
          this.isEditMode = false;
          this.saved = false;
          this.form.reset();
          this.createdImgSrc = '';
          this.isImageSet = false;
        }
      },
      err => {}
    );
  }

  delete(id: string, index: number): void {
    this.deleteSpeaker(id, index);
  }

  deleteSpeaker(speakerId: string, index: number): void {
    this.speakerService.deleteSpeaker(speakerId).then(
      res => {
        res ? this.createdSpeakerList.splice(index, 1) : this.displayFailedDeleteToast();
      },
      err => {}
    );
  }
  
  resetForm() {
    this.f.name.setValue('');
    this.f.title.setValue('');
    this.f.bio.setValue('');
    this.f.facebook.setValue('');
    this.f.linkedin.setValue('');
    this.f.twitter.setValue('');
    this.f.instagram.setValue('');
    this.createdImgSrc = '';
    this.isImageSet = false;

    this.isEditMode = false;
  }

  previous(): void {
    this.router.navigateByUrl('/create_advanced/organizers');
  }

  save(): void {
    this.router.navigateByUrl('/create_advanced/media');
  }

}
