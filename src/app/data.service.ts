import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';

import { Observable,throwError } from 'rxjs';
import { catchError} from 'rxjs/operators'

@Injectable({
  providedIn: 'root'
})
export class DataService {

  disp: string;

  // userloginstatus: boolean = false;

  sdetail: any;

  stid: string;

  constructor(private hc: HttpClient,private router:Router) { }

  display() {
    return this.disp
  }

  display2() {
    return this.sdetail
  }

  display3() {
    return this.stid;
  }

  post(x): Observable<any> {
    console.log(x)
    return this.hc.post('/admin/register', x)
  }

  get(bn): Observable<any> {
    return this.hc.get('/admin/readAll/' + bn)
  }

  delete(y): Observable<any> {
    return this.hc.delete(`/admin/remove/${y}`)
  }

  editData(z): Observable<any> {
    return this.hc.put('/admin/update', z)
  }

  /////////////////////////////////////////////////

  addBatch(h): Observable<any> {
    return this.hc.post('/admin/addbatch', h)
  }

  //to get all batch details
  getBatchAll(): Observable<any> {
    return this.hc.get<any>('/admin/getAll')
  }

  removeBatch(j): Observable<any> {
    return this.hc.delete(`/admin/removebth/${j}`)
  }

  // login status
  loggedIn(){
    return !!localStorage.getItem('token');
  }

  //login related requests
  logout() {
    localStorage.removeItem('token')
    this.router.navigate(['/login'])
  }

  login(x1): Observable<any> {
    return this.hc.post('/admin/login', x1)
  }


  /////////////////////////////////////////////////


  //file upload
  setAttendence(data): Observable<any> {
    return this.hc.post('/admin/uploadattendence', data)
  }

  //get attendence
  getAttendence(): Observable<any> {
    return this.hc.get('/admin/getAttendence')
  }

  updatebatch(u): Observable<any> {
    return this.hc.put('/admin/updatebch', u)
  }

  //////////////////////////////////////////////////

  //fileupload
  setMarks(m): Observable<any> {
    return this.hc.post('/admin/uploadmarks', m)
  }

  getMarks(): Observable<any> {
    return this.hc.get('/admin/bthmarks')
  }

  stdattd(k): Observable<any> {
    return this.hc.get(`/user/readattd/${k}`)
  }

  stdmarks(g): Observable<any> {
    return this.hc.get(`/user/readmarks/${g}`)
  }

  getprofile(x2): Observable<any> {
    return this.hc.get(`/user/userdetails/${x2}`)
  }

  //forgotpassword requests
  forgot(q): Observable<any> {
    return this.hc.post('/user/forgotpassword', q)
  }

  checkotp(i2):Observable<any>{
    return this.hc.post('/user/verifyotp',i2)
  }

  changepwd(j2):Observable<any>{
    console.log(j2)
    return this.hc.put('/user/changepassword',j2)
  }

  //fees request
  addFees(f):Observable<any>{
    return this.hc.post('/admin/addfees',f)
  }

  getfees():Observable<any>{
    return this.hc.get('/admin/getfees')
  }

  getfeelist(id):Observable<any>{
    return this.hc.get(`/admin/getfeelist/${id}`).pipe(catchError(this.errorHandler))
  }

  errorHandler(error:HttpErrorResponse){
    return throwError(error);
  }

  removefess(delfee):Observable<any>{
    return this.hc.delete(`/admin/removefeedetls/${delfee}`)
  }

}
