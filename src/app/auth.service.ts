import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable()
export class Auth {
    constructor(private router: Router) { }

    public authenticated(): boolean {
        return localStorage.getItem('authenticated') === 'true';
    }

    public login(): void {
        localStorage.setItem('authenticated', 'true');
        this.router.navigate(['/dashboard']);
    }

    public logout(): void {
        localStorage.removeItem('authenticated');
        this.router.navigate(['/home']);
    }
}
