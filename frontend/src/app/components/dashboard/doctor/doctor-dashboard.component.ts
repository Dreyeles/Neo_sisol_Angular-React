import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { DoctorService } from '../../../services/doctor.service';
import { Router } from '@angular/router';

@Component({
    selector: 'app-doctor-dashboard',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './doctor-dashboard.html',
    styleUrl: './doctor-dashboard.css'
})
export class DoctorDashboardComponent implements OnInit {
    user: any;
    activeSection = 'agenda';
    citas: any[] = [];
    pacientes: any[] = [];
    loadingCitas = false;
    loadingPacientes = false;
    especialidadNombre = 'Cargando...';

    // Global History Search
    searchQuery = '';
    searchDate = '';
    searchResults: any[] = [];
    isSearching = false;
    hasSearched = false;

    // Consultation Modal
    showConsultaModal = false;
    consultaActual: any = null;
    consultaStep = 1;
    consultaForm: any = {
        peso: '',
        talla: '',
        presion_arterial: '',
        temperatura: '',
        grupo_sanguineo: '',
        alergias: '',
        enfermedades_cronicas: '',
        cirugias_previas: '',
        medicamentos_actuales: '',
        antecedentes_familiares: '',
        antecedentes_personales: '',
        vacunas: '',
        motivo_consulta: '',
        sintomas: '',
        diagnostico: '',
        observaciones: '',
        tratamiento: '',
        receta_medica: '',
        proxima_cita: ''
    };

    diagnosticosList: string[] = [];
    nuevoDiagnostico = '';
    tratamientosList: string[] = [];
    nuevoTratamiento = '';
    medicamentosList: any[] = [];
    nuevoMedicamento = { nombre: '', dosis: '', frecuencia: '', duracion: '', notas: '' };

    examenesAgregados: any[] = [];
    departamentos: any[] = [];
    serviciosExamen: any[] = [];
    examenDepto = '';
    examenServicio = '';
    solicitarExamen = false;
    ultimaAtencion: any = null;

    constructor(
        private authService: AuthService,
        private doctorService: DoctorService,
        private router: Router,
        private cdr: ChangeDetectorRef
    ) { }

    ngOnInit(): void {
        this.user = this.authService.currentUserValue();
        if (!this.user || this.user.role !== 'doctor') {
            this.router.navigate(['/home']);
            return;
        }
        this.loadData();
        this.loadDepartamentos();
    }

    loadData() {
        if (this.activeSection === 'agenda') this.loadCitas();
        if (this.activeSection === 'pacientes') this.loadPacientes();
        if (this.activeSection === 'perfil') this.loadEspecialidadInfo();
        // Nota: 'historial' no carga datos automáticamente al iniciar, espera a la búsqueda
    }

    setActiveSection(section: string) {
        this.activeSection = section;
        this.loadData();
    }

    loadCitas() {
        this.loadingCitas = true;
        this.doctorService.getAppointmentsByDoctor(this.user.id_medico).subscribe({
            next: (res) => {
                if (res.status === 'OK') {
                    this.citas = res.data;
                }
                this.loadingCitas = false;
                this.cdr.detectChanges();
            },
            error: (err) => {
                console.error('Error al cargar citas:', err);
                this.loadingCitas = false;
                this.cdr.detectChanges();
            }
        });
    }

    loadPacientes() {
        this.loadingPacientes = true;
        this.doctorService.getPatientsByDoctor(this.user.id_medico).subscribe({
            next: (res) => {
                if (res.status === 'OK') this.pacientes = res.data;
                this.loadingPacientes = false;
                this.cdr.detectChanges();
            },
            error: () => {
                this.loadingPacientes = false;
                this.cdr.detectChanges();
            }
        });
    }

    loadEspecialidadInfo() {
        this.doctorService.getEspecialidades().subscribe({
            next: (res) => {
                if (res.status === 'OK') {
                    const esp = res.data.find((e: any) => e.id_especialidad === this.user.id_especialidad);
                    if (esp) this.especialidadNombre = esp.nombre;
                }
            }
        });
    }

    loadDepartamentos() {
        this.doctorService.getDepartamentos().subscribe({
            next: (res) => {
                if (res.status === 'OK') this.departamentos = res.data;
            }
        });
    }

    onDeptoChange() {
        this.examenServicio = '';
        if (this.examenDepto) {
            this.doctorService.getServiciosByDepartamento(Number(this.examenDepto)).subscribe({
                next: (res) => {
                    if (res.status === 'OK') this.serviciosExamen = res.data;
                }
            });
        } else {
            this.serviciosExamen = [];
        }
    }

