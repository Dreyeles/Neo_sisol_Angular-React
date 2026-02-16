import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { AdminService } from '../../../services/admin.service';
import { Router } from '@angular/router';

@Component({
    selector: 'app-admin-dashboard',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './admin-dashboard.html',
    styleUrl: './admin-dashboard.css'
})
export class AdminDashboardComponent implements OnInit {
    user: any;
    activeSection = 'pacientes';
    patients: any[] = [];
    doctors: any[] = [];
    specialties: any[] = [];
    services: any[] = [];
    loading = true;
    searchTerm = '';

    showAddDoctorForm = false;
    newDoctor: any = {
        username: '',
        password: '',
        dni: '',
        nombres: '',
        apellidos: '',
        fecha_nacimiento: '',
        genero: 'otro',
        id_especialidad: '',
        numero_colegiatura: '',
        turno: 'Mañana',
        costo_consulta: 0
    };

    constructor(
        private authService: AuthService,
        private adminService: AdminService,
        private router: Router
    ) { }

    ngOnInit(): void {
        this.user = this.authService.currentUserValue();
        if (!this.user || this.user.role !== 'admin') {
            this.router.navigate(['/home']);
            return;
        }
        this.loadData();
    }

    loadData() {
        this.loading = true;
        this.adminService.getPatients().subscribe(res => { if (res.status === 'OK') this.patients = res.data; });
        this.adminService.getDoctors().subscribe(res => { if (res.status === 'OK') this.doctors = res.data; });
        this.adminService.getSpecialties().subscribe(res => { if (res.status === 'OK') this.specialties = res.data; });
        this.adminService.getServices().subscribe(res => {
            if (res.status === 'OK') this.services = res.data;
            this.loading = false;
        });
    }

    setActiveSection(section: string) {
        this.activeSection = section;
    }

    get filteredPatients() {
        return this.patients.filter(p =>
            p.nombres.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
            p.dni.includes(this.searchTerm)
        );
    }

    get filteredDoctors() {
        return this.doctors.filter(d =>
            d.nombres.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
            d.numero_colegiatura.includes(this.searchTerm)
        );
    }

    handleAddDoctor() {
        const fullEmail = `medico.${this.newDoctor.username}@sisol.com`;
        const horario = this.newDoctor.turno === 'Mañana' ? '08:00 - 13:00' : '14:00 - 19:00';

        const doctorToSave = {
            ...this.newDoctor,
            email: fullEmail,
            horario_atencion: horario
        };
        delete doctorToSave.username;

        this.adminService.addDoctor(doctorToSave).subscribe({
            next: (res) => {
                if (res.status === 'OK') {
                    alert('Médico registrado');
                    this.showAddDoctorForm = false;
                    this.loadData();
                } else {
                    alert('Error: ' + res.message);
                }
            }
        });
    }

    onLogout() {
        this.authService.logout();
        this.router.navigate(['/home']);
    }
}
