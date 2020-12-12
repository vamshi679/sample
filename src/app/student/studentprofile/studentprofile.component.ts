import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/data.service';
import { Router } from '@angular/router';
// import { NgxSpinnerService } from "ngx-spinner";
// ,private spinner: NgxSpinnerService

@Component({
  selector: 'app-studentprofile',
  templateUrl: './studentprofile.component.html',
  styleUrls: ['./studentprofile.component.css']
})
export class StudentprofileComponent implements OnInit {

  sdetails: any = [];
  display: boolean = false;
  stuserid: string;
  hide: any;

  value1: string;
  value2: string;
  value3: string;

  constructor(private ds: DataService, private route: Router) { }

  ngOnInit() {
    // /** spinner starts on init */
    // this.spinner.show();

    // setTimeout(() => {
    //   /** spinner ends after 5 seconds */
    //   this.spinner.hide();
    // }, 3000);
    // this.sdetails.push(this.ds.display2());

    this.stuserid = this.ds.display3();
    this.ds.getprofile(this.stuserid).subscribe(sd => {
      this.sdetails.push(sd['message'])
      //sending to details component thru service
      this.ds.sdetail = sd['message']
      this.display = true

      if (this.sdetails[0].angular == true) {
        this.value1 = 'selected'
      }
      else if (this.sdetails[0].angular == "") {
        this.value1 = 'not selected'
      }

      if (this.sdetails[0].nodejs == true) {
        this.value2 = 'selected'
      }
      else if (this.sdetails[0].nodejs == "") {
        this.value2 = 'not selected '
      }

      if (this.sdetails[0].python == true) {
        this.value3 = 'selected'
      }
      else if (this.sdetails[0].python == "") {
        this.value3 = 'not selected'
      }
    })

  }

  showhide() {
    this.hide = !this.hide;
  }

  updatepic(p) {
    alert('oops this feature is not available right now')
  }

  updatepwd(p) {
    console.log(p)
    if (p.pwd == p.pwd0) {
      this.ds.changepwd(p).subscribe(Response => {
        alert(Response["message"])
        // this.route.navigate(['/login'])
      })
    }
    else {
      alert("please enter same password")
    }
  }


}
