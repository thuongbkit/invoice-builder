import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Client } from '../models/client';

const BASE_URL = 'http://localhost:3000/api';

@Injectable({
  providedIn: 'root'
})
export class ClientService {

  constructor(private httpClient: HttpClient) { }

  getClients(): Observable<Client[]> {
    return this.httpClient.get<Client[]>(`${BASE_URL}/clients`);
  }

  createClient(body: Client): Observable<Client> {
    return this.httpClient.post<Client>(`${BASE_URL}/clients`, body);
  }

  deleteClient(id: string): Observable<Client> {
    return this.httpClient.delete<Client>(`${BASE_URL}/clients/${id}`);
  }

  getClient(id: string): Observable<Client> {
    return this.httpClient.get<Client>(`${BASE_URL}/clients/${id}`);
  }

  updateClient(id: string, body: Client) {
    return this.httpClient.put<Client>(`${BASE_URL}/clients/${id}`, body);
  }

}
