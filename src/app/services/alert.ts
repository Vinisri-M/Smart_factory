import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Alert {
  id: number;
  machine: string;
  severity: string;
  message: string;
  time: string;
  date: string;
  acknowledged: boolean;
  status: string;
  role: string;
  response: number;
}

@Injectable({
  providedIn: 'root'
})
export class AlertService {

  private http = inject(HttpClient);

  apiUrl = 'http://localhost:5248/api/alerts';

  getAlerts(): Observable<Alert[]> {
    return this.http.get<Alert[]>(this.apiUrl);
  }
}