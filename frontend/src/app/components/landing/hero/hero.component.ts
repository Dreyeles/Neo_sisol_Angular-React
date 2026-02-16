import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-hero',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './hero.html',
    styleUrl: './hero.css'
})
export class HeroComponent {
    @Output() actionClick = new EventEmitter<void>();

    handleAction() {
        this.actionClick.emit();
    }
}
