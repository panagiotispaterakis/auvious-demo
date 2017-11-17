import { Component } from '@angular/core';

import { Auth } from './auth.service';
import { SipService } from './sip.service';
import { StateService } from './state.service';
import { RecorderService } from './recorder.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [
    Auth,
    SipService,
    StateService,
    RecorderService
  ]
})
export class AppComponent {
  title = 'WebRTC JsSIP Demo';
}

