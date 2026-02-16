import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private apiUrl = '/api/auth';
    private currentUserSubject = new BehaviorSubject<any>(null);
    public currentUser$ = this.currentUserSubject.asObservable();

    constructor(private http: HttpClient) {
        const savedUser = localStorage.getItem('currentUser');
        if (savedUser) {
            this.currentUserSubject.next(JSON.parse(savedUser));
        }
    }

    login(credentials: { email: string; password: string }): Observable<any> {
        return this.http.post(`${this.apiUrl}/login`, credentials).pipe(
            tap((response: any) => {
                if (response.status === 'OK') {
                    const userData = response.data;
                    const adaptedUser = {
                        email: userData.email,
                        nombre: userData.nombres || userData.nombre || 'Usuario',
                        role: userData.tipo_usuario === 'medico' ? 'doctor' : userData.tipo_usuario === 'administrativo' ? 'admin' : 'patient',
                        id: userData.id_usuario,
                        id_paciente: userData.id_paciente,
                        id_medico: userData.id_medico,
                        id_administrativo: userData.id_personal_administrativo,
                        ...userData
                    };
                    localStorage.setItem('currentUser', JSON.stringify(adaptedUser));
                    this.currentUserSubject.next(adaptedUser);
                }
            })
        );
    }

    logout(): void {
        localStorage.removeItem('currentUser');
        this.currentUserSubject.next(null);
    }

    currentUserValue(): any {
        return this.currentUserSubject.value;
    }

    isAuthenticated(): boolean {
        return !!this.currentUserSubject.value;
    }
}
