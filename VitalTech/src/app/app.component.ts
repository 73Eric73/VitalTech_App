import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavComponent } from './components/nav/nav.component';
import { HeaderComponent } from './components/header/header.component';
import { KeycloakService } from 'keycloak-angular';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet, 
    NavComponent, 
    HeaderComponent
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'VitalTech';
  isLoggedIn = false;
  username = '';

  constructor(private keycloakService: KeycloakService) {}

  async ngOnInit() {
    this.isLoggedIn = await this.keycloakService.isLoggedIn();
    if (this.isLoggedIn) {
      const userDetails = await this.keycloakService.loadUserProfile();
      this.username = userDetails.username;
    }
  }

  logout() {
    this.keycloakService.logout();
  }
}