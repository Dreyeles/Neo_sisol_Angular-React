import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
    selector: 'app-register',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule],
    templateUrl: './register.html',
    styleUrl: './register.css'
})
export class RegisterComponent {
    @Input() isOpen = false;
    @Output() close = new EventEmitter<void>();
    @Output() switchToLogin = new EventEmitter<void>();

    registerForm: FormGroup;
    isLoading = false;
    showPassword = false;
    showConfirmPassword = false;

    provinciasLimaReg = [
        "Barranca", "Cajatambo", "Canta", "Cañete", "Huaral",
        "Huarochirí", "Huaura (antes Chancay)", "Oyón", "Yauyos", "Lima Metropolitana"
    ];

    distritosLimaReg = [
        "Ancón", "Ate", "Barranco", "Breña", "Carabayllo", "Chaclacayo", "Chorrillos",
        "Cieneguilla", "Comas", "El Agustino", "Independencia", "Jesús María",
        "La Molina", "La Victoria", "Lima", "Lince", "Los Olivos", "Lurigancho", "Lurín",
        "Magdalena del Mar", "Miraflores", "Pachacámac", "Pucusana", "Pueblo Libre",
        "Puente Piedra", "Punta Hermosa", "Punta Negra", "Rímac", "San Bartolo",
        "San Borja", "San Isidro", "San Juan de Lurigancho", "San Juan de Miraflores",
        "San Luis", "San Martín de Porres", "San Miguel", "Santa Anita",
        "Santa María del Mar", "Santa Rosa", "Santiago de Surco", "Surquillo",
        "Villa El Salvador", "Villa María del Triunfo"
    ];

    constructor(private fb: FormBuilder, private http: HttpClient) {
        this.registerForm = this.fb.group({
            nombres: ['', Validators.required],
            apellidos: ['', Validators.required],
            dni: ['', [Validators.required, Validators.pattern(/^\d{8}$/)]],
            email: ['', [Validators.required, Validators.email]],
            telefono: ['', [Validators.required, Validators.pattern(/^\d{9}$/)]],
            direccion: [''],
            distrito: [''],
            provincia: [''],
            departamento: ['Lima'],
            contacto_emergencia_nombre: [''],
            contacto_emergencia_telefono: [''],
            contacto_emergencia_relacion: [''],
            password: ['', [Validators.required, Validators.minLength(8)]],
            confirmPassword: ['', Validators.required],
            fecha_nacimiento: ['', Validators.required],
            genero: ['', Validators.required]
        }, { validators: this.passwordMatchValidator });
    }

    passwordMatchValidator(g: FormGroup) {
        return g.get('password')?.value === g.get('confirmPassword')?.value
            ? null : { 'mismatch': true };
    }

    isFieldInvalid(field: string): boolean {
        const control = this.registerForm.get(field);
        return !!(control && control.invalid && (control.dirty || control.touched));
    }

    onProvinceChange(): void {
        if (this.registerForm.get('provincia')?.value !== 'Lima Metropolitana') {
            this.registerForm.patchValue({ distrito: '' });
        }
    }

    onClose(): void {
        this.close.emit();
    }

    onSwitchToLogin(event: Event): void {
        event.preventDefault();
        this.switchToLogin.emit();
    }

    onSubmit(): void {
        if (this.registerForm.invalid) {
            this.registerForm.markAllAsTouched();
            return;
        }

        this.isLoading = true;
        this.http.post('/api/auth/register', this.registerForm.value).subscribe({
            next: (response: any) => {
                this.isLoading = false;
                if (response.status === 'OK') {
                    alert('¡Registro exitoso! Ahora puedes iniciar sesión.');
                    this.onClose();
                    this.switchToLogin.emit();
                } else {
                    alert('Error al registrarse: ' + response.message);
                }
            },
            error: (error) => {
                this.isLoading = false;
                console.error('Error en el registro:', error);
                alert(error.error?.message || 'Error al registrarse. Por favor, intenta de nuevo.');
            }
        });
    }
}
