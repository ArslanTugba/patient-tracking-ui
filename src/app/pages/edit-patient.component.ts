import { Component, OnInit, OnDestroy } from '@angular/core';  
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';  
import { HttpClient } from '@angular/common/http'; 
import { Subscription } from 'rxjs'; 

@Component({
  selector: 'app-edit-patient',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './edit-patient.component.html',
  styleUrls: ['./edit-patient.component.css']
})
export class EditPatientComponent implements OnInit, OnDestroy { 
  editPatientForm: FormGroup;
  patientId: string | null = null;
  private routeSub: Subscription | undefined; 
  patientData: any; 

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private http: HttpClient,
    private router: Router 
  ) {
    this.editPatientForm = this.fb.group({
      name: ['', Validators.required],
      surname: ['', Validators.required],
      birthDate: [''],
      comment: [''],
    });
  }

  ngOnInit(): void {
    this.routeSub = this.route.paramMap.subscribe(params => { 
      this.patientId = params.get('id');
      if (this.patientId) {
        this.getPatient(this.patientId); 
      }
    });
  }

  ngOnDestroy(): void { 
    if (this.routeSub) {
      this.routeSub.unsubscribe(); 
    }
  }

  getPatient(id: string): void {
    this.http.get(`https://localhost:44341/api/patient/${id}`)
      .subscribe({
        next: (data: any) => { 
          this.patientData = data;
          this.populateForm(); 
        },
        error: error => {
          console.error('Patient data not available:', error);
          
        }
      });
  }
  populateForm(): void {
    if (this.patientData && this.patientData.birthDate) {
      this.editPatientForm.patchValue({
        name: this.patientData.name, 
        surname: this.patientData.surname, 
        comment: this.patientData.comment, 
        birthDate: this.patientData.birthDate.split('T')[0] 
      });
    } else {
      this.editPatientForm.patchValue({
        name: '',
        surname: '',
        birthDate: ''
      });
    }
  }

  formatDate(date: string): string {
    if (!date) return '';
    const parts = date.split(' '); 
    if (parts.length > 0) {
      return parts[0]; 
    }
    return '';
  }

  updatePatientWithoutSubmit(): void {
    if (this.editPatientForm.valid && this.patientId) {
      const updatedPatientData = {
        id: parseInt(this.patientId, 10),
        Name: this.editPatientForm.value.name, 
        Surname: this.editPatientForm.value.surname, 
        BirthDate: this.editPatientForm.value.birthDate ,// "YYYY-MM-DD",
        Comment : this.editPatientForm.value.comment
      };
      this.http.put(`https://localhost:44341/api/patient/${this.patientId}`, updatedPatientData)
        .subscribe({
          next: () => {
            alert('Patient information successfully updated!');
            this.router.navigate(['/patients']);
          },
          error: error => {
            console.error('Update error:', error);
            alert('An error occurred while updating patient information.');
          }
        });
    } else {
      alert('Please fill in the form correctly.');
    }
  }
}