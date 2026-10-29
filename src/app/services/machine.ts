import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Machine {
  id: number;
  name: string;
  temperature: number;
  rpm: number;
  load: number;
  status: string;
}

@Injectable({
  providedIn: 'root'
})
export class MachineService {

  private http = inject(HttpClient);

  apiUrl = 'http://localhost:5248/api/machines';

  getMachines(): Observable<Machine[]> {
    return this.http.get<Machine[]>(this.apiUrl);
  }
}