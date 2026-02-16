import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../../shared/navbar/navbar.component';
import { FooterComponent } from '../../shared/footer/footer.component';
import { HeroComponent } from '../hero/hero.component';
import { LoginComponent } from '../../login/login.component';
import { RegisterComponent } from '../../auth/register/register.component';

@Component({
    selector: 'app-home',
    standalone: true,
    imports: [CommonModule, NavbarComponent, FooterComponent, HeroComponent, LoginComponent, RegisterComponent],
    templateUrl: './home.html',
    styleUrl: './home.css'
})
export class HomeComponent {
    isLoginOpen = false;
    isRegisterOpen = false;
    isSpecialtiesOpen = false;
    isServicesOpen = false;

    specialties = [
        { name: 'Alergias e Inmunología', count: 2 },
        { name: 'Cardiología', count: 29 },
        { name: 'Cirugía Cabeza y Cuello', count: 11 },
        { name: 'Cirugía General', count: 24 },
        { name: 'Cirugia Pediatrica', count: 8 },
        { name: 'Cirugía Plástica', count: 8 },
        { name: 'Cirugía Tórax y Cardiovascular', count: 17 },
        { name: 'Dermatología', count: 28 },
        { name: 'Dermatologia Estética', count: 6 },
        { name: 'Dermatología Láser', count: 1 },
        { name: 'Endocrinología', count: 11 },
        { name: 'Flebología', count: 1 },
        { name: 'Gastroenterología', count: 24 },
        { name: 'Geriatría', count: 6 },
        { name: 'Ginecología', count: 29 },
        { name: 'Infertilidad', count: 2 },
        { name: 'Masoterapia', count: 2 },
        { name: 'Mastología', count: 3 },
        { name: 'Medicina Estética', count: 1 },
        { name: 'Medicina familiar y comunitaria', count: 1 },
        { name: 'Medicina fisica y rehabilitación', count: 20 },
        { name: 'Medicina General', count: 31 },
        { name: 'Medicina Interna', count: 16 },
        { name: 'Nefrología', count: 1 },
        { name: 'Neumología', count: 19 },
        { name: 'Neurocirugía', count: 5 },
        { name: 'Neurología', count: 22 },
        { name: 'Oftalmología', count: 25 },
        { name: 'Oncología', count: 5 },
        { name: 'Otorrinolaringología', count: 23 },
        { name: 'Pediatría', count: 19 },
        { name: 'Psiquiatría', count: 9 },
        { name: 'Reumatología', count: 18 },
        { name: 'Traumatología', count: 27 },
        { name: 'Urología', count: 25 }
    ];

    services = [
        { name: 'Administración Hospitalaria', count: 5 },
        { name: 'Ambulancia 24 horas', count: 2 },
        { name: 'Anatomía Patológica', count: 24 },
        { name: 'Atención a domicilio', count: 1 },
        { name: 'Atención de seguros', count: 1 },
        { name: 'Banco de sangre', count: 1 },
        { name: 'Cámara Hiperbárica', count: 1 },
        { name: 'Central de esterilización', count: 3 },
        { name: 'Central obstétrico', count: 1 },
        { name: 'Crecimiento y Desarrollo – Cred', count: 3 },
        { name: 'Densitometría Ósea', count: 17 },
        { name: 'Ecografía', count: 31 },
        { name: 'Ecografia Ginecológica', count: 4 },
        { name: 'Ecografía Mamaria', count: 2 },
        { name: 'Ecografía Urológica', count: 3 },
        { name: 'Electroencefalograma', count: 3 },
        { name: 'Electromiografía', count: 3 },
        { name: 'Emergencias 24 horas', count: 1 },
        { name: 'Examen para brevete', count: 1 },
        { name: 'Farmacia', count: 20 },
        { name: 'Farmacia Dermatológica', count: 6 },
        { name: 'Hidroterapia', count: 2 },
        { name: 'Hospitalización', count: 1 },
        { name: 'Laboratorio Clínico', count: 33 },
        { name: 'Mamografía', count: 10 },
        { name: 'Medicina Estética', count: 2 },
        { name: 'Nutrición', count: 20 },
        { name: 'Obstetricia', count: 13 },
        { name: 'Odontología', count: 34 },
        { name: 'Odontopediatría', count: 1 },
        { name: 'Óptica', count: 6 },
        { name: 'Optometría', count: 3 },
        { name: 'Ortopedia', count: 1 },
        { name: 'Ozonoterapia', count: 5 },
        { name: 'Planta De Oxígeno', count: 4 },
        { name: 'Podología', count: 16 },
        { name: 'Psicología', count: 29 },
        { name: 'Radiología', count: 29 },
        { name: 'Resonancia Magnética', count: 18 },
        { name: 'Sala de operaciones', count: 2 },
        { name: 'Salud ocupacional', count: 1 },
        { name: 'Terapia Del Dolor Y Cuidados Paliativos', count: 2 },
        { name: 'Terapia Física Y Rehabilitación', count: 8 },
        { name: 'Tomografía', count: 21 },
        { name: 'Tópico', count: 28 },
        { name: 'Vacunatorio', count: 1 },
        { name: 'Venta de artículos de ortopedia', count: 2 }
    ];

    toggleSpecialties() {
        this.isSpecialtiesOpen = !this.isSpecialtiesOpen;
    }

    toggleServices() {
        this.isServicesOpen = !this.isServicesOpen;
    }

    openLogin() {
        this.isLoginOpen = true;
        this.isRegisterOpen = false;
    }

    openRegister() {
        this.isRegisterOpen = true;
        this.isLoginOpen = false;
    }

    closeModals() {
        this.isLoginOpen = false;
        this.isRegisterOpen = false;
    }

    scrollToServicios() {
        const el = document.getElementById('servicios');
        if (el) {
            el.scrollIntoView({ behavior: 'smooth' });
        }
    }

    scrollToAcerca() {
        const el = document.getElementById('acerca');
        if (el) {
            el.scrollIntoView({ behavior: 'smooth' });
        }
    }

    scrollToContacto() {
        const el = document.getElementById('contacto');
        if (el) {
            el.scrollIntoView({ behavior: 'smooth' });
        }
    }
}
