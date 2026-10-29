import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EmployeeService, Employee as DbEmployee } from '../../services/employee';

interface AppEmployee {
  id?: number;
  name: string;
  role: string;
  hoursWorked: number;
  leaveDays: number;
  workedDays: number;
}

@Component({
  selector: 'app-employees',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './employees.html',
  styleUrl: './employees.css',
})
export class Employees implements OnInit {
  private employeeService = inject(EmployeeService);
  private cdr = inject(ChangeDetectorRef);

  searchText = '';
  roleFilter = 'All';

  employees: AppEmployee[] = [];

  selectedEmployee: AppEmployee | null = null;
  editEmployee: AppEmployee = {
    name: '',
    role: 'Operator',
    hoursWorked: 0,
    leaveDays: 0,
    workedDays: 0
  };

  ngOnInit() {
    this.loadEmployees();
  }

  loadEmployees() {
    this.employeeService.getEmployees().subscribe({
      next: (data: DbEmployee[]) => {
        this.employees = data.map(employee => ({
          id: employee.id,
          name: employee.name,
          role: employee.role,
          hoursWorked: employee.hoursWorked,
          leaveDays: employee.leaveDays,
          workedDays: employee.workedDays
        }));

        // if (typeof window !== 'undefined') {
        //   localStorage.setItem('employees', JSON.stringify(this.employees));
        // }
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error loading employees from DB:', error);
        this.employees = [];
      }
    });
  }

  // loadFallbackEmployees() {
  //   const savedEmployees = typeof window !== 'undefined'
  //     ? localStorage.getItem('employees')
  //     : null;
  //
  //   if (savedEmployees) {
  //     this.employees = JSON.parse(savedEmployees);
  //   } else {
  //     this.employees = [
  //       { name: 'Viji', role: 'Admin', hoursWorked: 170, leaveDays: 1, workedDays: 25 },
  //       { name: 'Srinidhi', role: 'Supervisor', hoursWorked: 172, leaveDays: 1, workedDays: 25 },
  //       { name: 'Archana', role: 'Operator', hoursWorked: 160, leaveDays: 2, workedDays: 24 },
  //       { name: 'Srikanth', role: 'Maintenance', hoursWorked: 150, leaveDays: 4, workedDays: 22 },
  //       { name: 'Vinisri', role: 'Operator', hoursWorked: 168, leaveDays: 0, workedDays: 26 }
  //     ];
  //
  //     if (typeof window !== 'undefined') {
  //       localStorage.setItem('employees', JSON.stringify(this.employees));
  //     }
  //   }
  // }

  get filteredEmployees() {
    return this.employees.filter(emp => {
      const nameMatch = emp.name
        .toLowerCase()
        .includes(this.searchText.toLowerCase());

      const roleMatch =
        this.roleFilter === 'All' || emp.role === this.roleFilter;

      return nameMatch && roleMatch;
    });
  }

  get totalHours() {
    return this.filteredEmployees.reduce(
      (sum, emp) => sum + Number(emp.hoursWorked),
      0
    );
  }

  get totalLeaves() {
    return this.filteredEmployees.reduce(
      (sum, emp) => sum + Number(emp.leaveDays),
      0
    );
  }

  editWork(employee: AppEmployee) {
    this.selectedEmployee = employee;

    this.editEmployee = {
      name: employee.name,
      role: employee.role,
      hoursWorked: employee.hoursWorked,
      leaveDays: employee.leaveDays,
      workedDays: employee.workedDays
    };
  }

  saveWorkDetails() {
    if (this.selectedEmployee && this.selectedEmployee.id) {
      const updatedEmployee: DbEmployee = {
        id: this.selectedEmployee.id,
        name: this.selectedEmployee.name,
        role: this.selectedEmployee.role,
        department: '', // Not used in UI
        hoursWorked: Number(this.editEmployee.hoursWorked),
        leaveDays: Number(this.editEmployee.leaveDays),
        workedDays: Number(this.editEmployee.workedDays)
      };

      this.employeeService.updateEmployee(updatedEmployee.id, updatedEmployee).subscribe({
        next: () => {
          this.loadEmployees(); // Reload to get updated data
          this.selectedEmployee = null;
        },
        error: (error) => {
          console.error('Error updating employee:', error);
          alert('Failed to update employee work details');
        }
      });
    }
  }

  cancelEdit() {
    this.selectedEmployee = null;
  }

  resetData() {
    const confirmReset = confirm('Reset all employee work data to 0?');

    if (confirmReset) {
      this.employeeService.resetEmployees().subscribe({
        next: () => {
          this.loadEmployees();
        },
        error: (error) => {
          console.error('Error resetting employees:', error);
          alert('Failed to reset employee data');
        }
      });
    }
  }
}
