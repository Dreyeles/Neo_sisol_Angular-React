import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-navbar',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './navbar.html',
    styleUrl: './navbar.css'
})
export class NavbarComponent {
    @Output() loginClick = new EventEmitter<void>();
    @Output() registerClick = new EventEmitter<void>();
    @Output() serviciosClick = new EventEmitter<void>();
    @Output() acercaClick = new EventEmitter<void>();
    @Output() contactoClick = new EventEmitter<void>();


    isMenuOpen = false;

    toggleMenu() {
        this.isMenuOpen = !this.isMenuOpen;
    }

    handleLoginClick() {
        this.isMenuOpen = false;
        this.loginClick.emit();
    }

    handleRegisterClick() {
        this.isMenuOpen = false;
        this.registerClick.emit();
    }

    handleServiciosClick(event: Event) {
        event.preventDefault();
        this.isMenuOpen = false;
        this.serviciosClick.emit();
    }

    handleInicioClick(event: Event) {
        event.preventDefault();
        this.isMenuOpen = false;
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }

    handleAcercaClick(event: Event) {
        event.preventDefault();
        this.isMenuOpen = false;
        this.acercaClick.emit();
    }

    handleContactoClick(event: Event) {
        event.preventDefault();
        this.isMenuOpen = false;
        this.contactoClick.emit();
    }
}