    handleIniciarConsulta(cita: any) {
        this.consultaActual = cita;
        this.showConsultaModal = true;
        this.consultaStep = 1;
        this.resetConsultaForm();

        // Cargar Perfil Médico (Antecedentes)
        this.doctorService.getPatientMedicalProfile(cita.id_paciente).subscribe({
            next: (res) => {
                if (res.status === 'OK') {
                    const p = res.data;
                    this.consultaForm.grupo_sanguineo = p.grupo_sanguineo || '';
                    this.consultaForm.alergias = p.alergias || '';
                    if (p.historial_medico) {
                        const h = p.historial_medico;
                        this.consultaForm.enfermedades_cronicas = h.enfermedades_cronicas || '';
                        this.consultaForm.cirugias_previas = h.cirugias_previas || '';
                        this.consultaForm.medicamentos_actuales = h.medicamentos_actuales || '';
                        this.consultaForm.antecedentes_familiares = h.antecedentes_familiares || '';
                        this.consultaForm.antecedentes_personales = h.antecedentes_personales || '';
                        this.consultaForm.vacunas = h.vacunas || '';
                    }
                }
                this.cdr.detectChanges();
            }
        });

        // Cargar última atención para signos vitales previos
        this.doctorService.getPatientHistory(cita.id_paciente).subscribe({
            next: (res) => {
                if (res.status === 'OK' && res.data.length > 0) {
                    this.ultimaAtencion = res.data[0];
                    if (this.ultimaAtencion.signos_vitales && typeof this.ultimaAtencion.signos_vitales === 'string') {
                        try {
                            this.ultimaAtencion.signos_vitales = JSON.parse(this.ultimaAtencion.signos_vitales);
                        } catch (e) { console.error('Error parse SV', e); }
                    }
                } else {
                    this.ultimaAtencion = null;
                }
                this.cdr.detectChanges();
            }
        });
    }

    resetConsultaForm() {
        this.diagnosticosList = [];
        this.tratamientosList = [];
        this.medicamentosList = [];
        this.examenesAgregados = [];
        this.consultaForm.motivo_consulta = this.consultaActual?.motivo_consulta || '';
    }

    handleAgregarDiagnostico() {
        if (this.nuevoDiagnostico.trim()) {
            this.diagnosticosList.push(this.nuevoDiagnostico.trim());
            this.nuevoDiagnostico = '';
        }
    }

    handleAgregarTratamiento() {
        if (this.nuevoTratamiento.trim()) {
            this.tratamientosList.push(this.nuevoTratamiento.trim());
            this.nuevoTratamiento = '';
        }
    }

    handleAgregarMedicamento() {
        if (this.nuevoMedicamento.nombre && this.nuevoMedicamento.dosis) {
            this.medicamentosList.push({ ...this.nuevoMedicamento });
            this.nuevoMedicamento = { nombre: '', dosis: '', frecuencia: '', duracion: '', notas: '' };
        }
    }

    handleAgregarExamen() {
        if (this.examenServicio) {
            const servicio = this.serviciosExamen.find(s => s.id_servicio == this.examenServicio);
            if (servicio) {
                this.examenesAgregados.push({
                    id_servicio: servicio.id_servicio,
                    servicio: servicio.nombre,
                    costo: servicio.costo
                });
                this.examenServicio = '';
            }
        }
    }

    handleSubmitConsulta() {
        const payload = {
            id_cita: this.consultaActual.id_cita,
            id_paciente: this.consultaActual.id_paciente,
            id_medico: this.user.id_medico,
            ...this.consultaForm,
            diagnostico: JSON.stringify(this.diagnosticosList),
            tratamiento: JSON.stringify(this.tratamientosList),
            receta_medica: JSON.stringify(this.medicamentosList),
            examenes_solicitados: JSON.stringify(this.examenesAgregados)
        };

        this.doctorService.registerAttention(payload).subscribe({
            next: (res) => {
                if (res.status === 'OK') {
                    alert('Consulta registrada con éxito');
                    this.showConsultaModal = false;
                    this.loadCitas();
                } else {
                    alert('Error: ' + res.message);
                }
            },
            error: () => alert('Error al registrar consulta')
        });
    }

    handleSearchPatients() {
        if (!this.searchQuery.trim() && !this.searchDate) {
            alert('Por favor ingrese un nombre, DNI o seleccione una fecha');
            return;
        }

        this.isSearching = true;
        this.hasSearched = true;
        this.doctorService.searchPacientes(this.searchQuery, this.searchDate).subscribe({
            next: (res) => {
                if (res.status === 'OK') {
                    this.searchResults = res.data;
                }
                this.isSearching = false;
                this.cdr.detectChanges();
            },
            error: () => {
                this.isSearching = false;
                this.cdr.detectChanges();
                alert('Error al realizar la búsqueda');
            }
        });
    }

    onLogout() {
        this.authService.logout();
        this.router.navigate(['/home']);
    }
}
