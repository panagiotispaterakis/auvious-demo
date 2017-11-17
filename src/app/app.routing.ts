import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './home.component';
import { RegisterComponent } from './register.component';
import { PhoneComponent } from './phone.component';
import { ConferenceComponent } from './conference.component';
import { DebugComponent } from './debug.component';
import { RecordingsComponent } from './recordings.component';

const routes: Routes = [
    { path: '', redirectTo: 'home', pathMatch: 'full' },
    { path: 'debug', component: DebugComponent },
    { path: 'home', component: HomeComponent },
    { path: 'register', component: RegisterComponent },
    { path: 'phone', component: PhoneComponent },
    { path: 'conference/:username/:id', component: ConferenceComponent },
    { path: 'conference/:id', component: ConferenceComponent },
    { path: 'recordings', component: RecordingsComponent },
    { path: '**', redirectTo: 'home' }
];

@NgModule({
    imports: [ RouterModule.forRoot(routes) ],
    exports: [ RouterModule ]
})
export class AppRoutingModule {}
