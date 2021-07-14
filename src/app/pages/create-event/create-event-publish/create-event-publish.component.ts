import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PublishingService } from 'src/app/services/publishing/publishing.service';
import { TicketsService } from 'src/app/services/tickets/tickets.service';
import { BasicInfoService } from 'src/app/services/basic-info/basic-info.service';
import { PrefixNot } from '@angular/compiler';
import { EventSideMenuCheckService } from 'src/app/services/event-side-menu-check/event-side-menu-check.service';
import moment from 'moment';

@Component({
  selector: 'app-create-event-publish',
  templateUrl: './create-event-publish.component.html',
  styleUrls: ['./create-event-publish.component.scss']
})
export class CreateEventPublishComponent implements OnInit {

  event: any;
  isLoading: boolean;
  allowCancel: number = 0;
  cancelRules: number = 0;
  publishErrors: any[] = [];

  rsvpForm: any[] = [];
  existingRsvpId: any = 0;
  existingRsvpForm: any;

  eventTitle: string = ''
  eventDate: string = ''

  eventId: string = '';
  eventBanner: string = '';
  eventDescription: string = '';
  eventStartDate: string = '';
  eventEndDate: string = '';
  eventOrganizer: string = '';
  eventContactEmail: string = '';
  eventContactPhone: string = '';

  eventTickets: any;

  includePrefix: boolean = false;
  requirePrefix: boolean = false;
  includeFirstName: boolean = true;
  requireFirstName: boolean = true;
  includeLastName: boolean = true;
  requireLastName: boolean = true;
  includeGender: boolean = false;
  requireGender: boolean = false;
  includeEmail: boolean = true;
  requireEmail: boolean = true;
  includePhone: boolean = false;
  requirePhone: boolean = false;
  includeAddress: boolean = false;
  requireAddress: boolean = false;

  constructor(
    private router: Router, 
    private publishingService: PublishingService,
    private ticketService: TicketsService,
    private basicInfoService: BasicInfoService,
    private checkSessionEventData: EventSideMenuCheckService
  ) {
    this.isLoading = false;
    this.event = {
      title: '',
      recurring: '',
      start_date_time: '',
      hasScheduleData: false,
      hasMoreDetailsData: false,
      hasTicketingData: false,
      hasPublishingData: false
    };
  }

  ngOnInit(): void {
    this.event.hasMoreDetailsData = this.checkSessionEventData.eventHasMoreDetailsData();
    this.event.hasScheduleData = this.checkSessionEventData.eventHasScheduleData();
    this.event.hasTicketingData = this.checkSessionEventData.eventHasTicketingData();
    this.event.hasPublishingData = this.checkSessionEventData.eventHasPublishingData();

    var data: any =  sessionStorage.getItem('created_event')
    data = JSON.parse(data)
    this.eventTitle = data.event[0].title;
    this.eventDate = data.event[0].start_date_time;
    this.event.recurring = data.event[0].recurring;

    this.eventId = data.event[0].id;
    this.eventBanner = data.event[0].banner_image;
    this.eventDescription = data.event[0].description;    
    this.eventStartDate = data.event[0].start_date_time;    
    this.eventEndDate = data.event[0].end_date_time;   
    this.eventOrganizer = data.organizers[0]?.name;    
    this.eventContactEmail = data.event[0].contact_email;    
    this.eventContactPhone = data.event[0].contact_phone;
    
    this.getTickets();
    this.getRsvp();
  }

  previous() {
    this.router.navigateByUrl('/create_event/ticketing');
  }

  publish(): void {   
    this.isLoading = true;

    let allow_cancel = (this.allowCancel == 1)? "1" : "0";
    let body = {
      allow_cancel: allow_cancel,
      cancel_rules: this.cancelRules.toString()
    } 
    console.log(body);
    this.publishingService.publishEvent(this.eventId, body).then(
      res => {
        if (res) {
          console.log(res);
          this.isLoading = false;
          if(res.message == 'OK') {
            sessionStorage.setItem('preview_event_id', this.eventId);
            this.router.navigateByUrl('/event_details');                        
          }
          this.publishErrors = [];
        }
      },
      err => {
        console.log(err);
        this.isLoading = false;
        this.publishErrors = err.error.message;
      }
    );    
  }

