import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class AppointmentService {
    private apiUrl = '/api/citas';

    constructor(private http: HttpClient) { }

    getAppointmentsByPatient(patientId: number): Observable<any> {
        return this.http.get(`${this.apiUrl}/paciente/${patientId}`);
    }

    checkAvailability(data: { id_medico: number; fecha: string; turno: string }): Observable<any> {
        return this.http.post(`${this.apiUrl}/check-availability`, data);
    }

    getEspecialidades(): Observable<any> {
        return this.http.get('/api/especialidades');
    }

    getMedicosByEspecialidad(especialidadId: number): Observable<any> {
        return this.http.get(`/api/medicos/por-especialidad/${especialidadId}`);
    }

    processPayment(data: any): Observable<any> {
        return this.http.post('/api/pagos/procesar', data);
    }
}
