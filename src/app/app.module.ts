import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { ClipboardModule } from '@angular/cdk/clipboard'
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatSelectModule } from '@angular/material/select';
import { MatNativeDateModule } from '@angular/material/core';
import { MatStepperModule } from '@angular/material/stepper';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatAutocompleteModule } from '@angular/material/autocomplete'
import { MatDialogModule } from '@angular/material/dialog';

import { OwlModule } from 'ngx-owl-carousel';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';
import { TimeagoModule } from 'ngx-timeago';

import { HomePageComponent } from './pages/home-page/home-page.component';
import { LoginPageComponent } from './pages/user-auth/login-page/login-page.component';
import { SignupPageComponent } from './pages/user-auth/signup-page/signup-page.component';
import { DiscoverPageComponent } from './pages/discover-page/discover-page.component';
import { SettingsPageComponent } from './pages/settings-page/settings-page.component';
import { AccountPageComponent } from './pages/account-page/account-page.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { FooterComponent } from './components/footer/footer.component';
import { LoadingButtonComponent } from './components/loading-button/loading-button.component';


import { MdbModalModule } from 'mdb-angular-ui-kit/modal';

import { MatFormFieldModule, MatLabel } from '@angular/material/form-field';
import { AdBannerComponent } from './components/ad-banner/ad-banner.component';
import { LiveEventsComponent } from './components/live-events/live-events.component';
import { EventCategoriesComponent } from './components/event-categories/event-categories.component';
import { EventsListComponent } from './components/events-list/events-list.component';
import { CreateBasicInfoComponent } from './pages/create-event/create-basic-info/create-basic-info.component';
import { CreateEventDetailsComponent } from './pages/create-event/create-event-details/create-event-details.component';
import { CreateEventSchedulesComponent } from './pages/create-event/create-event-schedules/create-event-schedules.component';
import { CreateEventTicketingComponent } from './pages/create-event/create-event-ticketing/create-event-ticketing.component';
import { CreateEventPublishComponent } from './pages/create-event/create-event-publish/create-event-publish.component';
import { EmailConfirmedComponent } from './pages/user-auth/email-confirmed/email-confirmed.component';
import { EmailInvalidComponent } from './pages/user-auth/email-invalid/email-invalid.component';
import { PhoneAuthenticationComponent } from './pages/user-auth/phone-authentication/phone-authentication.component';
import { RecoveryEmailComponent } from './pages/user-auth/recovery-email/recovery-email.component';
import { PasswordResetComponent } from './pages/user-auth/password-reset/password-reset.component';
import { UserProfilePageComponent } from './pages/profile/user-profile-page/user-profile-page.component';
import { OrganizationProfilePageComponent } from './pages/profile/organization-profile-page/organization-profile-page.component';
import { AccountSideMenuComponent } from './components/account-side-menu/account-side-menu.component';
import { CreateEventOrganizersComponent } from './pages/create-event/create-event-organizers/create-event-organizers.component';
import { CreateEventSponsorsComponent } from './pages/create-event/create-event-sponsors/create-event-sponsors.component';
import { CreateEventSpeakersComponent } from './pages/create-event/create-event-speakers/create-event-speakers.component';
import { CreateEventMediaComponent } from './pages/create-event/create-event-media/create-event-media.component';
import { FormSidePaneComponent } from './components/auth-forms/form-side-pane/form-side-pane.component';
import { FormHeaderComponent } from './components/auth-forms/form-header/form-header.component';
import { FormFooterComponent } from './components/auth-forms/form-footer/form-footer.component';
import { CreateEventSideMenuComponent } from './components/create-event-side-menu/create-event-side-menu.component';
import { CreateEventNavbarComponent } from './components/create-event-navbar/create-event-navbar.component';
import { SideMenuToggleComponent } from './components/side-menu-toggle/side-menu-toggle.component';
import { EditBasicInfoComponent } from './pages/edit-event/edit-basic-info/edit-basic-info.component';
import { EditEventDetailsComponent } from './pages/edit-event/edit-event-details/edit-event-details.component';
import { EditEventMediaComponent } from './pages/edit-event/edit-event-media/edit-event-media.component';
import { EditEventOrganizersComponent } from './pages/edit-event/edit-event-organizers/edit-event-organizers.component';
import { EditEventSchedulesComponent } from './pages/edit-event/edit-event-schedules/edit-event-schedules.component';
import { EditEventSpeakersComponent } from './pages/edit-event/edit-event-speakers/edit-event-speakers.component';
import { EditEventSponsorsComponent } from './pages/edit-event/edit-event-sponsors/edit-event-sponsors.component';
import { EditEventTicketingComponent } from './pages/edit-event/edit-event-ticketing/edit-event-ticketing.component';
import { EventsListPageComponent } from './pages/events-list-page/events-list-page.component';
import { UserEventsComponent } from './pages/user-events/user-events.component';
import { SignupEmailComponent } from './pages/user-auth/signup-email/signup-email.component';
import { SignupMoreInfoComponent } from './pages/user-auth/signup-more-info/signup-more-info.component';
import { HappeningNowComponent } from './pages/happening-now/happening-now.component';
import { LearnMoreComponent } from './pages/learn-more/learn-more.component';
import { LiveEventsPageComponent } from './components/live-events-page/live-events-page.component';
import { UpcomingEventsComponent } from './components/upcoming-events/upcoming-events.component';
import { UpcomingEventsPageComponent } from './pages/upcoming-events-page/upcoming-events-page.component';
import { PopularEventsPageComponent } from './pages/popular-events-page/popular-events-page.component';
import { NewEventsPageComponent } from './pages/new-events-page/new-events-page.component';
import { NewEventsComponent } from './components/new-events/new-events.component';
import { PopularEventsComponent } from './components/popular-events/popular-events.component';
import { GooglePlaceModule } from "ngx-google-places-autocomplete";
import { HelpContentsComponent } from './components/help-contents/help-contents.component';
import { HelpPageComponent } from './pages/help-page/help-page.component';
import { HelpNavbarComponent } from './components/help-navbar/help-navbar.component';
import { SearchResultsComponent } from './pages/search-results/search-results.component';
import { PreviewEventPageComponent } from './pages/preview-event-page/preview-event-page.component';
import { PreviewHeaderComponent } from './components/preview-event/preview-header/preview-header.component';
import { PreviewDetailsComponent } from './components/preview-event/preview-details/preview-details.component';
import { PreviewScheduleComponent } from './components/preview-event/preview-schedule/preview-schedule.component';
import { PreviewPricingComponent } from './components/preview-event/preview-pricing/preview-pricing.component';
import { PreviewSpeakersComponent } from './components/preview-event/preview-speakers/preview-speakers.component';
import { PreviewOrganizersComponent } from './components/preview-event/preview-organizers/preview-organizers.component';
import { PreviewGalleryComponent } from './components/preview-event/preview-gallery/preview-gallery.component';
import { PreviewSponsorsComponent } from './components/preview-event/preview-sponsors/preview-sponsors.component';
import { PreviewLocationComponent } from './components/preview-event/preview-location/preview-location.component';
import { PreviewBannerComponent } from './components/preview-event/preview-banner/preview-banner.component';
import { RecoveryInvalidComponent } from './pages/user-auth/recovery-invalid/recovery-invalid.component';
import { GoogleMagiclinkComponent } from './pages/user-auth/google-magiclink/google-magiclink.component';
import { FacebookMagiclinkComponent } from './pages/user-auth/facebook-magiclink/facebook-magiclink.component';
import { MagiclinkSuccessComponent } from './pages/user-auth/magiclink-success/magiclink-success.component';
import { MagiclinkInvalidComponent } from './pages/user-auth/magiclink-invalid/magiclink-invalid.component';
import { AccountProfileComponent } from './pages/profile/account-profile/account-profile.component';
import { AccountSettingsComponent } from './pages/profile/account-settings/account-settings.component';
import { SocialShareModalComponent } from './components/social-share-modal/social-share-modal.component';
import { PreviewOrganizerModalComponent } from './components/preview-event/preview-organizer-modal/preview-organizer-modal.component';
import { PreviewSpeakerModalComponent } from './components/preview-event/preview-speaker-modal/preview-speaker-modal.component';
import { PreviewGalleryModalComponent } from './components/preview-event/preview-gallery-modal/preview-gallery-modal.component';
import { FavoritePageComponent } from './pages/favorites-page/favorite-page.component';
import { FavoritesComponentComponent } from './components/favorites-component/favorites-component.component';
import { EventsByCategoryComponent } from './components/events-by-category/events-by-category.component';
import { CategoryEventsPageComponent } from './pages/category-events-page/category-events-page.component';
import { PreviewMinimisedSpeakersComponent } from './components/preview-event/preview-minimised-speakers/preview-minimised-speakers.component';
import { PreviewMinimisedOrganizersComponent } from './components/preview-event/preview-minimised-organizers/preview-minimised-organizers.component';
import { PreviewMinimisedSponsorsComponent } from './components/preview-event/preview-minimised-sponsors/preview-minimised-sponsors.component';
import { PreviewMinimisedPricingComponent } from './components/preview-event/preview-minimised-pricing/preview-minimised-pricing.component';
import { PreviewMinimisedDescriptionComponent } from './components/preview-event/preview-minimised-description/preview-minimised-description.component';
import { PreviewMinimisedLocationComponent } from './components/preview-event/preview-minimised-location/preview-minimised-location.component';
import { GoogleMapsModule } from '@angular/google-maps';
import { CancelEventAlertComponent } from './components/modals/cancel-event-alert/cancel-event-alert.component';
import { EditEventAlertComponent } from './components/modals/edit-event-alert/edit-event-alert.component';
import { DeleteEventAlertComponent } from './components/modals/delete-event-alert/delete-event-alert.component';
import { RecoverEventAlertComponent } from './components/modals/recover-event-alert/recover-event-alert.component';


