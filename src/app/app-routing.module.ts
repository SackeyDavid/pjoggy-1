import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HomePageComponent } from './pages/home-page/home-page.component';
import { LearnMoreComponent } from './pages/learn-more/learn-more.component';
import { HappeningNowComponent } from './pages/happening-now/happening-now.component';
import { LoginPageComponent } from './pages/user-auth/login-page/login-page.component';
import { SignupPageComponent } from './pages/user-auth/signup-page/signup-page.component';
import { UpcomingEventsPageComponent } from "./pages/upcoming-events-page/upcoming-events-page.component";
import { PopularEventsPageComponent } from "./pages/popular-events-page/popular-events-page.component";
import { NewEventsPageComponent } from "./pages/new-events-page/new-events-page.component";
import { HelpPageComponent } from "./pages/help-page/help-page.component";
import { FavoritePageComponent } from './pages/favorites-page/favorite-page.component';

import { CreateBasicInfoComponent } from './pages/create-event/create-basic-info/create-basic-info.component';
import { CreateEventSchedulesComponent } from './pages/create-event/create-event-schedules/create-event-schedules.component';
import { CreateEventDetailsComponent } from './pages/create-event/create-event-details/create-event-details.component';
import { CreateEventTicketingComponent } from './pages/create-event/create-event-ticketing/create-event-ticketing.component';
import { CreateEventPublishComponent } from './pages/create-event/create-event-publish/create-event-publish.component';
import { EmailConfirmedComponent } from './pages/user-auth/email-confirmed/email-confirmed.component';
import { EmailInvalidComponent } from './pages/user-auth/email-invalid/email-invalid.component';
import { PhoneAuthenticationComponent } from './pages/user-auth/phone-authentication/phone-authentication.component';
import { RecoveryEmailComponent } from './pages/user-auth/recovery-email/recovery-email.component';
import { PasswordResetComponent } from './pages/user-auth/password-reset/password-reset.component';
import { UserProfilePageComponent } from './pages/profile/user-profile-page/user-profile-page.component';
import { OrganizationProfilePageComponent } from './pages/profile/organization-profile-page/organization-profile-page.component';
import { EditBasicInfoComponent } from './pages/edit-event/edit-basic-info/edit-basic-info.component';
import { EditEventSchedulesComponent } from './pages/edit-event/edit-event-schedules/edit-event-schedules.component';
import { EditEventDetailsComponent } from './pages/edit-event/edit-event-details/edit-event-details.component';
import { UserEventsComponent } from './pages/user-events/user-events.component';
import { CreateEventOrganizersComponent } from './pages/create-event/create-event-organizers/create-event-organizers.component';
import { CreateEventSpeakersComponent } from './pages/create-event/create-event-speakers/create-event-speakers.component';
import { CreateEventMediaComponent } from './pages/create-event/create-event-media/create-event-media.component';
import { CreateEventSponsorsComponent } from './pages/create-event/create-event-sponsors/create-event-sponsors.component';
import { SignupEmailComponent } from './pages/user-auth/signup-email/signup-email.component';
import { SignupMoreInfoComponent } from './pages/user-auth/signup-more-info/signup-more-info.component';
import { SearchResultsComponent } from './pages/search-results/search-results.component';
import { PreviewEventPageComponent } from './pages/preview-event-page/preview-event-page.component';
import { RecoveryInvalidComponent } from './pages/user-auth/recovery-invalid/recovery-invalid.component';
import { GoogleMagiclinkComponent } from './pages/user-auth/google-magiclink/google-magiclink.component';
import { FacebookMagiclinkComponent } from './pages/user-auth/facebook-magiclink/facebook-magiclink.component';
import { MagiclinkSuccessComponent } from './pages/user-auth/magiclink-success/magiclink-success.component';
import { MagiclinkInvalidComponent } from './pages/user-auth/magiclink-invalid/magiclink-invalid.component';
import { AccountProfileComponent } from './pages/profile/account-profile/account-profile.component';
import { AccountSettingsComponent } from './pages/profile/account-settings/account-settings.component';
import { CategoryEventsPageComponent } from './pages/category-events-page/category-events-page.component';
import { EventManagerHomePageComponent } from './pages/event-manager-home-page/event-manager-home-page.component';
import { AuthGuard } from './services/auth-guard/auth.guard';
import { RsvpPaymentComponent } from './pages/rsvp-payment/rsvp-payment.component';
import { RsvpUserComponent } from './pages/rsvp-user/rsvp-user.component';


