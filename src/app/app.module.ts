import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { EditPatientComponent } from './pages/edit-patient.component';


@NgModule({
  declarations: [
    EditPatientComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule 
  ]
})
export class EditPatientModule { } 