@NgModule({
  declarations: [
    AppComponent,
    HomePageComponent,
    LoginPageComponent,
    SignupPageComponent,
    DiscoverPageComponent,
    SettingsPageComponent,
    AccountPageComponent,
    NavbarComponent,
    FooterComponent,
    AdBannerComponent,
    LiveEventsComponent,
    EventCategoriesComponent,
    EventsListComponent,
    CreateBasicInfoComponent,
    CreateEventDetailsComponent,
    CreateEventSchedulesComponent,
    CreateEventTicketingComponent,
    CreateEventPublishComponent,
    LoadingButtonComponent,
    EmailConfirmedComponent,
    EmailInvalidComponent,
    PhoneAuthenticationComponent,
    RecoveryEmailComponent,
    PasswordResetComponent,
    UserProfilePageComponent,
    OrganizationProfilePageComponent,
    AccountSideMenuComponent,
    CreateEventOrganizersComponent,
    CreateEventSponsorsComponent,
    CreateEventSpeakersComponent,
    CreateEventMediaComponent,
    FormSidePaneComponent,
    FormHeaderComponent,
    FormFooterComponent,
    CreateEventSideMenuComponent,
    CreateEventNavbarComponent,
    SideMenuToggleComponent,
    EditBasicInfoComponent,
    EditEventDetailsComponent,
    EditEventMediaComponent,
    EditEventOrganizersComponent,
    EditEventSchedulesComponent,
    EditEventSpeakersComponent,
    EditEventSponsorsComponent,
    EditEventTicketingComponent,
    EventsListPageComponent,
    UserEventsComponent,
    SignupEmailComponent,
    SignupMoreInfoComponent,
    HappeningNowComponent,
    LearnMoreComponent,
    LiveEventsPageComponent,
    UpcomingEventsComponent,
    UpcomingEventsPageComponent,
    PopularEventsPageComponent,
    NewEventsPageComponent,
    NewEventsComponent,
    PopularEventsComponent,
    HelpContentsComponent,
    HelpPageComponent,
    HelpNavbarComponent,
    SearchResultsComponent,
    PreviewEventPageComponent,
    PreviewHeaderComponent,
    PreviewDetailsComponent,
    PreviewScheduleComponent,
    PreviewPricingComponent,
    PreviewSpeakersComponent,
    PreviewOrganizersComponent,
    PreviewGalleryComponent,
    PreviewSponsorsComponent,
    PreviewLocationComponent,
    PreviewBannerComponent,
    RecoveryInvalidComponent,
    GoogleMagiclinkComponent,
    FacebookMagiclinkComponent,
    MagiclinkSuccessComponent,
    MagiclinkInvalidComponent,
    AccountProfileComponent,
    AccountSettingsComponent,
    SocialShareModalComponent,
    PreviewOrganizerModalComponent,
    PreviewSpeakerModalComponent,
    PreviewGalleryModalComponent,
    FavoritePageComponent,
    FavoritesComponentComponent,
    EventsByCategoryComponent,
    CategoryEventsPageComponent,
    PreviewMinimisedSpeakersComponent,
    PreviewMinimisedOrganizersComponent,
    PreviewMinimisedSponsorsComponent,
    PreviewMinimisedPricingComponent,
    PreviewMinimisedDescriptionComponent,
    PreviewMinimisedLocationComponent,
    CancelEventAlertComponent,
    EditEventAlertComponent,
    DeleteEventAlertComponent,
    RecoverEventAlertComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    ClipboardModule,
    MatDialogModule,
    MatInputModule,
    MatCheckboxModule,
    MatButtonModule,
    MatDatepickerModule,
    MatSelectModule,
    MatNativeDateModule,
    MatStepperModule,
    MatSnackBarModule,
    MatFormFieldModule,
    MatAutocompleteModule,
    FormsModule,
    ReactiveFormsModule,
    OwlModule,
    NgbModule,
    OwlDateTimeModule,
    OwlNativeDateTimeModule,
    GooglePlaceModule,
    TimeagoModule.forRoot(),
    MdbModalModule,
    GoogleMapsModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ]
})
export class AppModule { }
