import { Routes } from '@angular/router';

import { Login } from './pages/login/login';
import { Dashboard } from './pages/dashboard/dashboard';
import { Alerts } from './pages/alerts/alerts';
import { Downtime } from './pages/downtime/downtime';
import { Reports } from './pages/reports/reports';
import { Users} from './pages/users/users';
import { Employees } from './pages/employees/employees';

import { Authguard } from './authguard/authguard';




export const routes: Routes = [

  // 🔓 Login page/
  { path: '', component: Login },
 



  // 🖥️ Dashboard (all roles)
  {
    path: 'dashboard',
    component: Dashboard,
    canActivate: [Authguard],
    data: { roles: ['Admin', 'Supervisor', 'Operator', 'Maintenance'] }
  },

  // 🚨 Alerts
  {
    path: 'alerts',
    component: Alerts,
    canActivate: [Authguard],
    data: { roles: ['Admin', 'Supervisor', 'Maintenance'] }
  },

  // ⏱️ Downtime
  {
    path: 'downtime',
    component: Downtime,
    canActivate: [Authguard],
    data: { roles: ['Admin', 'Maintenance'] }
  },

  // 📈 Reports
  {
    path: 'reports',
    component: Reports,
    canActivate: [Authguard],
    data: { roles: ['Admin', 'Supervisor'] }
  },

  // 👥 User Management
  {
    path: 'users',
    component: Users,
    canActivate: [Authguard],
    data: { roles: ['Admin'] }
  },

  // 👨‍💼 Employees
  {
    path: 'employees',
    component: Employees,
    canActivate: [Authguard],
    data: { roles: ['Admin', 'Supervisor'] }
  }

];