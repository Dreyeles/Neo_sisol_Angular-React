import { HttpInterceptorFn, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { of, throwError } from 'rxjs';
import { delay } from 'rxjs/operators';
import { MockDbHelper } from '../services/mock-db-helper';

export const mockApiInterceptor: HttpInterceptorFn = (req, next) => {
  const url = req.url;

  // Interceptar solo peticiones a /api/
  if (!url.startsWith('/api')) {
    return next(req);
  }

  console.log(`[Mock API Interceptor] Interceptando: ${req.method} ${url}`);

  // Simular un retraso de red de 300ms para que se sientan los spinners/loadings
  const requestDelay = 300;

  try {
    // 1. AUTENTICACIÓN Y REGISTRO
    if (url.endsWith('/auth/login') && req.method === 'POST') {
      const credentials = req.body as any;
      const res = MockDbHelper.login(credentials);
      return returnResponse(res, res.status === 'OK' ? 200 : 401, requestDelay);
    }

    if (url.endsWith('/auth/register') && req.method === 'POST') {
      const registerData = req.body as any;
      const res = MockDbHelper.register(registerData);
      return returnResponse(res, res.status === 'OK' ? 200 : 400, requestDelay);
    }

    // 2. ESPECIALIDADES
    if (url.endsWith('/especialidades') && req.method === 'GET') {
      const specs = MockDbHelper.getSpecialties();
      return returnResponse({ status: 'OK', data: specs }, 200, requestDelay);
    }

    // 3. MEDICOS
    if (url.includes('/medicos/por-especialidad/') && req.method === 'GET') {
      const parts = url.split('/');
      const specId = Number(parts[parts.length - 1]);
      const doctors = MockDbHelper.getDoctorsBySpecialty(specId);
      return returnResponse({ status: 'OK', data: doctors }, 200, requestDelay);
    }

    if (url.endsWith('/medicos') && req.method === 'GET') {
      const doctors = MockDbHelper.getDoctors();
      return returnResponse({ status: 'OK', data: doctors }, 200, requestDelay);
    }

    if (url.endsWith('/medicos') && req.method === 'POST') {
      const docData = req.body as any;
      const res = MockDbHelper.addDoctor(docData);
      return returnResponse(res, res.status === 'OK' ? 200 : 400, requestDelay);
    }

    if (url.includes('/medicos/') && url.endsWith('/pacientes') && req.method === 'GET') {
      // Pacientes asignados a un médico
      const parts = url.split('/');
      const docId = Number(parts[parts.length - 2]);
      const appointments = MockDbHelper.getAppointmentsByDoctor(docId);
      const patients = MockDbHelper.getPatients();
      
      // Obtener pacientes únicos asociados a las citas de este médico
      const patientIds = Array.from(new Set(appointments.map(app => app.id_paciente)));
      const filteredPatients = patients.filter((p: any) => patientIds.includes(p.id_paciente));
      
      return returnResponse({ status: 'OK', data: filteredPatients }, 200, requestDelay);
    }

    // 4. CITAS
    if (url.includes('/citas/paciente/') && req.method === 'GET') {
      const parts = url.split('/');
      const patientId = Number(parts[parts.length - 1]);
      const appointments = MockDbHelper.getAppointmentsByPatient(patientId);
      return returnResponse({ status: 'OK', data: appointments }, 200, requestDelay);
    }

    if (url.includes('/citas/medico/') && req.method === 'GET') {
      const parts = url.split('/');
      const doctorId = Number(parts[parts.length - 1]);
      const appointments = MockDbHelper.getAppointmentsByDoctor(doctorId);
      return returnResponse({ status: 'OK', data: appointments }, 200, requestDelay);
    }

    if (url.endsWith('/citas/check-availability') && req.method === 'POST') {
      const checkData = req.body as any;
      const available = MockDbHelper.checkAvailability(
        Number(checkData.id_medico),
        checkData.fecha,
        checkData.turno
      );
      const message = available 
        ? '🎉 El horario seleccionado está disponible para agendar.' 
        : '❌ El médico ya cuenta con una cita en este turno. Por favor, elija otro horario.';
      return returnResponse({ status: 'OK', available, message }, 200, requestDelay);
    }

    if (url.endsWith('/pagos/procesar') && req.method === 'POST') {
      const paymentData = req.body as any;
      const res = MockDbHelper.createAppointment(paymentData);
      return returnResponse(res, res.status === 'OK' ? 200 : 400, requestDelay);
    }

    // 5. PACIENTES
    if (url.endsWith('/pacientes') && req.method === 'GET') {
      const patients = MockDbHelper.getPatients();
      return returnResponse({ status: 'OK', data: patients }, 200, requestDelay);
    }

    if (url.includes('/pacientes/perfil-medico/') && req.method === 'GET') {
      const parts = url.split('/');
      const patientId = Number(parts[parts.length - 1]);
      const profile = MockDbHelper.getPatientMedicalProfile(patientId);
      if (profile) {
        return returnResponse(profile, 200, requestDelay);
      } else {
        return returnResponse({ status: 'ERROR', message: 'Perfil no encontrado' }, 404, requestDelay);
      }
    }

    if (url.includes('/pacientes/buscar') && req.method === 'GET') {
      // Buscar pacientes por query string (q=...)
      const match = url.match(/[?&]q=([^&]*)/);
      const query = match ? decodeURIComponent(match[1]).toLowerCase() : '';
      const patients = MockDbHelper.getPatients();
      const filtered = patients.filter((p: any) => 
        p.nombres.toLowerCase().includes(query) || 
        p.apellidos.toLowerCase().includes(query) || 
        p.dni.includes(query)
      );
      return returnResponse({ status: 'OK', data: filtered }, 200, requestDelay);
    }

    // 6. ATENCIÓN Y HISTORIAL CLINICO
    if (url.includes('/atencion/historial/') && req.method === 'GET') {
      const parts = url.split('/');
      const patientId = Number(parts[parts.length - 1]);
      const history = MockDbHelper.getPatientHistory(patientId);
      return returnResponse({ status: 'OK', data: history }, 200, requestDelay);
    }

    if (url.endsWith('/atencion/registrar') && req.method === 'POST') {
      const attentionData = req.body as any;
      const res = MockDbHelper.registerAttention(attentionData);
      return returnResponse(res, res.status === 'OK' ? 200 : 400, requestDelay);
    }

    // 7. SERVICIOS Y DEPARTAMENTOS
    if (url.endsWith('/servicios/departamentos') && req.method === 'GET') {
      const depts = [
        { id_departamento: 1, nombre: 'Consulta Médica Externa' },
        { id_departamento: 2, nombre: 'Servicio de Apoyo Diagnóstico' }
      ];
      return returnResponse({ status: 'OK', data: depts }, 200, requestDelay);
    }

    if (url.includes('/servicios/por-departamento/') && req.method === 'GET') {
      const parts = url.split('/');
      const deptoId = Number(parts[parts.length - 1]);
      const services = MockDbHelper.getServices().filter(s => s.id_departamento === deptoId);
      return returnResponse({ status: 'OK', data: services }, 200, requestDelay);
    }

    if (url.endsWith('/servicios') && req.method === 'GET') {
      const services = MockDbHelper.getServices();
      return returnResponse({ status: 'OK', data: services }, 200, requestDelay);
    }

    // 8. ARCHIVOS
    if (url.endsWith('/archivos/upload') && req.method === 'POST') {
      return returnResponse({ status: 'OK', data: { url: 'uploads/mock-file.pdf', filename: 'mock-receta.pdf' } }, 200, requestDelay);
    }

    if (url.includes('/archivos/paciente/') && req.method === 'GET') {
      return returnResponse({ status: 'OK', data: [] }, 200, requestDelay);
    }

    // Ruta no mapeada en mock
    console.warn(`[Mock API Interceptor] Ruta no implementada en mock: ${req.method} ${url}`);
    return returnResponse({ status: 'ERROR', message: 'Ruta simulada no encontrada' }, 404, requestDelay);

  } catch (error: any) {
    console.error(`[Mock API Interceptor] Error procesando mock:`, error);
    return throwError(() => new HttpErrorResponse({
      status: 500,
      statusText: 'Internal Server Error',
      error: { message: error.message || 'Error en el simulador de API.' }
    })).pipe(delay(requestDelay));
  }
};

// Función auxiliar para retornar una respuesta HTTP correcta como un Observable con retraso
function returnResponse(body: any, status: number, delayMs: number) {
  const resp = new HttpResponse({
    body,
    status,
    statusText: status === 200 ? 'OK' : 'Error',
    url: ''
  });
  return of(resp).pipe(delay(delayMs));
}
