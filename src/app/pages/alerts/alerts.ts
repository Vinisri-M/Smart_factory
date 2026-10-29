import { Component, inject } from '@angular/core';
import { NgFor, NgIf, NgClass } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AlertService, Alert } from '../../services/alert';

@Component({
  selector: 'app-alerts',
  standalone: true,
  imports: [NgFor, NgIf, NgClass, FormsModule],
  templateUrl: './alerts.html',
  styleUrl: './alerts.css'
})

export class Alerts {
  private alertService = inject(AlertService);

  severityFilter = 'All';
  machineFilter = 'All';
  statusFilter = 'All';

  fromDate = '';
  toDate = '';

  alerts: Alert[] = [];
  loading = false;

  severities = ['All', 'High', 'Medium', 'Low'];

  machines = [
    'All',
    'Machine 3',
    'Machine 6',
    'Machine 8',
    'Machine 12',
    'Machine 15',
    'Machine 19'
  ];

  statuses = ['All', 'Open', 'Acknowledged', 'Resolved'];

  constructor() {
    this.loadAlerts();
  }

  loadAlerts() {
    this.loading = true;
    this.alertService.getAlerts().subscribe({
      next: (data) => {
        this.alerts = data;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading alerts:', error);
        this.loading = false;
      }
    });
  }

  role = typeof window !== 'undefined' ? localStorage.getItem('role') : null;

  // DATE VALIDATION

  get dateError() {

    if (this.fromDate && !this.toDate) {
      return 'Please select To date';
    }

    if (!this.fromDate && this.toDate) {
      return 'Please select From date';
    }

    if (
      this.fromDate &&
      this.toDate &&
      this.fromDate > this.toDate
    ) {
      return 'From date cannot be greater than To date';
    }

    return '';
  }

  // FILTER ALERTS

  get filteredAlerts() {

    if (this.dateError) {
      return [];
    }

    return this.alerts.filter(alert => {

      const severityMatch =
        this.severityFilter === 'All' ||
        alert.severity === this.severityFilter;

      const machineMatch =
        this.machineFilter === 'All' ||
        alert.machine === this.machineFilter;

      const statusMatch =
        this.statusFilter === 'All' ||
        alert.status === this.statusFilter;

      const dateMatch =
  this.fromDate &&
  this.toDate &&
  alert.date >= this.fromDate &&
  alert.date <= this.toDate;

      return (
        severityMatch &&
        machineMatch &&
        statusMatch &&
        dateMatch
      );

    });
  }

  // ROLE ACCESS

  canAcknowledge() {
    return (
      this.role === 'Maintenance' ||
      this.role === 'Admin'
    );
  }

  // ACKNOWLEDGE ALERT

  acknowledge(alert: any) {
    alert.acknowledged = true;
    alert.status = 'Closed';
  }

  // CLEAR FILTERS

  clearFilters() {
    this.severityFilter = 'All';
    this.machineFilter = 'All';
    this.statusFilter = 'All';

    this.fromDate = '';
    this.toDate = '';
  }

}
