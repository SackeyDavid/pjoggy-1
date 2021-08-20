import _ from 'lodash';
import { Router } from '@angular/router';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { TicketsService } from 'src/app/services/tickets/tickets.service';
import moment from 'moment';
import { BasicInfoService } from 'src/app/services/basic-info/basic-info.service';

@Component({
  selector: 'app-create-event-ticketing',
  templateUrl: './create-event-ticketing.component.html',
  styleUrls: ['./create-event-ticketing.component.scss']
})
export class CreateEventTicketingComponent implements OnInit {

  @ViewChild('ticketForm') ticketFormElement: NgForm | undefined;

  eventTitle: string = '';
  eventDate: string = '';
  eventTicketing: string = '';

  isLoading: boolean;
  saved: boolean;
  eventId: string;
  isEditMode: boolean;
  isSaving: boolean;
  selectedTicketId: string;
  selectedTicketIndex: number;
  isLoadingTickets: boolean;
  createdTicketList: Array<any>;
  form: FormGroup = new FormGroup({});

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private ticketService: TicketsService,
    private basicInfoService: BasicInfoService
  ) {
    this.isLoading = false;
    this.saved = false;
    this.eventId = '';
    this.isSaving = false;
    this.isEditMode = false;
    this.isLoadingTickets = false;
    this.createdTicketList = [];
    this.selectedTicketIndex = -1;
    this.selectedTicketId = '';

    this.getEventDetails();
    this.getExistingTickets();
  }

  ngOnInit(): void {
    this.initForm();

    var data: any =  sessionStorage.getItem('created_event');
    data = JSON.parse(data);
    console.log(data.organizers.length);
    this.eventTitle = data.event[0].title;
    this.eventDate = data.event[0].start_date_time;
    this.eventTicketing = data.event[0].ticketing;
    if(this.eventTicketing == '0') 
    {
      this.f.price.disable();
      this.f.name.setValue('General Admission');

      // not working want to auto create a free ticket if ticketing is free
      // this.f.submit();
      
    }
    if(this.eventTicketing == '2') {
      this.f.price.setValue('1');
      // this.f.price.disable();
    }
  }

  
  public get f(): any {
    return this.form.controls;
  }
  

  initForm(): void {
    this.form = this.formBuilder.group({
      name: ['', Validators.required],
      quantity: ['-1', Validators.pattern("^[-1-9]*$")],
      price: ['0'],
      currency: ['GHS'],
      salesEndDate: [''],
      salesStartDate: ['']
    });

  }

  displayFailedDeleteToast(): void {}

  getEventDetails(): any {
    const rawData = sessionStorage.getItem('created_event');
    const eventData = rawData != null ? JSON.parse(rawData) : {};
    this.eventId = eventData.event[0].id;

    console.log(this.eventId);
  }

  previous(): void {
    this.router.navigateByUrl('/create_event/more_details');
  }

  save(): void {
    this.router.navigateByUrl('/create_event/publishing');
  }

  create(): void {
    this.saved = true;
    if (this.form.valid) {
      console.log('form is valid');
      if (!this.isEditMode) {
        this.isSaving = true;
        this.createTicket().then(
          ok => {
            if (ok) {
              this.isSaving = false;
              this.saved = false;
              this.form.reset();
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
        this.editTicket(this.selectedTicketId, this.selectedTicketIndex);
      }
    }
    else{
      window.scrollTo(0,0);
    }
  }

  getFormData(): any {
    const endDate = this.f.salesEndDate.value == '' || this.f.salesEndDate.value == null
      ? null
      : moment(this.f.salesEndDate.value).format('YYYY-MM-DD');

    const startDate = this.f.salesStartDate.value == '' || this.f.salesStartDate.value == null
      ? null
      : moment(this.f.salesStartDate.value).format('YYYY-MM-DD');

    const data = {
      name: this.f.name.value,
      quantity: this.f.quantity.value,
      price: this.f.price.value,
      salesEndDate: endDate,
      salesStartDate: startDate,
      currency: this.f.currency.value,
      eventId: this.eventId
    };

    console.log(data);

    return data;
  }

  getCreatedTicketData(ticketId: string): any {
    const ticket = this.getFormData();
    const data = {
      ticketId: ticketId,
      name: ticket.name,
      quantity: ticket.quantity || ticket.max_quantity,
      price: ticket.price,
      salesEndDate: ticket.salesEndDate,
      salesStartDate: ticket.salesStartDate,
      currency: ticket.currency
    };
    return data;
  }

  getExistingTickets(): any {
    this.isLoadingTickets = true;
    this.ticketService.getTickets(this.eventId).then(
      tickets => {
        this.isLoadingTickets = false;
        _.forEach(tickets, (ticket) => {
          this.createdTicketList.push(ticket);
        });
      }
    );
  }

  async createTicket(): Promise<boolean> {
    return new Promise((resolve, reject) => {
      const ticketData = this.getFormData();
      this.ticketService.createTicket(ticketData).then(
        ticketId => {
          if (ticketId == 0) {
            resolve(false);
          }
          else { 
            const createdTicket = this.getCreatedTicketData(ticketId);
            this.createdTicketList.unshift(createdTicket);

            this.saveCreatedEvent(this.eventId).then(
              ok => {
                if (ok) console.log('saved created event to session');
              }                               
            );

            resolve(true);
          }
        },
        err => {
          console.log(err);
          reject(err);
        }
      );
    });
  }

  edit(ticket: any, index: number): void {
    this.isEditMode = true;
    const endDate = moment(ticket.sales_enddate_time || ticket.salesEndDate).format('YYYY-MM-DD');
    const startDate = moment(ticket.sales_startdate_time || ticket.salesStartDate).format('YYYY-MM-DD');

    this.f.name.setValue(ticket.name);
    this.f.price.setValue(ticket.price);
    this.f.currency.setValue(ticket.currency);
    this.f.quantity.setValue(ticket.max_quantity || ticket.quantity);
    this.f.salesEndDate.setValue(endDate);
    this.f.salesStartDate.setValue(startDate);

    this.selectedTicketId = ticket.id;
    this.selectedTicketIndex = index;

    console.log(ticket.sales_enddate_time);
  }

  editTicket(ticketId: string, index: number): void {
    this.isSaving = true;
    const ticket = this.getFormData();
    this.ticketService.editTicket(ticketId, ticket).then(
      ok => {
        if (ok) {
          this.isSaving = false;
          this.isEditMode = false;
          this.saved = false;
          this.resetForm();

          const editedTicket = this.createdTicketList[index];
          editedTicket.name = ticket.name;
          editedTicket.max_quantity = ticket.quantity;
          editedTicket.price = ticket.price,
          editedTicket.sales_enddate_time = ticket.salesEndDate,
          editedTicket.sales_startdate_time = ticket.salesStartDate,
          editedTicket.currency = ticket.currency;
        }
      },
      err => {}
    );
  }

  delete(id: string, index: number): void {
    this.deleteTicket(id, index);
  }

  deleteTicket(ticketId: string, index: number): void {
    this.ticketService.deleteTicket(ticketId).then(
      ok => {
        ok
          ? this.createdTicketList.splice(index, 1)
          : this.displayFailedDeleteToast();
      },
      err => {}
    );
  }

  resetForm() : void {
    this.f.name.setValue('');
    this.f.price.setValue('0');
    this.f.currency.setValue('');
    this.f.quantity.setValue('-1');
    this.f.salesEndDate.setValue('');
    this.f.salesStartDate.setValue('');
    if(this.eventTicketing == '0') this.f.name.setValue('Free')
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

  openUsersEvents() {
    this.router.navigateByUrl('/user_events');
    
  }

}
