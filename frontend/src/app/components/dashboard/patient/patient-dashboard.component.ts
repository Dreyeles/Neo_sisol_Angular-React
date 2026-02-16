import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, FormsModule } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { AppointmentService } from '../../../services/appointment.service';
import { Router } from '@angular/router';

@Component({
    selector: 'app-patient-dashboard',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, FormsModule],
    templateUrl: './patient-dashboard.html',
    styleUrl: './patient-dashboard.css'
})
export class PatientDashboardComponent implements OnInit {
    user: any;
    activeSection = 'citas';
    citas: any[] = [];
    especialidades: any[] = [];
    medicos: any[] = [];
    loadingCitas = true;
    loadingEspecialidades = true;
    loadingMedicos = false;
    checkingAvailability = false;
    availability: any = null;

    // Filter states
    filterFecha = '';
    filterEspecialidad = '';

    // Form states
    citaEspecialidad = '';
    citaMedico = '';
    citaFecha = '';
    citaTurno = '';
    citaMotivo = '';

    // Payment modal states
    showPaymentModal = false;
    metodoPago: string = '';
    billeteraEspecifica: string = 'yape';
    numeroTransaccion: string = '';

    // Card details
    numeroTarjeta: string = '';
    fechaExpiracion: string = '';
    cvv: string = '';
    nombreTitular: string = '';
    processingPayment = false;

    constructor(
        private authService: AuthService,
        private appointmentService: AppointmentService,
        private router: Router,
        private cdr: ChangeDetectorRef
    ) { }

    ngOnInit(): void {
        this.user = this.authService.currentUserValue();
        if (!this.user || this.user.role !== 'patient') {
            this.router.navigate(['/home']);
            return;
        }

        this.loadEspecialidades();
        this.loadCitas();
    }

    loadEspecialidades() {
        this.appointmentService.getEspecialidades().subscribe({
            next: (res) => {
                if (res.status === 'OK') this.especialidades = res.data;
                this.loadingEspecialidades = false;
            },
            error: () => this.loadingEspecialidades = false
        });
    }

    loadCitas() {
        if (!this.user?.id_paciente) return;
        this.loadingCitas = true;
        this.appointmentService.getAppointmentsByPatient(this.user.id_paciente).subscribe({
            next: (res) => {
                if (res.status === 'OK') this.citas = res.data;
                this.loadingCitas = false;
            },
            error: () => this.loadingCitas = false
        });
    }

    get proximasCitas() {
        return this.citas.filter(c => c.estado === 'programada');
    }

    get filteredHistorial() {
        return this.citas.filter(cita => {
            const matchesFecha = !this.filterFecha || cita.fecha_cita.includes(this.filterFecha);
            const matchesEspecialidad = !this.filterEspecialidad || cita.id_especialidad === Number(this.filterEspecialidad);
            return matchesFecha && matchesEspecialidad;
        });
    }

    descargarInforme(citaId: number) {
        alert('Descargando informe para la cita #' + citaId + '...');
        // Aquí iría la lógica real de descarga
    }

    getSelectedSpecialtyName(): string {
        const esp = this.especialidades.find(e => e.id_especialidad === Number(this.citaEspecialidad));
        return esp ? esp.nombre : 'No especificado';
    }

    getSelectedDoctorName(): string {
        const med = this.medicos.find(m => m.id_medico === Number(this.citaMedico));
        return med ? `Dr. ${med.nombres} ${med.apellidos}` : 'No especificado';
    }

    getFormattedTurno(): string {
        if (this.citaTurno === 'manana') return 'Mañana (7:00 AM - 12:00 PM)';
        if (this.citaTurno === 'tarde') return 'Tarde (2:00 PM - 7:00 PM)';
        return 'No especificado';
    }

    setActiveSection(section: string) {
        this.activeSection = section;
    }

    onEspecialidadChange() {
        this.citaMedico = '';
        this.availability = null;
        if (this.citaEspecialidad) {
            this.loadingMedicos = true;
            this.appointmentService.getMedicosByEspecialidad(Number(this.citaEspecialidad)).subscribe({
                next: (res) => {
                    if (res.status === 'OK') this.medicos = res.data;
                    this.loadingMedicos = false;
                },
                error: () => this.loadingMedicos = false
            });
        } else {
            this.medicos = [];
        }
    }

    checkAvailability() {
        // Reset availability state when inputs change
        this.availability = null;

        if (!this.citaMedico || !this.citaFecha || !this.citaTurno) {
            return;
        }

        this.checkingAvailability = true;

        this.appointmentService.checkAvailability({
            id_medico: Number(this.citaMedico),
            fecha: this.citaFecha,
            turno: this.citaTurno
        }).subscribe({
            next: (res) => {
                // Extended delay of 1.5s as requested for better UX
                setTimeout(() => {
                    if (res.status === 'OK') {
                        this.availability = {
                            available: res.available,
                            message: res.message
                        };
                    }
                    this.checkingAvailability = false;
                    this.cdr.detectChanges(); // Force UI update
                }, 1500);
            },
            error: () => {
                setTimeout(() => {
                    this.checkingAvailability = false;
                    this.availability = {
                        available: false,
                        message: 'Error al verificar disponibilidad'
                    };
                    this.cdr.detectChanges(); // Force UI update
                }, 1500);
            }
        });
    }

    handleAgendarCita() {
        if (this.availability?.available) {
            this.showPaymentModal = true;
        }
    }

    handleConfirmPayment() {
        if (!this.metodoPago) {
            alert('Por favor seleccione un método de pago');
            return;
        }

        this.processingPayment = true;
        const metodoPagoFinal = this.metodoPago === 'billetera_digital' ? this.billeteraEspecifica : this.metodoPago;

        const payload = {
            id_paciente: this.user.id_paciente,
            id_medico: Number(this.citaMedico),
            fecha_cita: this.citaFecha,
            turno: this.citaTurno,
            motivo_consulta: this.citaMotivo,
            metodo_pago: metodoPagoFinal,
            numero_transaccion: this.numeroTransaccion || undefined,
            comprobante_tipo: 'boleta'
        };

        this.appointmentService.processPayment(payload).subscribe({
            next: (res) => {
                this.processingPayment = false;
                if (res.status === 'OK') {
                    alert('¡Pago procesado y cita agendada con éxito!');
                    this.resetForm();
                    this.showPaymentModal = false;
                    this.activeSection = 'citas';
                    this.loadCitas();
                } else {
                    alert('Error: ' + res.message);
                }
            },
            error: (err) => {
                this.processingPayment = false;
                alert('Error al procesar el pago');
            }
        });
    }

    resetForm() {
        this.citaEspecialidad = '';
        this.citaMedico = '';
        this.citaFecha = '';
        this.citaTurno = '';
        this.citaMotivo = '';
        this.metodoPago = '';
        this.billeteraEspecifica = '';
        this.numeroTransaccion = '';
    }

    onLogout() {
        this.authService.logout();
        this.router.navigate(['/home']);
    }
}
