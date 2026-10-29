import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Report {
  id: number;
  type: string;
  machine: string;
  date: string;
  data: string;
  value: number;
}

@Injectable({
  providedIn: 'root'
})
export class ReportService {

  private http = inject(HttpClient);

  apiUrl = 'http://localhost:5248/api/reports';

  getReports(): Observable<Report[]> {
    return this.http.get<Report[]>(this.apiUrl);
  }
}