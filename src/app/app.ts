import { Component } from '@angular/core';
import { RouterOutlet, RouterLink, Router, RouterLinkActive } from '@angular/router';
import { NgIf } from '@angular/common';
import { NgChartsModule } from 'ng2-charts';

export class AppModule {}


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, NgIf],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {

  constructor(public router: Router) {}

  // 🔐 Check login page (hide sidebar on login)
  isLoginPage() {
    return this.router.url === '/';
  }

  // 👤 Get role from localStorage in browser only
  get role() {
    return typeof window !== 'undefined'
      ? localStorage.getItem('role')
      : null;
  }

  // 👥 Role checks
  isAdmin() {
    return this.role === 'Admin';
  }

  isSupervisor() {
    return this.role === 'Supervisor';
  }

  isOperator() {
    return this.role === 'Operator';
  }

  isMaintenance() {
    return this.role === 'Maintenance';
  }

  // 🚪 Logout function
  logout() {
    if (typeof window !== 'undefined') {
      localStorage.clear();
    }
    this.router.navigate(['/']);
  }
}