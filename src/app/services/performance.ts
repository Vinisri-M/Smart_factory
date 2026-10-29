import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface PerformanceRecord {
  id: number;
  machine: string;
  date: string;
  temperature: number;
  load: number;
}

@Injectable({
  providedIn: 'root'
})
export class PerformanceService {

  private http = inject(HttpClient);

  apiUrl = 'http://localhost:5248/api/performance';

  getPerformanceRecords(): Observable<PerformanceRecord[]> {
    return this.http.get<PerformanceRecord[]>(this.apiUrl);
  }
}
