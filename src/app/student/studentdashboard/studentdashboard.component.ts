import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/data.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-studentdashboard',
  templateUrl: './studentdashboard.component.html',
  styleUrls: ['./studentdashboard.component.css']
})
export class StudentdashboardComponent implements OnInit {
  // sID:string;

  constructor(private ds:DataService,private ar:ActivatedRoute) { }

  ngOnInit() {
    this.ar.paramMap.subscribe(param=>{
      this.ds.stid=param.get('sID')
      // this.ds.userloginstatus = true;
      // this.ds.tkn=param.get('token')
    })
  }

}
