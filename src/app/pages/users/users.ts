import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserService, User } from '../../services/user';

interface AppUser {
  id?: number;
  empId: string;
  name: string;
  role: string;
  status: string;
  lastLogin: string;
  password: string;
}

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './users.html',
  styleUrl: './users.css',
})
export class Users implements OnInit {
  private userService = inject(UserService);
  private cdr = inject(ChangeDetectorRef);

  selectedRole = 'All';
  roles = ['All', 'Admin', 'Supervisor', 'Operator', 'Maintenance'];

  users: AppUser[] = [];

  showForm = false;
  editIndex: number | null = null;

  formUser: AppUser = {
    id: undefined,
    empId: '',
    name: '',
    role: 'Operator',
    status: 'Active',
    lastLogin: '',
    password: '1234'
  };

  ngOnInit() {
    this.loadUsers();
  }

  loadUsers() {
    this.userService.getUsers().subscribe({
      next: (data: User[]) => {
        this.users = data.map(user => ({
          id: user.id,
          empId: user.username,
          name: user.username,
          role: user.role,
          status: 'Active',
          lastLogin: '',
          password: user.password
        }));

        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error loading users from DB:', error);
        this.users = [];
      }
    });
  }

  // loadFallbackUsers() {
  //   const savedUsers = typeof window !== 'undefined'
  //     ? localStorage.getItem('users')
  //     : null;
  //
  //   if (savedUsers) {
  //     this.users = JSON.parse(savedUsers);
  //   } else {
  //     this.users = [
  //       { empId: 'ADM001', name: 'Viji', role: 'Admin', status: 'Active', lastLogin: '09:30 AM' },
  //       { empId: 'SUP101', name: 'Srinidhi', role: 'Supervisor', status: 'Active', lastLogin: '10:15 AM' },
  //       { empId: 'OPR201', name: 'Archana', role: 'Operator', status: 'Active', lastLogin: '11:00 AM' },
  //       { empId: 'MNT301', name: 'Srikanth', role: 'Maintenance', status: 'Inactive', lastLogin: '09:00 AM' },
  //       { empId: 'OPR202', name: 'Vinisri', role: 'Operator', status: 'Active', lastLogin: '08:45 AM' }
  //     ];
  //
  //     this.saveUsersToStorage();
  //     this.syncEmployees();
  //   }
  // }

  get filteredUsers() {
    if (this.selectedRole === 'All') {
      return this.users;
    }

    return this.users.filter(user => user.role === this.selectedRole);
  }

  openAddForm() {
    this.showForm = true;
    this.editIndex = null;

    this.formUser = {
      id: undefined,
      empId: '',
      name: '',
      role: 'Operator',
      status: 'Active',
      lastLogin: '',
      password: '1234'
    };
  }

  saveUser() {
    if (!this.formUser.empId.trim() || !this.formUser.name.trim() || !this.formUser.password.trim()) {
      alert('Please fill all required fields');
      return;
    }

    const user: User = {
      id: this.formUser.id || 0,
      username: this.formUser.empId,
      password: this.formUser.password,
      role: this.formUser.role
    };

    if (this.editIndex === null) {
      // Add new user
      this.userService.createUser(user).subscribe({
        next: (createdUser) => {
          this.loadUsers(); // Reload to get updated list
          this.showForm = false;
        },
        error: (error) => {
          console.error('Error creating user:', error);
          alert('Failed to create user');
        }
      });
    } else {
      // Update existing user
      this.userService.updateUser(user.id, user).subscribe({
        next: () => {
          this.loadUsers(); // Reload to get updated list
          this.showForm = false;
        },
        error: (error) => {
          console.error('Error updating user:', error);
          alert('Failed to update user');
        }
      });
    }
  }

  editUser(user: AppUser) {
    this.showForm = true;
    this.editIndex = this.users.indexOf(user);
    this.formUser = { ...user };
  }

  deleteUser(user: AppUser) {
    const confirmDelete = confirm(`Delete ${user.name}?`);

    if (confirmDelete && user.id) {
      this.userService.deleteUser(user.id).subscribe({
        next: () => {
          this.loadUsers(); // Reload to get updated list
        },
        error: (error) => {
          console.error('Error deleting user:', error);
          alert('Failed to delete user');
        }
      });
    }
  }

  cancelForm() {
    this.showForm = false;
  }

  resetUsers() {
    const confirmReset = confirm('Reset all users to default? This will delete all current users and restore the seeded data.');

    if (confirmReset) {
      this.userService.resetUsers().subscribe({
        next: () => {
          this.loadUsers();
        },
        error: (error) => {
          console.error('Error resetting users:', error);
          alert('Failed to reset users');
        }
      });
    }
  }

  // saveUsersToStorage() {
  //   if (typeof window !== 'undefined') {
  //     localStorage.setItem('users', JSON.stringify(this.users));
  //   }
  // }

  // syncEmployees() {
  //   const oldEmployees = typeof window !== 'undefined'
  //     ? JSON.parse(localStorage.getItem('employees') || '[]')
  //     : [];
  //
  //   const employees = this.users.map(user => {
  //     const existingEmployee = oldEmployees.find(
  //       (emp: any) => emp.name === user.name
  //     );
  //
  //     return {
  //       name: user.name,
  //       role: user.role,
  //       hoursWorked: existingEmployee ? existingEmployee.hoursWorked : 0,
  //       leaveDays: existingEmployee ? existingEmployee.leaveDays : 0,
  //       workedDays: existingEmployee ? existingEmployee.workedDays : 0
  //     };
  //   });
  //
  //   if (typeof window !== 'undefined') {
  //     localStorage.setItem('employees', JSON.stringify(employees));
  //   }
  // }
}