const routes: Routes = [
  {
    path: '',
    component: HomePageComponent
  },
  {
    path: 'search_results',
    component: SearchResultsComponent
  },
  {
    path: 'help',
    component: HelpPageComponent
  },
  {
    path: 'user_events',
    component: UserEventsComponent
  },
  {
    path: 'login',
    component: LoginPageComponent
  },
  {
    path: 'manage-community',
    component: EventManagerHomePageComponent
  },
  {
    path: 'register',
    component: SignupEmailComponent
  },
  {
    path: 'signup_more_info',
    component: SignupMoreInfoComponent
  },
  {
    path: 'email_confirmed',
    component: EmailConfirmedComponent
  },
  {
    path: 'email_invalid',
    component: EmailInvalidComponent
  },
  {
    path: 'phone_authentication',
    component: PhoneAuthenticationComponent
  },
  {
    path: 'recovery_email',
    component: RecoveryEmailComponent
  },
  {
    path: 'recovery_invalid',
    component: RecoveryInvalidComponent
  },
  {
    path: 'password_reset',
    component: PasswordResetComponent
  },
  {
    path: 'magiclink',
    component: GoogleMagiclinkComponent,
  },
  {
    path: 'magiclink_confirmed',
    component: FacebookMagiclinkComponent,
  },
  {
    path: 'magiclink_success',
    component: MagiclinkSuccessComponent,
  },
  {
    path: 'magiclink_success',
    component: MagiclinkSuccessComponent,
  },
  {
    path: 'magiclink_invalid',
    component: MagiclinkInvalidComponent,
  },
  {
    path: 'event_details',
    component: PreviewEventPageComponent
  },
  {
    path: 'account',
    children: [
      {
        path: 'user',
        component: UserProfilePageComponent
      },
      {
        path: 'organization',
        component: OrganizationProfilePageComponent
      },
      {
        path: 'profile',
        component: AccountProfileComponent
      },
      {
        path: 'settings',
        component: AccountSettingsComponent
      },
    ]
  },
  {
    path: 'create_event',
    children: [
      {
        path: 'basic_info',
        component: CreateBasicInfoComponent
      },
      {
        path: 'schedule',
        component: CreateEventSchedulesComponent
      },
      {
        path: 'more_details',
        component: CreateEventDetailsComponent
      },
      {
        path: 'ticketing',
        component: CreateEventTicketingComponent
      },
      {
        path: 'publishing',
        component: CreateEventPublishComponent
      }
    ]
  },
  {
    path: 'edit_event',
    children: [
      {
        path: 'basic_info',
        component: EditBasicInfoComponent
      },
      {
        path: 'schedule',
        component: EditEventSchedulesComponent 
      },
      {
        path: 'more_details',
        component: EditEventDetailsComponent
      },
      {
        path: 'ticketing',
        component: CreateEventTicketingComponent
      },
      {
        path: 'publishing',
        component: CreateEventPublishComponent
      }
    ]
  },
  {
    path: 'create_advanced',
    children: [
      {
        path: 'organizers',
        component: CreateEventOrganizersComponent
      },
      {
        path: 'speakers',
        component: CreateEventSpeakersComponent
      },
      {
        path: 'media',
        component: CreateEventMediaComponent
      },
      {
        path: 'sponsors',
        component: CreateEventSponsorsComponent
      },
    ]
  },
  {
    path: 'events',
    children: [
      {
        path: 'learn-more',
        component: LearnMoreComponent
      },
      {
        path: 'live',
        component: HappeningNowComponent
      },
      {
        path: 'upcoming',
        component: UpcomingEventsPageComponent
      },
      {
        path: 'popular',
        component: PopularEventsPageComponent
      },
      {
        path: 'new',
        component: NewEventsPageComponent
      },
      {
        path: 'favorites',
        canActivate: [AuthGuard],
        component: FavoritePageComponent
      },
      {
        path: 'events-by-category/:id',
        component: CategoryEventsPageComponent
      },
    ]
  },
  {
    path: 'rsvp',
    children: [
      {
        path: 'payment',
        canActivate: [AuthGuard],
        component: RsvpPaymentComponent
      },
      {
        path: 'user',
        canActivate: [AuthGuard],
        component: RsvpUserComponent
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
