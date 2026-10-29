import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Fault {
  id: number;
  machine: string;
  severity: string;
  date: string;
  description: string;
}

@Injectable({
  providedIn: 'root'
})
export class FaultService {

  private http = inject(HttpClient);

  apiUrl = 'http://localhost:5248/api/faults';

  getFaults(): Observable<Fault[]> {
    return this.http.get<Fault[]>(this.apiUrl);
  }
}
