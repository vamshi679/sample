import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/data.service';
//pdf
import * as jsPDF from 'jspdf';
import 'jspdf-autotable';

@Component({
  selector: 'app-studentdetails',
  templateUrl: './studentdetails.component.html',
  styleUrls: ['./studentdetails.component.css']
})
export class StudentdetailsComponent implements OnInit {
  stdarr: any = [];

  attendence: any;
  marks: any;
  feeDetails;any;
  listlength:number;
  paymentStatus:string;

  attd: any = [];
  mrks: any = [];

  constructor(private ds: DataService) { }

  ngOnInit() {
    this.stdarr.push(this.ds.display2())

    //attenedence
    this.ds.stdattd(this.stdarr[0].batch).subscribe(attdnce => {
      this.attendence = attdnce['message']
      for (let h of this.attendence) {
        if (h.name == this.stdarr[0].firstname) {
          this.attd.push(h);
        }
      }
    })

    //marks
    this.ds.stdmarks(this.stdarr[0].batch).subscribe(sdmarks => {
      this.marks = sdmarks['message']
      for (let i of this.marks) {
        if (i.studentname == this.stdarr[0].firstname) {
          this.mrks.push(i);
        }
      }
    })

    //fees
    this.ds.getfeelist(this.stdarr[0].imsid).subscribe(res=>{
      this.feeDetails=res['message']
      this.listlength=this.feeDetails.length
      if(this.feeDetails.balance==0){
        this.paymentStatus="Total fee cleared"
      }
      else{
        this.paymentStatus="fee pending...."
      }
      if (res['message'] == 'no details found') {
        alert('no data found')
      }
    })

  }

  

  //downloading pdf 
  downloadPDF() {
    const doc = new jsPDF()
    var col = ["Batchno", "name", "date", "status"]
    var rows = [];
    this.attd.forEach(element => {
      // let empid=element.empid;    
      // let evn=element.evn;    
      // let date=element.date;    
      // let cin=element.checkin;        
      let temp = [element.batchno, element.name, element.date, element.status]
      rows.push(temp)
    })
    doc.autoTable(col, rows, {
      theme: 'grid'
    })
    doc.save('attendence.pdf')
  }

  downloadPDF1() {
    const doc = new jsPDF()
    var col = ["Batchno", "studentname", "date", "aptitude", "communication", "technical"]
    var rows = [];
    this.mrks.forEach(element => {
      let temp = [element.batchno, element.studentname, element.date, element.aptitude, element.communication, element.technical]
      rows.push(temp)
    })
    doc.autoTable(col, rows, {
      theme: 'grid'
    })
    doc.save('marks.pdf')
  }

}
