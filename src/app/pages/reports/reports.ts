import { Component, OnInit, inject } from '@angular/core';
import { NgFor, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgChartsModule } from 'ng2-charts';
import { ReportService, Report } from '../../services/report';
import { FaultService, Fault } from '../../services/fault';
import { PerformanceService, PerformanceRecord } from '../../services/performance';
import { AlertService, Alert } from '../../services/alert';

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [NgFor, NgIf, FormsModule, NgChartsModule],
  templateUrl: './reports.html',
  styleUrl: './reports.css',
})
export class Reports implements OnInit {
  private reportService = inject(ReportService);
  private faultService = inject(FaultService);
  private performanceService = inject(PerformanceService);
  private alertService = inject(AlertService);

  today = new Date().toISOString().split('T')[0];

  activeTab = 'downtime';
  // 🔥 COMMON DATE VALIDATION

  // ---------------- DOWNTIME ----------------
  // ---------------- DOWNTIME ----------------

  // 🔥 initially empty
  fromDate = '';
  toDate = '';

  machineFilter = 'All';

  // 🔥 ERROR MESSAGE
dateError = '';

  // 🔥 DATA
  reports: Report[] = [];
  faults: Fault[] = [];
  performanceRecords: PerformanceRecord[] = [];
  alerts: Alert[] = [];
  loading = false;

  // 🔥 FILTER OPTIONS
  faultMachines: string[] = ['All'];
  performanceMachines: string[] = ['All'];
  barType: any = 'bar';

  downtimeChartData: any = {
    labels: [],
    datasets: []
  };

  get downtimeList(): Report[] {
    return this.reports.filter(item => item.type === 'Downtime');
  }

  constructor() {
    this.loadReports();
    this.loadFaults();
    this.loadPerformanceRecords();
    this.loadAlerts();
  }

  loadReports() {
    this.loading = true;
    this.reportService.getReports().subscribe({
      next: (data) => {
        this.reports = data;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading reports:', error);
        this.loading = false;
      }
    });
  }

  loadFaults() {
    this.faultService.getFaults().subscribe({
      next: (data) => {
        this.faults = data;
        this.faultMachines = [
          'All',
          ...Array.from(new Set(data.map(f => f.machine)))
        ];
      },
      error: (error) => {
        console.error('Error loading faults:', error);
      }
    });
  }

  loadPerformanceRecords() {
    this.performanceService.getPerformanceRecords().subscribe({
      next: (data) => {
        this.performanceRecords = data;
        this.performanceMachines = [
          'All',
          ...Array.from(new Set(data.map(p => p.machine)))
        ];
      },
      error: (error) => {
        console.error('Error loading performance records:', error);
      }
    });
  }

