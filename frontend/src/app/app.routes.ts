import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { HomeComponent } from './components/landing/home/home.component';
import { PatientDashboardComponent } from './components/dashboard/patient/patient-dashboard.component';
import { DoctorDashboardComponent } from './components/dashboard/doctor/doctor-dashboard.component';
import { AdminDashboardComponent } from './components/dashboard/admin/admin-dashboard.component';

export const routes: Routes = [
    { path: 'home', component: HomeComponent },
    { path: '', redirectTo: '/home', pathMatch: 'full' },
    // Dashboard routes
    { path: 'patient', component: PatientDashboardComponent },
    { path: 'doctor', component: DoctorDashboardComponent },
    { path: 'admin', component: AdminDashboardComponent }
];
