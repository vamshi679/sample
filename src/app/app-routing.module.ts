import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { ContactusComponent } from './contactus/contactus.component';
import { AboutusComponent } from './aboutus/aboutus.component';
import { ForgotpasswordComponent } from './forgotpassword/forgotpassword.component';


const routes: Routes = [{ path: '', redirectTo: 'home', pathMatch: 'full' }, { path: 'login', component: LoginComponent },
{ path: 'home', component: HomeComponent }, { path: 'contactus', component: ContactusComponent },
{ path: 'aboutus', component: AboutusComponent }, { path: 'login/frgtpwd', component: ForgotpasswordComponent }];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
