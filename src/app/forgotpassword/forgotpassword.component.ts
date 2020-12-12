import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-forgotpassword',
  templateUrl: './forgotpassword.component.html',
  styleUrls: ['./forgotpassword.component.css']
})
export class ForgotpasswordComponent implements OnInit {

  sendusermail: boolean = true;
  chkotp: boolean = false;
  createnewpwd: boolean = false;

  // timeinsec: any = 120;

  constructor(private ds: DataService, private route: Router) { }

  ngOnInit() {
    setTimeout(() => {
      this.chkotp = false;
      this.sendusermail = true;
    }, 120000);
  }


  checkmail(q) {
    this.ds.forgot(q).subscribe(getotp => {
      if (getotp['message'] == 'otp sent') {
        alert('otp sent')
        this.sendusermail = false;
        this.chkotp = true;
      }
      else{
        alert('enter valid email')
        this.sendusermail = true;
        this.chkotp = false;
      }
    })

  }

  checkOtp(i2) {
    this.ds.checkotp(i2).subscribe(verify => {
      alert(verify['message'])
    })
    this.chkotp = false;
    this.createnewpwd = true;

  }

  updatepwd(z) {
    if (z.pwd == z.pwd0) {
      this.ds.changepwd(z).subscribe(allset => {
        alert(allset["message"])
        this.createnewpwd = false;
        this.route.navigate(['/login'])

      })
    }
    else {
      alert("please enter same password")
    }
  }



  // tim = setTimeout(() => {
  //   this.countdown();
  // }, 1000);


  // countdown() {
  //   let minutes: string | number = Math.floor(this.timeinsec / 60);
  //   let seconds: string | number = this.timeinsec % 60;

  //   if (this.timeinsec > 0) {
  //     seconds = seconds < 10 ? '0' + seconds : seconds;
  //     minutes = minutes < 10 ? '0' + minutes : minutes;

  //     document.getElementById('timer').innerHTML = ` ${minutes}:${seconds}`;
  //     this.timeinsec--;

  //     this.tim = setTimeout(() => {
  //       this.countdown();
  //     }, 1000);
  //   }
  //   else {
  //     if (this.timeinsec == 0) {
  //       seconds = seconds < 10 ? '0' + seconds : seconds;
  //       minutes = minutes < 10 ? '0' + minutes : minutes;

  //       document.getElementById('timer').innerHTML = `${minutes}:${seconds}`;
  //       alert("time up")
  //       this.sendusermail= true;
  //       this.chkotp = false;
  //     }
  //   }

  // }



}
