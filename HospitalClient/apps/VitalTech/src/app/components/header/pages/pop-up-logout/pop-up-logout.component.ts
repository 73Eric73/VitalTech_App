import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { OidcSecurityService } from 'angular-auth-oidc-client';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-pop-up-logout',
  standalone: true,
  imports: [],
  templateUrl: './pop-up-logout.component.html',
  styleUrl: './pop-up-logout.component.css',
})
export class PopUpLogoutComponent {
  private readonly oidcSecurityService = inject(OidcSecurityService);
  private readonly https = inject(HttpClient);
  isAuthenticated = false;
  nom = '';

  constructor() {
    this.nom = this.getCookie("name");
  }

  onLogout(): void {
    this.oidcSecurityService.logoff().subscribe((result) => {
      console.log(result);
      // Limpiar la sesión al cerrar sesión
      document.cookie = "name=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    });
  }

  getCookie(name: string) {
    const cookies = document.cookie.split('; '); // Divide todas las cookies por "; "
    for (let i = 0; i < cookies.length; i++) {
      const [key, value] = cookies[i].split('='); // Divide cada cookie en clave y valor
      if (key === name) {
        return value; // Retorna el valor si coincide con el nombre
      }
    }
    return ""; // Retorna null si no encuentra la cookie
  }

}
