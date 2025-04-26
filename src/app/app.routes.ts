import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { PatientsComponent } from './pages/patients.component'; 
import { PatientDetailComponent } from './pages/patient-detail.component'; 
import { AddPatientComponent } from './pages/add-patient.component';

export const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'patients', component: PatientsComponent },
  { path: 'patients/:id', component: PatientDetailComponent },
  { path: 'add-patient', component: AddPatientComponent } 

];
