import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Downtime {
  id: number;
  machine: string;
  date: string;
  from: string;
  to: string;
  duration: string;
  reason: string;
}

@Injectable({
  providedIn: 'root'
})
export class DowntimeService {

  private http = inject(HttpClient);

  apiUrl = 'http://localhost:5248/api/downtimes';

  getDowntimes(): Observable<Downtime[]> {
    return this.http.get<Downtime[]>(this.apiUrl);
  }
}