  loadAlerts() {
    this.alertService.getAlerts().subscribe({
      next: (data) => {
        this.alerts = data;
      },
      error: (error) => {
        console.error('Error loading alerts:', error);
      }
    });
  }


// 🔥 DATE VALIDATION
validateDates(): boolean {

  this.dateError = '';

  // ❌ only one date selected
  if (
    (this.fromDate && !this.toDate) ||
    (!this.fromDate && this.toDate)
  ) {

    this.dateError =
      'Please select both From Date and To Date';

    return false;
  }

  // ❌ invalid range
  if (
    this.fromDate &&
    this.toDate &&
    this.fromDate > this.toDate
  ) {

    this.dateError =
      'From Date cannot be greater than To Date';

    return false;
  }

  return true;
}


// 🔥 FILTERED DATA
get filteredDowntime() {

  // ❌ no date selected
  if (!this.fromDate || !this.toDate) {
    return [];
  }

  return this.reports.filter(item =>
    item.type === 'Downtime' &&
    (this.machineFilter === 'All' ||
      item.machine === this.machineFilter) &&
    (
      item.date >= this.fromDate &&
      item.date <= this.toDate
    )
  );
}


// 🔥 CONVERT HOURS
convertToHours(report: Report): number {
    if (report.type === 'Downtime') {
      return report.value;
    }

    const duration = report.data;

    if (duration.includes('hour')) {
      return parseFloat(duration);
    }

    if (duration.includes('minutes')) {
      return +(
        parseFloat(duration) / 60
      ).toFixed(2);
    }

    return report.value; // fallback to the numeric value
  }

// 🔥 UPDATE CHART
updateChart() {

  const data = this.filteredDowntime;

  // ❌ no data
  if (data.length === 0) {

    this.downtimeChartData = {
      labels: [],
      datasets: []
    };

    return;
  }

  // ✅ chart
  this.downtimeChartData = {

    labels: data.map(d => d.machine),

    datasets: [
      {
        label: 'Downtime',

        data: data.map(d =>
          this.convertToHours(d)
        ),

        backgroundColor: '#1976d2'
      }
    ]
  };
}


// 🔥 FILTER CHANGE
onFilterChange() {

  // ❌ validation failed
  if (!this.validateDates()) {

    this.downtimeChartData = {
      labels: [],
      datasets: []
    };

    return;
  }

  // ❌ no dates selected
  if (!this.fromDate || !this.toDate) {

    this.downtimeChartData = {
      labels: [],
      datasets: []
    };

    return;
  }

  // ✅ chart update
  this.updateChart();
}


// 🔥 EXPORT CSV
exportCSV() {

  let csv = 'Machine,Date,Duration\n';

  this.filteredDowntime.forEach(d => {

    csv +=
      `${d.machine},${d.date},${d.value}\n`;

  });

  const blob = new Blob(
    [csv],
    { type: 'text/csv' }
  );

  const a = document.createElement('a');

  a.href = URL.createObjectURL(blob);

  a.download = 'downtime.csv';

  a.click();
}


// 🔥 PRINT
printReport() {
  window.print();
}
  // ---------------- FAULT ----------------
 // ---------------- FAULT REPORT ----------------

// ---------------- FAULT ----------------

// 🔥 EMPTY INITIALLY
faultFromDate = '';
faultToDate = '';

faultMachine = 'All';

// 🔥 ERROR MESSAGE
faultDateError = '';


// 🔥 CHART TYPES
pieType: any = 'pie';
lineType: any = 'line';


// 🔥 CHART DATA
faultChartData: any = {
  labels: [],
  datasets: []
};

faultTrendData: any = {
  labels: [],
  datasets: []
};


// 🔥 DATE VALIDATION
validateFaultDates(): boolean {

  // clear old error
  this.faultDateError = '';

  // ❌ one date only
  if (
    (this.faultFromDate && !this.faultToDate)
    ||
    (!this.faultFromDate && this.faultToDate)
  ) {

    this.faultDateError =
      'Please select both From Date and To Date';

    return false;
  }

  // ❌ invalid range
  if (
    this.faultFromDate &&
    this.faultToDate &&
    this.faultFromDate > this.faultToDate
  ) {

    this.faultDateError =
      'From Date cannot be greater than To Date';

    return false;
  }

  return true;
}


// 🔥 FILTER
get filteredFaults() {

  // ❌ no dates
  if (
    !this.faultFromDate ||
    !this.faultToDate
  ) {
    return [];
  }

  return this.faults.filter(f =>

    (
      this.faultMachine === 'All'
      ||
      f.machine === this.faultMachine
    )

    &&

    (
      f.date >= this.faultFromDate
      &&
      f.date <= this.faultToDate
    )
  );
}


// 🔥 PIE CHART
updateFaultChart() {

  const data = this.filteredFaults;

  // ❌ empty
  if (data.length === 0) {

    this.faultChartData = {
      labels: [],
      datasets: []
    };

    return;
  }

  this.faultChartData = {

    labels: ['High', 'Medium', 'Low'],

    datasets: [
      {
        data: [

          data.filter(
            f => f.severity === 'High'
          ).length,

          data.filter(
            f => f.severity === 'Medium'
          ).length,

          data.filter(
            f => f.severity === 'Low'
          ).length
        ],

        backgroundColor: [
          'red',
          'orange',
          'green'
        ]
      }
    ]
  };
}


// 🔥 TREND CHART
updateFaultTrend() {

  const data = this.filteredFaults;

  // ❌ empty
  if (data.length === 0) {

    this.faultTrendData = {
      labels: [],
      datasets: []
    };

    return;
  }

  this.faultTrendData = {

    labels: data.map(
      (_, i) => `Day ${i + 1}`
    ),

    datasets: [
      {
        label: 'Trend',

        data: data.map(f =>

          f.severity === 'High'
            ? 3
            : f.severity === 'Medium'
            ? 2
            : 1
        ),

        borderColor: '#1976d2'
      }
    ]
  };
}


// 🔥 FILTER CHANGE
onFaultFilterChange() {

  // ❌ validation fail
  if (!this.validateFaultDates()) {

    this.faultChartData = {
      labels: [],
      datasets: []
    };

    this.faultTrendData = {
      labels: [],
      datasets: []
    };

    return;
  }

  // ❌ dates empty
  if (
    !this.faultFromDate ||
    !this.faultToDate
  ) {

    this.faultChartData = {
      labels: [],
      datasets: []
    };

    this.faultTrendData = {
      labels: [],
      datasets: []
    };

    return;
  }

  // ✅ show chart
  this.updateFaultChart();

  this.updateFaultTrend();
} // 🔥 FILTERS
  // ---------------- PERFORMANCE REPORT ----------------

// 🔥 FILTERS
// ---------------- PERFORMANCE ----------------

// 🔥 FILTERS
selectedMachine = 'All';

// 🔥 EMPTY INITIALLY
perfFromDate = '';
perfToDate = '';

// 🔥 ERROR
performanceDateError = '';

// 🔥 CHART
performanceChartData: any = {
  labels: [],
  datasets: []
};

lineType1: any = 'line';


// 🔥 DATE VALIDATION
validatePerformanceDates(): boolean {

  // clear old error
  this.performanceDateError = '';

  // ❌ one date only
  if (
    (this.perfFromDate && !this.perfToDate)
    ||
    (!this.perfFromDate && this.perfToDate)
  ) {

    this.performanceDateError =
      'Please select both From Date and To Date';

    return false;
  }

  // ❌ invalid range
  if (
    this.perfFromDate &&
    this.perfToDate &&
    this.perfFromDate > this.perfToDate
  ) {

    this.performanceDateError =
      'From Date cannot be greater than To Date';

    return false;
  }

  return true;
}


// 🔥 FILTERED DATA
get filteredPerformance() {

  // ❌ no dates
  if (
    !this.perfFromDate ||
    !this.perfToDate
  ) {
    return [];
  }

  return this.performanceRecords.filter(d =>

    (
      this.selectedMachine === 'All'
      ||
      d.machine === this.selectedMachine
    )

    &&

    (
      d.date >= this.perfFromDate
      &&
      d.date <= this.perfToDate
    )
  );
}


// 🔥 CHART UPDATE
filterPerformanceChart() {

  const data = this.filteredPerformance;

  // ❌ no data
  if (data.length === 0) {

    this.performanceChartData = {
      labels: [],
      datasets: []
    };

    return;
  }

  const dates = [
    ...new Set(
      data.map(d => d.date)
    )
  ];

  const machines =

    this.selectedMachine === 'All'

    ?

    [...new Set(
      data.map(d => d.machine)
    )]

    :

    [this.selectedMachine];


  const datasets = machines.map(machine => ({

    label: machine,

    data: dates.map(date => {

      const found = data.find(d =>

        d.machine === machine
        &&
        d.date === date

      );

      return found
        ? found.temperature
        : null;
    }),

    fill: false
  }));


  this.performanceChartData = {
    labels: dates,
    datasets: datasets
  };
}


// 🔥 KPI
get avgTemp() {

  if (
    this.filteredPerformance.length === 0
  ) {
    return 0;
  }

  const total =

    this.filteredPerformance.reduce(
      (sum, d) => sum + d.temperature,
      0
    );

  return Math.round(
    total /
    this.filteredPerformance.length
  );
}


// 🔥 UPTIME
get uptime() {

  if (
    this.filteredPerformance.length === 0
  ) {
    return 0;
  }

  const onlineMachines =

    this.filteredPerformance.filter(
      d => d.temperature > 0
    ).length;

  return Math.round(

    (
      onlineMachines /
      this.filteredPerformance.length
    ) * 100
  );
}


// 🔥 UTILIZATION
get utilization() {

  if (
    this.filteredPerformance.length === 0
  ) {
    return 0;
  }

  const totalLoad =

    this.filteredPerformance.reduce(
      (sum, d) => sum + d.load,
      0
    );

  return Math.round(
    totalLoad /
    this.filteredPerformance.length
  );
}


// 🔥 FILTER CHANGE
onPerformanceChange() {

  // ❌ validation fail
  if (!this.validatePerformanceDates()) {

    this.performanceChartData = {
      labels: [],
      datasets: []
    };

    return;
  }

  // ❌ no dates
  if (
    !this.perfFromDate ||
    !this.perfToDate
  ) {

    this.performanceChartData = {
      labels: [],
      datasets: []
    };

    return;
  }

  // ✅ show chart
  this.filterPerformanceChart();
}
  // ---------------- ALERT ----------------
// ---------------- ALERT REPORT ----------------

// 🔥 FILTERS
// ---------------- ALERT ----------------

// 🔥 FILTERS
alertStatus = 'All';
alertRole = 'All';

// 🔥 EMPTY INITIALLY
alertFromDate = '';
alertToDate = '';

// 🔥 ERROR
alertDateError = '';


// 🔥 DROPDOWNS
alertStatuses = [
  'All',
  'Open',
  'Closed'
];

alertRoles = [
  'All',
  'Operator',
  'Supervisor',
  'Maintenance'
];


// 🔥 CHART
alertChartData: any = {
  labels: [],
  datasets: []
};


// 🔥 DATE VALIDATION
validateAlertDates(): boolean {

  // clear old error
  this.alertDateError = '';

  // ❌ only one date selected
  if (
    (this.alertFromDate && !this.alertToDate)
    ||
    (!this.alertFromDate && this.alertToDate)
  ) {

    this.alertDateError =
      'Please select both From Date and To Date';

    return false;
  }

  // ❌ invalid range
  if (
    this.alertFromDate &&
    this.alertToDate &&
    this.alertFromDate > this.alertToDate
  ) {

    this.alertDateError =
      'From Date cannot be greater than To Date';

    return false;
  }

  return true;
}


// 🔥 FILTERED DATA
get filteredAlerts() {

  // ❌ no dates selected
  if (
    !this.alertFromDate ||
    !this.alertToDate
  ) {
    return [];
  }

  return this.alerts.filter(a => {

    const statusMatch =

      this.alertStatus === 'All'
      ||
      a.status === this.alertStatus;


    const roleMatch =

      this.alertRole === 'All'
      ||
      a.role === this.alertRole;


    const dateMatch =

      a.date >= this.alertFromDate
      &&
      a.date <= this.alertToDate;


    return (
      statusMatch &&
      roleMatch &&
      dateMatch
    );
  });
}


// 🔥 UPDATE CHART
updateAlertChart() {

  const data = this.filteredAlerts;

  // ❌ no data
  if (data.length === 0) {

    this.alertChartData = {
      labels: [],
      datasets: []
    };

    return;
  }

  const openCount =

    data.filter(
      a => a.status === 'Open'
    ).length;


  const closedCount =

    data.filter(
      a => a.status === 'Closed'
    ).length;


  this.alertChartData = {

    labels: ['Alerts'],

    datasets: [

      {
        label: 'Open',

        data: [openCount],

        backgroundColor: 'red'
      },

      {
        label: 'Closed',

        data: [closedCount],

        backgroundColor: 'green'
      }
    ]
  };
}


// 🔥 ACKNOWLEDGE
acknowledge(a: any) {

  a.status = 'Closed';

  this.updateAlertChart();
}


// 🔥 FILTER CHANGE
onAlertChange() {

  // ❌ validation fail
  if (!this.validateAlertDates()) {

    this.alertChartData = {
      labels: [],
      datasets: []
    };

    return;
  }

  // ❌ no dates
  if (
    !this.alertFromDate ||
    !this.alertToDate
  ) {

    this.alertChartData = {
      labels: [],
      datasets: []
    };

    return;
  }

  // ✅ show chart
  this.updateAlertChart();
}

  ngOnInit() {
    this.updateChart();
    this.updateFaultChart();
    this.updateFaultTrend();
    this.filterPerformanceChart();
    this.updateAlertChart();
  }
}