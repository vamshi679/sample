import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/data.service';

@Component({
  selector: 'app-fee',
  templateUrl: './fee.component.html',
  styleUrls: ['./fee.component.css']
})
export class FeeComponent implements OnInit {

  feesArray: any;
  paymentslist: any;
  listlength:number;
  updateArray: any = [];
  paymentStatus:any;

  constructor(private ds: DataService) { }

  ngOnInit() {
    this.ds.getfees().subscribe(feesdets => {
      this.feesArray = feesdets['message']
      if (feesdets['message'] == 'no details found') {
        alert('no data found')
      }
    })
  }

  addfeedetails(f) {
    console.log(f)
    if (f.payment >= f.totalfee) {
      alert('please fill details properly')
    }
    else {
      this.ds.addFees(f).subscribe(Response => {
        this.ngOnInit();
        alert(Response['message'])
      })
    }
  }

  update(u) {
    this.updateArray = u;
  }

  checkData(dlf) {
    this.ds.removefess(dlf).subscribe(Response1 => {
      this.ngOnInit();
      alert(Response1['message'])
    })
  }

  getfeelist(id) {
    this.ds.getfeelist(id).subscribe(listArray => {
      this.paymentslist = listArray['message']
      this.listlength=this.paymentslist.length
      if(this.paymentslist.balance==0){
        this.paymentStatus="Total fee cleared"
      }
      else{
        this.paymentStatus="fee pending...."
      }
      if (listArray['message'] == 'no details found') {
        alert('no data found')
      }
    })
  }

}
