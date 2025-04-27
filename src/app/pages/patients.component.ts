import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-patients',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './patients.component.html',
})
export class PatientsComponent implements OnInit {
  patients: any[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.http.get<any[]>('https://localhost:44341/api/patient')
      .subscribe({
        next: (data) => {
          this.patients = data;
        },
        error: (err) => {
          console.error('Patient data not available:', err);
        }
      });
  }

  deletePatient(id: number) {
    if (!confirm('Are you sure you want to delete this patient?')) return;
  
    this.http.delete(`https://localhost:44341/api/patient/${id}`)
      .subscribe({
        next: () => {
          this.patients = this.patients.filter(p => p.id !== id);
          alert('Patient deleted successfully.');
        },
        error: err => {
          console.error('Deletion error:', err);
          alert('Failed to delete patient.');
        }
      });
  }
  
}
