import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'

import { AdminRoutingModule } from './admin-routing.module';
import { AdmindashboardComponent } from './admindashboard/admindashboard.component';
import { AttendenceComponent } from './attendence/attendence.component';
import { MarksComponent } from './marks/marks.component';
import { FeeComponent } from './fee/fee.component';
import { RegistrationComponent } from './registration/registration.component';
import { BatchesComponent } from './batches/batches.component';
import { from } from 'rxjs';
import { AdminprofileComponent } from './adminprofile/adminprofile.component';
import { SearchPipe } from './search.pipe';
import {NgxPaginationModule} from 'ngx-pagination'



@NgModule({
  declarations: [AdmindashboardComponent, AttendenceComponent, MarksComponent, FeeComponent, 
    RegistrationComponent, BatchesComponent, AdminprofileComponent, SearchPipe],
  imports: [
    CommonModule,
    AdminRoutingModule, FormsModule,NgxPaginationModule
  ]
})
export class AdminModule { }
