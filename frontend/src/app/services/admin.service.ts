import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class AdminService {
    private apiUrl = '/api';

    constructor(private http: HttpClient) { }

    getPatients(): Observable<any> {
        return this.http.get(`${this.apiUrl}/pacientes`);
    }

    getDoctors(): Observable<any> {
        return this.http.get(`${this.apiUrl}/medicos`);
    }

    getSpecialties(): Observable<any> {
        return this.http.get(`${this.apiUrl}/especialidades`);
    }

    getServices(): Observable<any> {
        return this.http.get(`${this.apiUrl}/servicios`);
    }

    addDoctor(doctor: any): Observable<any> {
        return this.http.post(`${this.apiUrl}/medicos`, doctor);
    }

    updateDoctor(id: number, doctor: any): Observable<any> {
        return this.http.put(`${this.apiUrl}/medicos/${id}`, doctor);
    }

    updateService(id: number, service: any): Observable<any> {
        return this.http.put(`${this.apiUrl}/servicios/${id}`, service);
    }
}
