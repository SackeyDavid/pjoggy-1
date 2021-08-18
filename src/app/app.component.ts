import { Component, Injectable } from '@angular/core';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';

@Injectable()
class CustomDateAdapter extends MomentDateAdapter {
  getDayOfWeekNames(style: 'long' | 'short' | 'narrow') {
    return ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
  }
}

export const MATERIAL_DATEPICKER_FORMATS = {
  parse: {
    dateInput: ['l', 'LL'],
  },
  display: {
    dateInput: 'L',
    monthLabel: 'MMM',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers: [{provide: DateAdapter, useClass: CustomDateAdapter},

  {provide: MAT_DATE_FORMATS, useValue: MATERIAL_DATEPICKER_FORMATS},]
})
export class AppComponent {
  title = 'events369-ui';

  onActivate(e: any) {
    window.scrollTo(0,0);
  }
  
}
