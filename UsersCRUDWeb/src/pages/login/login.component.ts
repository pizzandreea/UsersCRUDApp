import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { LoginDto } from '../../dtos/login.dto';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  loginForm: FormGroup;
  error = '';

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  login() {
    if (this.loginForm.invalid) return;

    const dto: LoginDto = this.loginForm.value;
    this.auth.login(dto).subscribe({
      next: (token: string)  => {
        console.log('Received token:', token);
        localStorage.setItem('token', token);
        this.error = '';
        this.router.navigate(['/home']);
      },
      error: () => {
        this.error = 'Login failed. Please check your credentials.';
      }
    });
  }

}
