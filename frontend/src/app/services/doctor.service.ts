import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class DoctorService {
    private apiUrl = '/api';

    constructor(private http: HttpClient) { }

    getAppointmentsByDoctor(doctorId: number): Observable<any> {
        return this.http.get(`${this.apiUrl}/citas/medico/${doctorId}`);
    }

    getPatientsByDoctor(doctorId: number): Observable<any> {
        return this.http.get(`${this.apiUrl}/medicos/${doctorId}/pacientes`);
    }

    getEspecialidades(): Observable<any> {
        return this.http.get(`${this.apiUrl}/especialidades`);
    }

    getPatientMedicalProfile(patientId: number): Observable<any> {
        return this.http.get(`${this.apiUrl}/pacientes/perfil-medico/${patientId}`);
    }

    getPatientHistory(patientId: number): Observable<any> {
        return this.http.get(`${this.apiUrl}/atencion/historial/${patientId}`);
    }

    getDepartamentos(): Observable<any> {
        return this.http.get(`${this.apiUrl}/servicios/departamentos`);
    }

    getServiciosByDepartamento(deptoId: number): Observable<any> {
        return this.http.get(`${this.apiUrl}/servicios/por-departamento/${deptoId}`);
    }

    registerAttention(data: any): Observable<any> {
        return this.http.post(`${this.apiUrl}/atencion/registrar`, data);
    }

    uploadFile(formData: FormData): Observable<any> {
        return this.http.post(`${this.apiUrl}/archivos/upload`, formData);
    }

    getPatientFiles(patientId: number): Observable<any> {
        return this.http.get(`${this.apiUrl}/archivos/paciente/${patientId}`);
    }

    searchPacientes(query: string, date: string): Observable<any> {
        let url = `${this.apiUrl}/pacientes/buscar?`;
        if (query) url += `q=${query}&`;
        if (date) url += `fecha=${date}`;
        return this.http.get(url);
    }
}
