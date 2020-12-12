import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from 'src/app/data.service';

@Component({
  selector: 'app-batches',
  templateUrl: './batches.component.html',
  styleUrls: ['./batches.component.css']
})
export class BatchesComponent implements OnInit {

  batchdetails:any;
  bdls:any;

  totalRecords:string;
  page:number=1;  

  constructor(private route:Router , private ds:DataService) {}

  ngOnInit() 
  {
    this.ds.getBatchAll().subscribe(bd=>{
      if(bd['message']=='no batches found')
      {
        alert(bd['message'])
      }
      else
      {
        this.batchdetails=bd['message']
        this.totalRecords=this.batchdetails.length
      }
    })
  }


  toRegister(d)
  {   
    this.ds.disp=d;
    
    this.route.navigate(['/admindashboard/register'])
  }


  //to get batch details by bno
  sendBatch(h)
  {
    this.ds.addBatch(h).subscribe(bdetails=>{
      if(bdetails['message']=='no batch details found')
      {
        alert(bdetails['message'])
      }
      else
      {
        this.bdls=bdetails['message']
        this.ngOnInit();
      }
    })
  }

  todelete(j)
  {
    
    this.ds.removeBatch(j).subscribe(j1=>{
      alert(j1['message'])
      this.ngOnInit();
    })
  }


}
