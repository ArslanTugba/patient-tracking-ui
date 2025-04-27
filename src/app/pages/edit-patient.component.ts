import { Component, OnInit, OnDestroy } from '@angular/core';  // OnDestroy ekledik
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';  // ActivatedRoute ekledik
import { HttpClient } from '@angular/common/http'; // HttpClient ekledik (veri çekmek için)
import { Subscription } from 'rxjs'; // Subscription ekledik

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
    private router: Router // Bu satırı eklediniz mi? Eğer eklemediyseniz ekleyin.
  ) {
    this.editPatientForm = this.fb.group({
      name: ['', Validators.required],
      surname: ['', Validators.required],
      birthDate: ['']
    });
  }

  ngOnInit(): void {
    this.routeSub = this.route.paramMap.subscribe(params => { // routeSub'a atadık
      this.patientId = params.get('id');
      if (this.patientId) {
        this.getPatient(this.patientId); // Veriyi çekmek için fonksiyonu çağırdık
      }
    });
  }

  ngOnDestroy(): void { // OnDestroy metodu
    if (this.routeSub) {
      this.routeSub.unsubscribe(); // Subscription'ı temizledik
    }
  }

  getPatient(id: string): void {
    // **ÖNEMLİ:** Buradaki URL'yi kendi API endpoint'inize göre değiştirin
    this.http.get(`https://localhost:44341/api/patient/${id}`)
      .subscribe({
        next: (data: any) => { // data'yı any olarak belirttik, gerçek tipinizi kullanın
          this.patientData = data;
          this.populateForm(); // Formu doldur
        },
        error: error => {
          console.error('Hasta verisi alınamadı:', error);
          // Hata durumunda kullanıcıya bir mesaj gösterebilirsiniz
        }
      });
  }
  populateForm(): void {
    if (this.patientData && this.patientData.birthDate) {
      this.editPatientForm.patchValue({
        name: this.patientData.name, // Küçük harfle geliyor dikkat!
        surname: this.patientData.surname, // Küçük harfle geliyor dikkat!
        birthDate: this.patientData.birthDate.split('T')[0] // 'T' ile ayrılan tarih kısmını al
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
        Name: this.editPatientForm.value.name, // Büyük harfle
        Surname: this.editPatientForm.value.surname, // Büyük harfle
        BirthDate: this.editPatientForm.value.birthDate // "YYYY-MM-DD" formatında gönderiliyor
      };
      this.http.put(`https://localhost:44341/api/patient/${this.patientId}`, updatedPatientData)
        .subscribe({
          next: () => {
            alert('Hasta bilgileri başarıyla güncellendi!');
            this.router.navigate(['/patients']);
          },
          error: error => {
            console.error('Güncelleme hatası:', error);
            alert('Hasta bilgileri güncellenirken bir hata oluştu.');
          }
        });
    } else {
      alert('Lütfen formu doğru şekilde doldurun.');
    }
  }
}