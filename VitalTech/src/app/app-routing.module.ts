import { NgModule } from '@angular/core';
import { ActivatedRouteSnapshot, Router, RouterModule, RouterStateSnapshot, Routes, UrlTree } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { KeycloakAuthGuard, KeycloakService } from 'keycloak-angular';

export function tokenGetter() {
  return localStorage.getItem('token');
}

class AppAuthGuard extends KeycloakAuthGuard {
  override isAccessAllowed(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean | UrlTree> {
    throw new Error('Method not implemented.');
  }
  constructor(protected override router: Router, protected keycloak: KeycloakService){
    super(router, keycloak);
  }

  async isAccessAlloewd(): Promise<boolean> {
    if(!this.authenticated){
      this.router.navigate(['']);
      return false;
    }

    const requiredRoles = ['user'];
    return requiredRoles.every(role => this.roles.includes(role));
  }
}



export const routes: Routes = [
  {path: 'inicio', loadChildren: ()=> import('./modules/inicio/inicio.module').then(m => m.InicioModule)},
  {path: '', redirectTo: 'login', pathMatch: 'full'},
  {path: '**', redirectTo: 'login', pathMatch: 'full'},
  {path: 'login', component: LoginComponent},
  {path: 'protected', component: LoginComponent, canActivate: [AppAuthGuard] },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
