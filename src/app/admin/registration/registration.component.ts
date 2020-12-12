import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/data.service';
import { log } from 'util';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent implements OnInit {

  constructor(private ds:DataService) { }
  bdisp:string;
  stdarray:any;
  updatedata:any=[];
  
  searchterm:string;

  ngOnInit()
  {
    this.bdisp=this.ds.display();

    //get data
    this.ds.get(this.bdisp).subscribe(b=>{
      if(b['message']=='no std data found')
      {
        alert('no student data found')
      }
      else
      {
        this.stdarray=b['message']
        console.log(this.stdarray)
      }
    })   

  }
  

  sendData(x)
  {
    var a1=confirm('do you want to register student')
    if(a1==true)
    {
      this.ds.post(x).subscribe(a=>{
      alert(a['message'])
      this.ngOnInit();
    })
    }
    else
    {
      this.ngOnInit();
    }
  }


  removeData(y)
  {
    var a=confirm('do you really want to delete')
    if(a==true)
    {
      this.ds.delete(y).subscribe(c=>{
        if(c['message']=='no data found to delete')
        {
          alert(c['message'])
        }
        else(c['message']=='data deleted success')
        {
          alert('data deleted')
          this.ngOnInit();
        }
      })
    }
    else
    {
      this.ngOnInit();
    }
  }


  update(i)
  {
    this.updatedata=i
  }
  
  editData(u)
  {
    this.ds.editData(u).subscribe(d=>{
      alert(d['message'])
      this.ngOnInit();
    })
  }



}
