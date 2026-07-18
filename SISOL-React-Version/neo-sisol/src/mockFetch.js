// Mock Fetch API Interceptor for React version
// Intercepts window.fetch calls to mock the backend using localStorage

const MockDbHelper = {
  isInitialized: false,

  init() {
    if (this.isInitialized) return;

    // Verificar si los usuarios de prueba principales existen. Si no, limpiar y recrear la base de datos de simulación
    const currentUsersRaw = localStorage.getItem('mock_usuarios');
    let needsReset = false;
    if (!currentUsersRaw) {
      needsReset = true;
    } else {
      try {
        const currentUsers = JSON.parse(currentUsersRaw);
        const emails = currentUsers.map(u => u.email.toLowerCase());
        if (!emails.includes('paciente@email.com') || 
            !emails.includes('medico@email.com') || 
            !emails.includes('admin@email.com')) {
          needsReset = true;
        }
      } catch (e) {
        needsReset = true;
      }
    }

    if (needsReset) {
      localStorage.removeItem('mock_especialidades');
      localStorage.removeItem('mock_medicos');
      localStorage.removeItem('mock_usuarios');
      localStorage.removeItem('mock_pacientes');
      localStorage.removeItem('mock_citas');
      localStorage.removeItem('mock_atenciones');
      localStorage.removeItem('mock_servicios');
    }

    // Initialize Especialidades
    if (!localStorage.getItem('mock_especialidades')) {
      const specs = [
        { id_especialidad: 1, nombre: 'Medicina General', descripcion: 'Atención médica general y preventiva' },
        { id_especialidad: 2, nombre: 'Cardiología', descripcion: 'Especialidad en enfermedades del corazón y sistema cardiovascular' },
        { id_especialidad: 3, nombre: 'Dermatología', descripcion: 'Diagnóstico y tratamiento de enfermedades de la piel' },
        { id_especialidad: 4, nombre: 'Pediatría', descripcion: 'Atención médica especializada en niños y adolescentes' },
        { id_especialidad: 5, nombre: 'Traumatología', descripcion: 'Tratamiento de lesiones, fracturas y enfermedades del sistema locomotor' }
      ];
      localStorage.setItem('mock_especialidades', JSON.stringify(specs));
    }

    // Initialize Default Users
    if (!localStorage.getItem('mock_usuarios')) {
      const defaultUsers = [
        {
          id_usuario: 1,
          email: 'paciente@email.com',
          nombres: 'José',
          apellidos: 'Mamani',
          nombre: 'José Mamani',
          tipo_usuario: 'paciente',
          id_paciente: 1,
          dni: '77777777',
          fecha_nacimiento: '1990-05-15',
          genero: 'masculino',
          celular: '999888777',
          password: 'paciente123'
        },
        {
          id_usuario: 2,
          email: 'medico@email.com',
          nombres: 'Juan',
          apellidos: 'Pérez',
          nombre: 'Dr. Juan Pérez',
          tipo_usuario: 'medico',
          id_medico: 1,
          password: 'medico123'
        },
        {
          id_usuario: 3,
          email: 'admin@email.com',
          nombres: 'Administrador',
          apellidos: 'Principal',
          nombre: 'Admin Sisol',
          tipo_usuario: 'administrativo',
          id_personal_administrativo: 1,
          password: 'admin123'
        }
      ];
      localStorage.setItem('mock_usuarios', JSON.stringify(defaultUsers));
    }

    // Initialize Médicos
    if (!localStorage.getItem('mock_medicos')) {
      const doctors = [
        { id_medico: 1, id_usuario: 101, nombres: 'Juan', apellidos: 'Pérez', id_especialidad: 1, especialidad_nombre: 'Medicina General', numero_colegiatura: '12345', costo_consulta: 30, turno: 'Mañana', horario_atencion: '08:00 - 13:00', email: 'medico.juan@sisol.com' },
        { id_medico: 2, id_usuario: 102, nombres: 'Ana', apellidos: 'Acosta', id_especialidad: 1, especialidad_nombre: 'Medicina General', numero_colegiatura: '12346', costo_consulta: 30, turno: 'Tarde', horario_atencion: '14:00 - 19:00', email: 'medico.ana@sisol.com' },
        { id_medico: 3, id_usuario: 103, nombres: 'Bruno', apellidos: 'Benítez', id_especialidad: 2, especialidad_nombre: 'Cardiología', numero_colegiatura: '23456', costo_consulta: 50, turno: 'Mañana', horario_atencion: '08:00 - 13:00', email: 'medico.bruno@sisol.com' },
        { id_medico: 4, id_usuario: 104, nombres: 'Beatriz', apellidos: 'Barrios', id_especialidad: 2, especialidad_nombre: 'Cardiología', numero_colegiatura: '23457', costo_consulta: 50, turno: 'Tarde', horario_atencion: '14:00 - 19:00', email: 'medico.beatriz@sisol.com' },
        { id_medico: 5, id_usuario: 105, nombres: 'Carlos', apellidos: 'Castro', id_especialidad: 3, especialidad_nombre: 'Dermatología', numero_colegiatura: '34567', costo_consulta: 45, turno: 'Mañana', horario_atencion: '08:00 - 13:00', email: 'medico.carlos@sisol.com' },
        { id_medico: 6, id_usuario: 106, nombres: 'Carla', apellidos: 'Carrillo', id_especialidad: 3, especialidad_nombre: 'Dermatología', numero_colegiatura: '34568', costo_consulta: 45, turno: 'Tarde', horario_atencion: '14:00 - 19:00', email: 'medico.carla@sisol.com' },
        { id_medico: 7, id_usuario: 107, nombres: 'Daniel', apellidos: 'Díaz', id_especialidad: 4, especialidad_nombre: 'Pediatría', numero_colegiatura: '45678', costo_consulta: 40, turno: 'Mañana', horario_atencion: '08:00 - 13:00', email: 'medico.daniel@sisol.com' },
        { id_medico: 8, id_usuario: 108, nombres: 'Diana', apellidos: 'Domínguez', id_especialidad: 4, especialidad_nombre: 'Pediatría', numero_colegiatura: '45679', costo_consulta: 40, turno: 'Tarde', horario_atencion: '14:00 - 19:00', email: 'medico.diana@sisol.com' },
        { id_medico: 9, id_usuario: 109, nombres: 'Eduardo', apellidos: 'Espinoza', id_especialidad: 5, especialidad_nombre: 'Traumatología', numero_colegiatura: '56789', costo_consulta: 50, turno: 'Mañana', horario_atencion: '08:00 - 13:00', email: 'medico.eduardo@sisol.com' },
        { id_medico: 10, id_usuario: 110, nombres: 'Elena', apellidos: 'Estrada', id_especialidad: 5, especialidad_nombre: 'Traumatología', numero_colegiatura: '56780', costo_consulta: 50, turno: 'Tarde', horario_atencion: '14:00 - 19:00', email: 'medico.elena@sisol.com' }
      ];
      localStorage.setItem('mock_medicos', JSON.stringify(doctors));

      // Sync user accounts for doctors
      const existingUsers = JSON.parse(localStorage.getItem('mock_usuarios') || '[]');
      doctors.forEach(doc => {
        if (!existingUsers.some(u => u.email === doc.email)) {
          existingUsers.push({
            id_usuario: doc.id_usuario,
            email: doc.email,
            nombres: doc.nombres,
            apellidos: doc.apellidos,
            nombre: `${doc.nombres} ${doc.apellidos}`,
            tipo_usuario: 'medico',
            id_medico: doc.id_medico,
            password: 'medico123'
          });
        }
      });
      localStorage.setItem('mock_usuarios', JSON.stringify(existingUsers));
    }

    // Initialize Pacientes
    if (!localStorage.getItem('mock_pacientes')) {
      const patients = [
        { id_paciente: 1, id_usuario: 1, nombres: 'José', apellidos: 'Mamani', dni: '77777777', email: 'paciente@email.com', fecha_nacimiento: '1990-05-15', genero: 'masculino', celular: '999888777' }
      ];
      localStorage.setItem('mock_pacientes', JSON.stringify(patients));
    }

    // Initialize Citas
    if (!localStorage.getItem('mock_citas')) {
      const appointments = [
        {
          id_cita: 1,
          id_paciente: 1,
          id_medico: 3,
          fecha: new Date(Date.now() + 86400000).toISOString().split('T')[0],
          turno: 'Mañana',
          estado: 'Pagada',
          monto: 50,
          metodo_pago: 'Tarjeta de Crédito',
          fecha_registro: new Date().toISOString(),
          nombre_medico: 'Bruno Benítez',
          especialidad_nombre: 'Cardiología',
          nombre_paciente: 'José Mamani',
          dni_paciente: '77777777'
        }
      ];
      localStorage.setItem('mock_citas', JSON.stringify(appointments));
    }

    // Initialize Atenciones (Historial clínico)
    if (!localStorage.getItem('mock_atenciones')) {
      const attentions = [
        {
          id_atencion: 1,
          id_cita: 1,
          id_paciente: 1,
          id_medico: 3,
          fecha: new Date(Date.now() - 172800000).toISOString().split('T')[0],
          motivo: 'Chequeo rutinario por arritmia',
          diagnostico: 'Taquicardia leve por estrés laboral',
          tratamiento: 'Descanso médico de 2 días y evitar cafeína.',
          observaciones: 'Control en 1 mes.',
          nombre_medico: 'Bruno Benítez',
          especialidad_nombre: 'Cardiología'
        }
      ];
      localStorage.setItem('mock_atenciones', JSON.stringify(attentions));
    }

    // Initialize Servicios
    if (!localStorage.getItem('mock_servicios')) {
      const services = [
        { id_servicio: 1, nombre: 'Consulta Externa', descripcion: 'Atención primaria y diagnóstico', id_departamento: 1, precio: 30 },
        { id_servicio: 2, nombre: 'Electrocardiograma', descripcion: 'Examen de ritmo cardíaco', id_departamento: 1, precio: 80 },
        { id_servicio: 3, nombre: 'Ecografía Abdominal', descripcion: 'Ultrasonido de órganos abdominales', id_departamento: 2, precio: 120 }
      ];
      localStorage.setItem('mock_servicios', JSON.stringify(services));
    }

    this.isInitialized = true;
  },

  getSpecialties() {
    this.init();
    return JSON.parse(localStorage.getItem('mock_especialidades') || '[]');
  },

  getDoctors() {
    this.init();
    return JSON.parse(localStorage.getItem('mock_medicos') || '[]');
  },

  getDoctorsBySpecialty(specialtyId) {
    return this.getDoctors().filter(doc => doc.id_especialidad === specialtyId);
  },

  getPatients() {
    this.init();
    return JSON.parse(localStorage.getItem('mock_pacientes') || '[]');
  },

  getServices() {
    this.init();
    return JSON.parse(localStorage.getItem('mock_servicios') || '[]');
  },

  login(credentials) {
    this.init();
    const users = JSON.parse(localStorage.getItem('mock_usuarios') || '[]');
    const user = users.find(u => u.email.toLowerCase() === credentials.email.toLowerCase());

    if (!user) {
      return { status: 'ERROR', message: 'Usuario no encontrado.' };
    }

    if (credentials.password && user.password !== credentials.password) {
      return { status: 'ERROR', message: 'Contraseña incorrecta.' };
    }

    return {
      status: 'OK',
      data: {
        id_usuario: user.id_usuario,
        email: user.email,
        nombres: user.nombres,
        apellidos: user.apellidos,
        nombre: `${user.nombres} ${user.apellidos}`,
        tipo_usuario: user.tipo_usuario,
        id_paciente: user.id_paciente,
        id_medico: user.id_medico,
        id_personal_administrative: user.id_personal_administrativo
      }
    };
  },

  register(data) {
    this.init();
    const users = JSON.parse(localStorage.getItem('mock_usuarios') || '[]');
    const patients = JSON.parse(localStorage.getItem('mock_pacientes') || '[]');

    if (users.some(u => u.email.toLowerCase() === data.email.toLowerCase())) {
      return { status: 'ERROR', message: 'El correo electrónico ya está registrado.' };
    }

    if (patients.some(p => p.dni === data.dni)) {
      return { status: 'ERROR', message: 'El DNI ya se encuentra registrado.' };
    }

    const nextUserId = Math.max(...users.map(u => u.id_usuario), 0) + 1;
    const nextPatientId = Math.max(...patients.map(p => p.id_paciente), 0) + 1;

    const newUser = {
      id_usuario: nextUserId,
      email: data.email,
      nombres: data.nombres,
      apellidos: data.apellidos,
      nombre: `${data.nombres} ${data.apellidos}`,
      tipo_usuario: 'paciente',
      id_paciente: nextPatientId,
      dni: data.dni,
      fecha_nacimiento: data.fecha_nacimiento,
      genero: data.genero,
      celular: data.celular,
      password: data.password
    };

    const newPatient = {
      id_paciente: nextPatientId,
      id_usuario: nextUserId,
      nombres: data.nombres,
      apellidos: data.apellidos,
      dni: data.dni,
      email: data.email,
      fecha_nacimiento: data.fecha_nacimiento,
      genero: data.genero,
      celular: data.celular
    };

    users.push(newUser);
    patients.push(newPatient);

    localStorage.setItem('mock_usuarios', JSON.stringify(users));
    localStorage.setItem('mock_pacientes', JSON.stringify(patients));

    return { status: 'OK' };
  },

  getAppointmentsByPatient(patientId) {
    this.init();
    const appointments = JSON.parse(localStorage.getItem('mock_citas') || '[]');
    return appointments.filter(app => app.id_paciente === patientId);
  },

  getAppointmentsByDoctor(doctorId) {
    this.init();
    const appointments = JSON.parse(localStorage.getItem('mock_citas') || '[]');
    return appointments.filter(app => app.id_medico === doctorId);
  },

  checkAvailability(doctorId, fecha, turno) {
    this.init();
    const appointments = JSON.parse(localStorage.getItem('mock_citas') || '[]');
    const matchCount = appointments.filter(app =>
      app.id_medico === doctorId &&
      app.fecha === fecha &&
      app.turno === turno &&
      app.estado !== 'Cancelada'
    ).length;

    return matchCount < 3;
  },

  createAppointment(data) {
    this.init();
    const appointments = JSON.parse(localStorage.getItem('mock_citas') || '[]');
    const doctors = this.getDoctors();
    const patients = this.getPatients();

    const doctor = doctors.find(d => d.id_medico === Number(data.id_medico));
    const patient = patients.find(p => p.id_paciente === Number(data.id_paciente));

    if (!doctor) return { status: 'ERROR', message: 'Médico no encontrado.' };

    const nextId = Math.max(...appointments.map(app => app.id_cita), 0) + 1;
    const newApp = {
      id_cita: nextId,
      id_paciente: Number(data.id_paciente),
      id_medico: Number(data.id_medico),
      fecha: data.fecha,
      turno: data.turno,
      estado: 'Pagada',
      monto: doctor.costo_consulta,
      metodo_pago: data.metodo_pago || 'Tarjeta de Crédito (Simulada)',
      fecha_registro: new Date().toISOString(),
      nombre_medico: `${doctor.nombres} ${doctor.apellidos}`,
      especialidad_nombre: doctor.especialidad_nombre,
      nombre_paciente: patient ? `${patient.nombres} ${patient.apellidos}` : 'Paciente',
      dni_paciente: patient ? patient.dni : ''
    };

    appointments.push(newApp);
    localStorage.setItem('mock_citas', JSON.stringify(appointments));

    return { status: 'OK', data: { id_cita: nextId } };
  },

  getPatientMedicalProfile(patientId) {
    this.init();
    const patients = this.getPatients();
    const patient = patients.find(p => p.id_paciente === patientId);

    if (!patient) return null;

    return {
      status: 'OK',
      data: {
        id_paciente: patient.id_paciente,
        nombres: patient.nombres,
        apellidos: patient.apellidos,
        dni: patient.dni,
        fecha_nacimiento: patient.fecha_nacimiento,
        genero: patient.genero,
        grupo_sanguineo: 'O+',
        alergias: 'Ninguna conocida',
        antecedentes: 'Ninguno relevante',
        seguro: 'SISOL Básico'
      }
    };
  },

  getPatientHistory(patientId) {
    this.init();
    const attentions = JSON.parse(localStorage.getItem('mock_atenciones') || '[]');
    return attentions.filter(att => att.id_paciente === patientId);
  },

  registerAttention(data) {
    this.init();
    const attentions = JSON.parse(localStorage.getItem('mock_atenciones') || '[]');
    const appointments = JSON.parse(localStorage.getItem('mock_citas') || '[]');
    const doctors = this.getDoctors();

    const doctor = doctors.find(d => d.id_medico === Number(data.id_medico));
    const nextId = Math.max(...attentions.map(att => att.id_atencion), 0) + 1;

    const newAtt = {
      id_atencion: nextId,
      id_cita: Number(data.id_cita),
      id_paciente: Number(data.id_paciente),
      id_medico: Number(data.id_medico),
      fecha: new Date().toISOString().split('T')[0],
      motivo: data.motivo,
      diagnostico: data.diagnostico,
      tratamiento: data.tratamiento,
      observaciones: data.observaciones || '',
      nombre_medico: doctor ? `${doctor.nombres} ${doctor.apellidos}` : 'Médico',
      especialidad_nombre: doctor?.especialidad_nombre || ''
    };

    // Mark appointment as attended
    const appointmentIdx = appointments.findIndex(app => app.id_cita === Number(data.id_cita));
    if (appointmentIdx !== -1) {
      appointments[appointmentIdx].estado = 'Atendida';
      localStorage.setItem('mock_citas', JSON.stringify(appointments));
    }

    attentions.push(newAtt);
    localStorage.setItem('mock_atenciones', JSON.stringify(attentions));

    return { status: 'OK' };
  }
};

