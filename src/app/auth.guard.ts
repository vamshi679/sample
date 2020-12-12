import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { DataService } from './data.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private ds:DataService,private router:Router){}
  
  canActivate():boolean{
    if(this.ds.loggedIn()){
      return true
    }
    else{
      this.router.navigate(['/login'])
      return false
    }
  }
}
