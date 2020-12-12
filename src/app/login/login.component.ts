import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from '../data.service';
import { Message } from '@angular/compiler/src/i18n/i18n_ast';
import { Token } from '@angular/compiler/src/ml_parser/lexer';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  hide:boolean=true;

  faketoken:string;

  sID: any;
  // foradmin:boolean=true;
  // forstd:boolean=false;
  // token:any;

  constructor(private route: Router, private ds: DataService) { }

  ngOnInit() { 
    setTimeout(() => {
      this.ds.logout();
    }, 0);
  }

  shpwd(){
    this.hide = !this.hide;
  }


  method(x1) {
    this.ds.login(x1).subscribe(logdet => {
      this.sID = logdet['userid']
      // this.token=logdet['token']

      if (x1.role == 'admin') {
        if (logdet['message'] == 'invalid id') {
          alert('please check your userID')
        }
        else if (logdet['message'] == 'invalid password') {
          alert('please enter valid password')
        }
        else {
          alert('login successful')
          this.faketoken='xx.yy.zz'
          // this.ds.userloginstatus = true;
          localStorage.setItem('token', (this.faketoken))
          this.route.navigate(['/admindashboard/adminprofile'])
        }
      }

      //  else if(x1.role==logdet['message'].role)
      else if (x1.role == 'student') {
        if (logdet['message'] == 'invalid email') {
          alert('please check your userID')
        }
        else if (logdet['message'] == 'invalid password') {
          alert('please enter valid password')
        }
        else {
          alert('login successful')
          // this.ds.userloginstatus = true;
          localStorage.setItem('token', (logdet['token']))
          this.route.navigate([`/studentdashboard/${this.sID}/studentprofile`])
        }
      }
      else {
        alert('please select your role')
      }
    })

  }

}
