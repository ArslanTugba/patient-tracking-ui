import { Component } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-add-patient',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './add-patient.component.html',
})
export class AddPatientComponent {
  patientForm: any;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router
  ) {
    // ✅ Artık fb hazır ve kullanılabilir
    this.patientForm = this.fb.group({
      name: ['', Validators.required],
      surname: ['', Validators.required],
      birthDate: ['', Validators.required],
    });
  }

  onSubmit() {
    if (this.patientForm.invalid) return;

    this.http.post('https://localhost:44341/api/patient', this.patientForm.value)
      .subscribe({
        next: () => {
          alert('Patient added successfully!');
          this.router.navigate(['/patients']);
        },
        error: (err) => {
          console.error('Ekleme hatası:', err);
          alert('Failed to add patient.');
        }
      });
  }
}
