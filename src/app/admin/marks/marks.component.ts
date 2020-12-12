import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/data.service';
//pdf
import * as jsPDF from 'jspdf';
import 'jspdf-autotable';

@Component({
  selector: 'app-marks',
  templateUrl: './marks.component.html',
  styleUrls: ['./marks.component.css']
})
export class MarksComponent implements OnInit {

  marksfile: File;
  marksArray: any;

  totalRecords:string;
  page:number=1;

  constructor(private ds: DataService) { }

  ngOnInit() {

    //get marks
    this.ds.getMarks().subscribe(respo => {
      if (respo['message'] == 'no details found') {
        alert('no data found')
      }
      else {
        this.marksArray = respo['message']
        this.totalRecords=this.marksArray.length;
      }
    })

  }

  //downloadfile
  // public downloadfile(){
  //   console.log('ooops...not working')
  // }


  //downloading pdf 
  downloadPDF() {
    const doc = new jsPDF()
    var col = ["Batchno", "name", "date", "aptitude", "communication", "technical"]
    var rows = [];
    this.marksArray.forEach(element => {

      let temp = [element.batchno, element.studentname, element.date, element.aptitude, element.communication, element.technical]
      rows.push(temp)
    })
    doc.autoTable(col, rows, {
      theme: 'grid'
    })
    doc.save('marks.pdf')
  }


  fileUpload(fdata) {
    this.marksfile = fdata.target.files[0];
  }


  uploadExcel1(data) {
    let formdata1 = new FormData();
    formdata1.append("file", this.marksfile, this.marksfile.name);

    this.ds.setMarks(formdata1).subscribe((res) => {
      if (res["message"] == "marks file uploaded") {
        alert(res["message"]);
        this.ngOnInit();
      }
      else if (res["err_desc"] == "Corupted excel file") {
        alert(res["err_desc"]);
      }

    });
  }




}
