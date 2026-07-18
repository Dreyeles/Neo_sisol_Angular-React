import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-version-switch',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="version-switch-container">
      <a [href]="reactUrl" class="switch-btn react-btn">
        <span class="icon">⚛️</span>
        <span class="text">Cambiar a React</span>
      </a>
      <a [href]="landingUrl" class="switch-btn home-btn" title="Volver al Inicio">
        <span class="icon">🏠</span>
      </a>
    </div>
  `,
  styles: [`
    .version-switch-container {
      position: fixed;
      bottom: 24px;
      right: 24px;
      display: flex;
      gap: 12px;
      z-index: 999999;
      pointer-events: auto;
    }
    
    .switch-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      padding: 12px 20px;
      border-radius: 9999px;
      background: rgba(15, 23, 42, 0.7);
      backdrop-filter: blur(12px);
      -webkit-backdrop-filter: blur(12px);
      border: 1px solid rgba(255, 255, 255, 0.1);
      color: #f1f5f9;
      text-decoration: none;
      font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      font-weight: 600;
      font-size: 0.85rem;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.4);
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      cursor: pointer;
    }
    
    .react-btn:hover {
      background: rgba(20, 158, 202, 0.2);
      border-color: rgba(20, 158, 202, 0.4);
      color: #38bdf8;
      box-shadow: 0 10px 30px rgba(20, 158, 202, 0.25);
      transform: translateY(-3px);
    }
    
    .home-btn {
      padding: 12px;
      aspect-ratio: 1;
    }
    
    .home-btn:hover {
      background: rgba(168, 85, 247, 0.2);
      border-color: rgba(168, 85, 247, 0.4);
      color: #c084fc;
      box-shadow: 0 10px 30px rgba(168, 85, 247, 0.25);
      transform: translateY(-3px);
    }

    @media (max-width: 600px) {
      .switch-btn .text {
        display: none;
      }
      .switch-btn {
        padding: 12px;
      }
    }
  `]
})
export class VersionSwitchComponent implements OnInit {
  reactUrl = 'https://neo-sisol-react.vercel.app';
  landingUrl = '/';

  ngOnInit(): void {
    const host = window.location.host;
    if (host.includes('localhost') || host.includes('127.0.0.1')) {
      this.reactUrl = 'http://localhost:5173';
      this.landingUrl = 'http://localhost:8080'; // Se asume que el root index.html se sirve en 8080 o similar
    }
  }
}
