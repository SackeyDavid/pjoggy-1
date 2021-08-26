import { EndpointService } from './../endpoints/endpoint.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import _ from 'lodash';


@Injectable({
  providedIn: 'root'
})
export class SpeakersService {

  private headers: HttpHeaders;
  private formHeaders: HttpHeaders;
  
  private getSpeakerUrl: string;
  private hasSpeakerUrl: string;
  private deleteSpeakerUrl: string;
  private editSpeakerUrl: string;
  private createSpeakerUrtl: string;

  constructor(private http: HttpClient, private endpoint: EndpointService) {
    this.headers = this.endpoint.headers();
    this.formHeaders = this.endpoint.headers(true);
    this.editSpeakerUrl = this.endpoint.apiHost + '/v1/edit_host/';
    this.getSpeakerUrl = this.endpoint.apiHost + '/v1/get_hosts/';
    this.createSpeakerUrtl = this.endpoint.apiHost + '/v1/create_host';
    this.hasSpeakerUrl = this.endpoint.apiHost + '/v1/hasSpeaker/';
    this.deleteSpeakerUrl = this.endpoint.apiHost + '/v1/delete_host/';
  }
  
  /**
   * Creates a new speaker for an event.
   * @param speaker Speaker
   * @returns 
   */
   createSpeaker(speaker: any, image: File, eventId: any): Promise<any> {
    console.log(this.createSpeakerUrtl);
    console.log(speaker);
    return new Promise((resolve, reject) => {
      const formData = new FormData();
      formData.append('event_id', eventId);
      formData.append('image', image);
      formData.append('name', speaker.name);
      formData.append('title', speaker.title);
      formData.append('bio', speaker.bio);
      formData.append('facebook', speaker.facebook);      
      formData.append('twitter', speaker.twitter);      
      formData.append('linkedin', speaker.linkedin);      
      formData.append('instagram', speaker.instagram);      

      const url = this.createSpeakerUrtl;
      this.http.post<any>(url, formData, { headers: this.formHeaders }).subscribe(
        res => {
          console.log('create_speaker_ok: ', res);
          if (_.toLower(res.message) == 'ok') {
            resolve(res.message);
          }
          else {
            resolve(0);
          }
        },
        err => {
          console.error('create_speaker_error: ', err);
          reject(err);
        }
      );
    });
  }

  /**
   * Edits an event speaker.
   * @param speakerId Speaker ID.
   * @param speaker Speaker
   * @returns 
   */ 
  editSpeaker(speakerId: string, speaker: any, image: File): Promise<boolean> {
    return new Promise((resolve, reject) => {
      const url = this.editSpeakerUrl + speakerId;
      const formData = new FormData();
      formData.append('image', image);
      formData.append('name', speaker.name);
      formData.append('title', speaker.title);
      formData.append('bio', speaker.bio);
      formData.append('facebook', speaker.facebook);      
      formData.append('twitter', speaker.twitter);      
      formData.append('linkedin', speaker.linkedin);      
      formData.append('instagram', speaker.instagram);

      this.http.post<any>(url, formData, { headers: this.formHeaders }).subscribe(
        res => {
          console.log('edit_speaker_ok: ', res);
          if (_.toLower(res.message) == 'ok') {
            resolve(true);
          }
          else {
            resolve(false);
          }
        },
        err => {
          console.error('edit_speaker_error: ', err);
          reject(err);
        }
      );
    });
  }

  /**
   * Returns a list of speakers for an event.
   * @param eventId The event ID.
   * @returns 
   */
  getSpeakers(eventId: string): Promise<Array<any>> {
    return new Promise((resolve, reject) => {
      let speakers: any[] = [];
      const url = this.getSpeakerUrl + eventId;
      this.http.get<any>(url, { headers: this.headers}).subscribe(
        res => {
          console.log('get_speakers_ok: ', res);
          speakers = res;
          resolve(speakers);
        },
        err => {
          console.log('get_speakers_error: ', err);
          reject(err);
        }
      );
    });
  }

  /**
   * Determines if an event has speakers. 
   * @param eventId Event ID.
   * @returns 
   */
  hasSpeakers(eventId: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      const url = this.hasSpeakerUrl + eventId;
      this.http.get<any>(url, { headers: this.headers }).subscribe(
        res => {
          console.log('has_speakers_ok:', res);
          if (_.toLower(res.message) == 'yes')
            resolve(true)
          else 
            resolve(false);
        },
        err => {
          console.log('has_speakers_error: ', err);
          reject(err);
        }
      );
    });
  }

  /**
   * Deletes a speaker.
   * @param speakerId Speaker ID.
   * @returns 
   */
  deleteSpeaker(speakerId: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      const url = this.deleteSpeakerUrl + speakerId;
      this.http.post<any>(url, {}, { headers: this.headers }).subscribe(
        res => {
          console.log('delete_speaker_ok:', res);
          if (_.toLower(res.message) == 'ok')
            resolve(true)
          else 
            resolve(false);
        },
        err =>{
          console.log('delete_speaker_error: ', err);
          reject(err);
        }
      );
    });
  }

}