// Global Fetch Interceptor
const originalFetch = window.fetch;
window.fetch = async function (resource, options) {
  let url = typeof resource === 'string' ? resource : resource.url;

  // Normalize url: remove host if it's pointing to http://localhost:5000/api
  if (url.startsWith('http://localhost:5000/api')) {
    url = url.replace('http://localhost:5000', '');
  }

  // Check if it's an API call
  if (!url.startsWith('/api')) {
    return originalFetch.apply(this, arguments);
  }

  console.log(`[React Mock Fetch] Interceptando: ${options?.method || 'GET'} ${url}`);

  // Artificial delay to make spinners visible
  await new Promise(resolve => setTimeout(resolve, 300));

  let responseBody = { status: 'ERROR', message: 'Ruta no mapeada en mock' };
  let status = 404;

  try {
    const method = options?.method || 'GET';
    const body = options?.body ? JSON.parse(options.body) : null;

    // Route logic
    if (url.endsWith('/auth/login') && method === 'POST') {
      responseBody = MockDbHelper.login(body);
      status = responseBody.status === 'OK' ? 200 : 401;
    } else if (url.endsWith('/auth/register') && method === 'POST') {
      responseBody = MockDbHelper.register(body);
      status = responseBody.status === 'OK' ? 200 : 400;
    } else if (url.endsWith('/especialidades') && method === 'GET') {
      responseBody = { status: 'OK', data: MockDbHelper.getSpecialties() };
      status = 200;
    } else if (url.includes('/medicos/por-especialidad/') && method === 'GET') {
      const parts = url.split('/');
      const specId = Number(parts[parts.length - 1]);
      responseBody = { status: 'OK', data: MockDbHelper.getDoctorsBySpecialty(specId) };
      status = 200;
    } else if (url.endsWith('/medicos') && method === 'GET') {
      responseBody = { status: 'OK', data: MockDbHelper.getDoctors() };
      status = 200;
    } else if (url.includes('/citas/paciente/') && method === 'GET') {
      const parts = url.split('/');
      const patientId = Number(parts[parts.length - 1]);
      responseBody = { status: 'OK', data: MockDbHelper.getAppointmentsByPatient(patientId) };
      status = 200;
    } else if (url.includes('/citas/medico/') && method === 'GET') {
      const parts = url.split('/');
      const doctorId = Number(parts[parts.length - 1]);
      responseBody = { status: 'OK', data: MockDbHelper.getAppointmentsByDoctor(doctorId) };
      status = 200;
    } else if (url.endsWith('/citas/check-availability') && method === 'POST') {
      const available = MockDbHelper.checkAvailability(
        Number(body.id_medico),
        body.fecha,
        body.turno
      );
      responseBody = { status: 'OK', available };
      status = 200;
    } else if (url.endsWith('/pagos/procesar') && method === 'POST') {
      responseBody = MockDbHelper.createAppointment(body);
      status = responseBody.status === 'OK' ? 200 : 400;
    } else if (url.endsWith('/pacientes') && method === 'GET') {
      responseBody = { status: 'OK', data: MockDbHelper.getPatients() };
      status = 200;
    } else if (url.includes('/pacientes/perfil-medico/') && method === 'GET') {
      const parts = url.split('/');
      const patientId = Number(parts[parts.length - 1]);
      const profile = MockDbHelper.getPatientMedicalProfile(patientId);
      responseBody = profile || { status: 'ERROR', message: 'No encontrado' };
      status = profile ? 200 : 404;
    } else if (url.includes('/pacientes/buscar') && method === 'GET') {
      const params = new URLSearchParams(url.split('?')[1] || '');
      const query = (params.get('q') || '').toLowerCase();
      const patients = MockDbHelper.getPatients();
      const filtered = patients.filter(p => 
        p.nombres.toLowerCase().includes(query) || 
        p.apellidos.toLowerCase().includes(query) || 
        p.dni.includes(query)
      );
      responseBody = { status: 'OK', data: filtered };
      status = 200;
    } else if (url.includes('/medicos/') && url.endsWith('/pacientes') && method === 'GET') {
      const parts = url.split('/');
      const docId = Number(parts[parts.length - 2]);
      const appointments = MockDbHelper.getAppointmentsByDoctor(docId);
      const patients = MockDbHelper.getPatients();
      const patientIds = Array.from(new Set(appointments.map(app => app.id_paciente)));
      const filteredPatients = patients.filter(p => patientIds.includes(p.id_paciente));
      responseBody = { status: 'OK', data: filteredPatients };
      status = 200;
    } else if (url.includes('/atencion/historial/') && method === 'GET') {
      const parts = url.split('/');
      const patientId = Number(parts[parts.length - 1]);
      responseBody = { status: 'OK', data: MockDbHelper.getPatientHistory(patientId) };
      status = 200;
    } else if (url.endsWith('/atencion/registrar') && method === 'POST') {
      responseBody = MockDbHelper.registerAttention(body);
      status = responseBody.status === 'OK' ? 200 : 400;
    } else {
      console.warn(`[React Mock Fetch] Ruta no soportada en mock: ${method} ${url}`);
    }

  } catch (error) {
    console.error('[React Mock Fetch] Error:', error);
    responseBody = { status: 'ERROR', message: error.message };
    status = 500;
  }

  // Create Response mock object
  return new Response(JSON.stringify(responseBody), {
    status: status,
    statusText: status === 200 ? 'OK' : 'Error',
    headers: {
      'Content-Type': 'application/json'
    }
  });
};
