import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { Auth } from './auth.service';

@Component({
  selector: 'home',
  templateUrl: './home.component.html'
})
export class HomeComponent {
  title = 'Home Component';

  constructor(private auth: Auth, private router: Router) { }

  public authenticated(): boolean {
    return this.auth.authenticated();
  }
}
