import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { NgFor, NgIf, NgClass } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EmployeeService, Employee } from '../../services/employee';
import { MachineService, Machine } from '../../services/machine';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [NgFor, NgIf, NgClass, FormsModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard implements OnInit {
  private employeeService = inject(EmployeeService);
  private machineService = inject(MachineService);
  private cdr = inject(ChangeDetectorRef);

  role = '';
  username = 'User';
  searchText = '';
  selectedMachine: any = null;
  employees: Employee[] = [];
  machines: Machine[] = [];
  loadingEmployees = false;
  loadingMachines = false;

  menuOpen = false;

  constructor() {}

  ngOnInit() {
    this.loadCredentials();
    this.loadEmployees();
    this.loadMachines();
  }

  get user() {
    return {
      name: this.username,
      role: this.role
    };
  }

  loadCredentials() {
    if (typeof window !== 'undefined') {
      this.role = localStorage.getItem('role') || '';
      this.username = localStorage.getItem('username') || 'User';
    }
  }

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }

  loadEmployees() {
    this.loadingEmployees = true;

    this.employeeService.getEmployees().subscribe({
      next: (employees) => {
        this.employees = employees;
        this.loadingEmployees = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.loadingEmployees = false;
      }
    });
  }

  loadMachines() {
    this.loadingMachines = true;

    this.machineService.getMachines().subscribe({
      next: (machines) => {
        this.machines = machines;
        this.loadingMachines = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.loadingMachines = false;
      }
    });
  }

  get normalCount() {
    return this.machines.filter(m => m.status === 'Normal').length;
  }

  get alertCount() {
    return this.machines.filter(m => m.status === 'Alert').length;
  }

  get offlineCount() {
    return this.machines.filter(m => m.status === 'Offline').length;
  }

  get filteredMachines() {
    return this.machines.filter(machine =>
      machine.name.toLowerCase().includes(this.searchText.toLowerCase())
    );
  }

  canViewDetails(machine?: any) {
    if (this.role === 'Admin' || this.role === 'Supervisor') {
      return true;
    }

    if (this.role === 'Maintenance' && machine) {
      return machine.status === 'Alert' || machine.status === 'Offline';
    }

    return false;
  }

  viewDetails(machine: any) {
    if (this.canViewDetails(machine)) {
      this.selectedMachine = machine;
    }
  }

  closeDetails() {
    this.selectedMachine = null;
  }
}
