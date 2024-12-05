import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterLinkActive, RouterLink, Router } from '@angular/router';
import { OidcSecurityService } from 'angular-auth-oidc-client';
import { PopUpLogoutComponent } from './pages/pop-up-logout/pop-up-logout.component';
import { MatDialog } from '@angular/material/dialog';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, CommonModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent {
  private readonly oidcSecurityService = inject(OidcSecurityService);
  private readonly https = inject(HttpClient);
  isAuthenticated = false;
  nom = '';

  constructor(private router: Router, public dialog: MatDialog) { }

  ngOnInit() {
    this.oidcSecurityService
      .checkAuth()
      .subscribe(({ isAuthenticated, userData }) => {
        this.isAuthenticated = isAuthenticated;
        if (isAuthenticated) {
          this.nom = userData?.name || '';

          // Guardar el nombre en la sesión
          this.setCookie("", "name", this.nom, 1);
        } else {
          this.nom = '';
        }
      });
  }

  onLogin(): void {
    this.oidcSecurityService.authorize();
  }

  openDialog(): void {
    this.dialog.open(PopUpLogoutComponent, {
      width: 'auto',
      height: 'auto',
    });
  }

  setCookie(path: string, name: string, value: string, days: number) {
    const date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000)); // Convertir días a milisegundos
    const expires = "expires=" + date.toUTCString();
    document.cookie = `${name}=${value}; ${expires}; SameSite=None; Secure; path=/${path}`;
  }

}