  createRsvpForm() {
    this.isLoading = true;
    this.fillRsvpForm();
    console.log(this.rsvpForm);

    this.publishingService.createRsvpForm(this.eventId, this.rsvpForm, this.existingRsvpId).then(
      res => {
        if (res) {
          console.log(res);
          this.isLoading = false;
          if(res.message == 'Ok') {            
            this.publish();       
          }
        }
      },
      err => {
        console.log(err);
        this.isLoading = false;
        this.rsvpForm = [];
      }
    );
  }

  fillRsvpForm() {
    if(this.includePrefix == true) {
      this.rsvpForm.push({ field_name: "Prefix", required: this.requirePrefix });
    }
    if(this.includeFirstName == true) {
      this.rsvpForm.push({ field_name: "First Name", required: this.requireFirstName });
    }
    if(this.includeLastName == true) {
      this.rsvpForm.push({ field_name: "Last Name", required: this.requireLastName });
    }
    if(this.includeGender == true) {
      this.rsvpForm.push({ field_name: "Gender", required: this.requireGender });
    }
    if(this.includeEmail == true) {
      this.rsvpForm.push({ field_name: "Email", required: this.requireEmail });
    }
    if(this.includePhone == true) {
      this.rsvpForm.push({ field_name: "Phone No.", required: this.requirePhone });
    }
    if(this.includeAddress == true) {
      this.rsvpForm.push({ field_name: "Address", required: this.requireAddress });
    }
  }

  getTickets(): any {
    this.ticketService.getTickets(this.eventId).then(
      tickets => {
        console.log(tickets);

        this.eventTickets = tickets;
        // _.forEach(tickets, (ticket) => {
        //   this.createdTicketList.push(ticket);
        // });
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

  getRsvp(): any {
    this.publishingService.getRsvp(this.eventId).then(
      rsvp => {
        console.log(rsvp);        
        if (rsvp[0]?.id) {
          this.existingRsvpId = rsvp[0].id;
          this.existingRsvpForm = rsvp[0].form_fields;

          this.populateRsvpForm(rsvp[0].form_fields);
        }
      }
    );
  }
  
  populateRsvpForm(form: any) {
    console.log(form)
    if(form.find((key: { field_name: string; }) => key.field_name === 'Prefix')){
      this.includePrefix = true;
      let index = form.findIndex((key: { field_name: string; }) => key.field_name == "Prefix");
      console.log(index);
      if(form[index].required == true) {
        this.requirePrefix = true;
      }
    }
    if(form.find((key: { field_name: string; }) => key.field_name === 'First Name')){
      this.includeFirstName = true;
      let index = form.findIndex((key: { field_name: string; }) => key.field_name == "First Name");
      console.log(index);
      if(form[index].required == true) {
        this.requireFirstName = true;
      }
    }
    if(form.find((key: { field_name: string; }) => key.field_name === 'Last Name')){
      this.includeLastName = true;
      let index = form.findIndex((key: { field_name: string; }) => key.field_name == "Last Name");
      console.log(index);
      if(form[index].required == true) {
        this.requireLastName = true;
      }
    }
    if(form.find((key: { field_name: string; }) => key.field_name === 'Gender')){
      this.includeGender = true;
      let index = form.findIndex((key: { field_name: string; }) => key.field_name == "Gender");
      console.log(index);
      if(form[index].required == true) {
        this.requireGender = true;
      }
    }
    if(form.find((key: { field_name: string; }) => key.field_name === 'Email')){
      this.includeEmail = true;
      let index = form.findIndex((key: { field_name: string; }) => key.field_name == "Email");
      console.log(index);
      if(form[index].required == true) {
        this.requireEmail = true;
      }
    }
    if(form.find((key: { field_name: string; }) => key.field_name === 'Phone No.')){
      this.includePhone = true;
      let index = form.findIndex((key: { field_name: string; }) => key.field_name == "Phone No.");
      console.log(index);
      if(form[index].required == true) {
        this.requirePhone = true;
      }
    }
  }

  getEventDateWithoutTime(date: string) {
    return moment(date).format('YYYY-MM-DD');
  }

  
  getEventStartDateFormatted(date: any) {
    return moment(date).format('ddd, MMM D, YYYY h:mm A');
  }

  getEventEndDateFormatted(date: any) {
    return moment(date).format('h:mm A');

  }

}


