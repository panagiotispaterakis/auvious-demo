import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { APP_BASE_HREF } from '@angular/common';

import { AppComponent } from './app.component';
import { HomeComponent } from './home.component';
import { RegisterComponent } from './register.component';
import { PhoneComponent } from './phone.component';
import { ConferenceComponent } from './conference.component';
import { DebugComponent } from './debug.component';
import { RecordingsComponent } from './recordings.component';

import { AppRoutingModule } from './app.routing';

@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule
  ],
  declarations: [
    AppComponent,
    HomeComponent,
    RegisterComponent,
    PhoneComponent,
    ConferenceComponent,
    DebugComponent,
    RecordingsComponent
  ],
  providers: [{ provide: APP_BASE_HREF, useValue: '/' }],
  bootstrap: [AppComponent]
})
export class AppModule { }
