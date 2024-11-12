import { Component } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { KeycloakService } from 'keycloak-angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  title = 'VitalTech';
  authenticated = false;
  isUser = false;
  isAdmin = false;
  
  constructor(private readonly keycloak: KeycloakService) {}

  /*onLogin() {
    this.router.navigate(['/inicio']);
  }*/
    login() {
      this.keycloak.login()
    }
}
