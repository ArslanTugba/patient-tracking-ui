import { Component } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms'; 
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-add-patient',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, CommonModule], 
  templateUrl: './add-patient.component.html',
})
export class AddPatientComponent {
  patientForm: any;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router
  ) {

    this.patientForm = this.fb.group({
      name: ['', Validators.required],
      surname: ['', Validators.required],
      birthDate: ['', Validators.required],
      comment: ['', Validators.required],
    });
  }

  onSubmit() {
    if (this.patientForm.invalid) return;

    const patientData = {
      name: this.patientForm.value.name,
      surname: this.patientForm.value.surname,
      birthDate: this.patientForm.value.birthDate,
      comment: this.patientForm.value.comment,
    };

    this.http.post('https://localhost:44341/api/patient', patientData)
      .subscribe({
        next: () => {
          alert('Patient added successfully!');
          this.router.navigate(['/patients']);
        },
        error: (err) => {
          console.error('Insertion error:', err);
          alert('Failed to add patient.');
        }
      });
  }
}