import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Employee {
  id: number;
  name: string;
  role: string;
  department: string;
  hoursWorked: number;
  leaveDays: number;
  workedDays: number;
}

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {

  private http = inject(HttpClient);

  apiUrl = 'http://localhost:5248/api/employees';

  getEmployees(): Observable<Employee[]> {
    return this.http.get<Employee[]>(this.apiUrl);
  }

  updateEmployee(id: number, employee: Employee): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}`, employee);
  }

  resetEmployees(): Observable<string> {
    return this.http.post<string>(`${this.apiUrl}/reset`, {});
  }
}
