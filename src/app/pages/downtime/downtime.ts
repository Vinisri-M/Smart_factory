import { Component, inject } from '@angular/core';
import { NgFor, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DowntimeService, Downtime as DowntimeRecord } from '../../services/downtime';

@Component({
  selector: 'app-downtime',
  standalone: true,
  imports: [NgFor, NgIf, FormsModule],
  templateUrl: './downtime.html',
  styleUrl: './downtime.css',
})

export class Downtime {
  private downtimeService = inject(DowntimeService);

  machineFilter = 'All';
  reasonFilter = 'All';

  fromDate = '';
  toDate = '';

  downtimeList: DowntimeRecord[] = [];
  loading = false;

  machines = [
    'All',
    'Machine 4',
    'Machine 9',
    'Machine 13',
    'Machine 17'
  ];

  reasons = [
    'All',
    'No Telemetry',
    'Power Issue',
    'Maintenance',
    'Network Issue',
    'Calibration',
    'Software Update'
  ];

  constructor() {
    this.loadDowntimes();
  }

  loadDowntimes() {
    this.loading = true;
    this.downtimeService.getDowntimes().subscribe({
      next: (data) => {
        this.downtimeList = data;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading downtimes:', error);
        this.loading = false;
      }
    });
  }

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

  // FILTER DATA

  get filteredDowntime() {

    if (this.dateError) {
      return [];
    }

    return this.downtimeList.filter(item => {

      const machineMatch =
        this.machineFilter === 'All' ||
        item.machine === this.machineFilter;

      const reasonMatch =
        this.reasonFilter === 'All' ||
        item.reason === this.reasonFilter;

      const itemDate = new Date(item.date);

      const from = this.fromDate
        ? new Date(this.fromDate)
        : null;

      const to = this.toDate
        ? new Date(this.toDate)
        : null;

      const dateMatch =
        from !== null &&
        to !== null &&
        itemDate >= from &&
        itemDate <= to;

      return (
        machineMatch &&
        reasonMatch &&
        dateMatch
      );

    });

  }

  // CLEAR FILTERS

  clearFilters() {

    this.machineFilter = 'All';
    this.reasonFilter = 'All';

    this.fromDate = '';
    this.toDate = '';

  }

}
