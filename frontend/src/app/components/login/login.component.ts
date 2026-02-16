import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
    selector: 'app-login',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule],
    templateUrl: './login.html',
    styleUrl: './login.css'
})
export class LoginComponent {
    @Input() isOpen = false;
    @Output() close = new EventEmitter<void>();
    @Output() switchToRegister = new EventEmitter<void>();

    loginForm: FormGroup;
    isLoading = false;
    showPassword = false;

    constructor(
        private fb: FormBuilder,
        private authService: AuthService,
        private router: Router
    ) {
        this.loginForm = this.fb.group({
            email: ['', [Validators.required, Validators.email]],
            password: ['', [Validators.required, Validators.minLength(3)]] // 3 to allow '123' as in React code
        });
    }

    isFieldInvalid(field: string): boolean {
        const control = this.loginForm.get(field);
        return !!(control && control.invalid && (control.dirty || control.touched));
    }

    onClose(): void {
        this.close.emit();
    }

    onSwitchToRegister(event: Event): void {
        event.preventDefault();
        this.switchToRegister.emit();
    }

    onSubmit(): void {
        if (this.loginForm.invalid) {
            this.loginForm.markAllAsTouched();
            return;
        }

        this.isLoading = true;
        this.authService.login(this.loginForm.value).subscribe({
            next: (response) => {
                this.isLoading = false;
                if (response.status === 'OK') {
                    const user = this.authService.currentUserValue();
                    this.navigateToDashboard(user.role);
                    this.onClose();
                } else {
                    alert('Error al iniciar sesión: ' + response.message);
                }
            },
            error: (error) => {
                this.isLoading = false;
                console.error('Error en el login:', error);
                alert('Error de conexión al iniciar sesión.');
            }
        });
    }

    private navigateToDashboard(role: string): void {
        switch (role) {
            case 'admin':
                this.router.navigate(['/admin']);
                break;
            case 'doctor':
                this.router.navigate(['/doctor']);
                break;
            case 'patient':
                this.router.navigate(['/patient']);
                break;
            default:
                this.router.navigate(['/']);
        }
    }
}
