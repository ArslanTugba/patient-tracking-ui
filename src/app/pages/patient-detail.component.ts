import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-patient-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './patient-detail.component.html',
})
export class PatientDetailComponent {
  patientId: string | null = null;
  selectedPatient: any;
  notFound: boolean = false;

  constructor(private route: ActivatedRoute, private http: HttpClient) {
    this.patientId = this.route.snapshot.paramMap.get('id');
    if (this.patientId) {
      this.http.get<any>(`https://localhost:44341/api/patient/${this.patientId}`)
        .subscribe({
          next: (data) => {
            this.selectedPatient = data;
          },
          error: (err) => {
            console.error('Patient not found:', err);
            this.notFound = true;
          }
        });
    }
  }
  getAiPrediction(): string {
    if (!this.selectedPatient?.birthDate) return 'No prediction available.';
  
    const birthYear = new Date(this.selectedPatient.birthDate).getFullYear();
    const currentYear = new Date().getFullYear();
    const age = currentYear - birthYear;
  
    if (age >= 65) {
      return 'Due to advanced age, regular cardiovascular and neurological screenings are highly recommended. 🧠🫀';
    } else if (age >= 45) {
      return 'Mid-life health checks such as blood pressure, cholesterol, and cancer screening should be done annually. 📋';
    } else if (age >= 30) {
      return 'Maintain a balanced lifestyle with regular exercise and healthy eating. 🏃‍♀️🥗';
    } else if (age >= 18) {
      return 'Stay active, hydrated, and get regular checkups to build lifelong wellness habits. 💧🩺';
    } else {
      return 'Ensure regular pediatric check-ups and vaccinations. 🧸';
    }
  }
  
}
