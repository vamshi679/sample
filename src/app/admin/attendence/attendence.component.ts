import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/data.service';
//pdf
import * as jsPDF from 'jspdf';
import 'jspdf-autotable';
//excel
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';


@Component({
  selector: 'app-attendence',
  templateUrl: './attendence.component.html',
  styleUrls: ['./attendence.component.css']
})
export class AttendenceComponent implements OnInit {

  file: File;
  attArray: any;
  attendence: any = [];
  
  totalRecords:string;
  page:number=1;

  constructor(private ds: DataService) { }

  ngOnInit() {
    //get attendence
    this.ds.getAttendence().subscribe(response => {
      //alert(response['message'])
      if (response['message'] == 'no details found') {
        alert('no data found')
      }
      else {
        this.attArray = response['message']
        this.totalRecords=this.attArray.length;
      }
    })
  }

  //downloading pdf 
  downloadPDF() {
    const doc = new jsPDF()
    var col = ["Batchno", "name", "date", "status"]
    var rows = [];
    this.attArray.forEach(element => {       
      let temp = [element.batchno, element.name, element.date, element.status]
      rows.push(temp)
    })
    doc.autoTable(col, rows, {
      theme: 'grid'
    })
    doc.save('attendence.pdf')
  }

  //downloading excel file

  // public downloadfile(){
  //   console.log('ooops...not working')
  // }

  // public downloadFile(): void {
  //   const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.attArray);
  //   const workbook: XLSX.WorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
  //   const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx',type:'array'});
  //   this.saveAsExcelFile(excelBuffer, 'excelFileName');
  // this.saveAsExcelFile(excelBuffer, 'excelFileName');
  // }

  // private saveAsExcelFile(buffer: any, fileName: string): void {
  //   const data: Blob = new Blob([buffer], { type: EXCEL_TYPE });
  //   FileSaver.saveAs(data, fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION);
  // }

  



  update(up) {
    this.attendence = up;
  }

  updatebatch(d) {
    console.log(d)
    this.ds.updatebatch(d).subscribe(ress => {
      alert(ress['message'])
      this.ngOnInit();
    })
  }




  fileUpload(filedata) {
    this.file = filedata.target.files[0];
  }

  uploadExcel(data) {
    console.log(typeof (data))
    let formdata = new FormData();
    formdata.append("file", this.file, this.file.name);
    this.ds.setAttendence(formdata).subscribe((res) => {
      if (res["message"] == "Attendence Sheet uploaded successfully") {
        alert(res["message"]);
        this.ngOnInit();
      }
      else if (res["err_desc"] == "Corupted excel file") {
        alert(res["err_desc"]);
      }

    });
  }

}