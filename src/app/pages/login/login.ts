import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NgIf } from '@angular/common';
import { UserService, LoginRequest } from '../../services/user';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, NgIf],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {
  username = '';
  password = '';
  loading = false;
  error = '';

  constructor(private router: Router, private userService: UserService) {}

  login() {
    this.loading = true;
    this.error = '';

    const request: LoginRequest = {
      username: this.username,
      password: this.password
    };

    this.userService.login(request).subscribe({
      next: (response) => {
        this.loading = false;
        localStorage.setItem('username', response.username);
        localStorage.setItem('role', response.role);
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        this.loading = false;
        this.error = 'Invalid EMP ID or password';
      }
    });
  }
}
