import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms'; 
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';


@Component({
  selector: 'app-login',
  standalone: true,    
  imports: [CommonModule, ReactiveFormsModule], 
  templateUrl: './login.component.html',
})
export class LoginComponent {
  loginForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router 
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }
  
  onSubmit() {
    if (this.loginForm.valid) {
      const loginData = this.loginForm.value;
      console.log('Gönderilecek veri:', loginData);
  
      this.http.post<any>('https://localhost:44341/api/auth/login', loginData)
        .subscribe({
          next: (response) => {
            console.log('Entry successful:', response);
  
           
            localStorage.setItem('token', response.token);
  
            
            this.router.navigate(['/patients']); 
  
          },
          error: (err) => {
            console.error('Input error:', err);
          }
        });
    }
  } 
}
