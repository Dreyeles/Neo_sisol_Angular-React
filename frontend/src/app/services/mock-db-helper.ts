// Helper para gestionar la base de datos simulada en localStorage
export interface MockUser {
  id_usuario: number;
  email: string;
  nombres: string;
  apellidos: string;
  nombre?: string; // Para compatibilidad
  tipo_usuario: 'paciente' | 'medico' | 'administrativo';
  id_paciente?: number;
  id_medico?: number;
  id_personal_administrativo?: number;
  dni?: string;
  fecha_nacimiento?: string;
  genero?: string;
  celular?: string;
  password?: string; // para validación local
}

export interface MockSpecialty {
  id_especialidad: number;
  nombre: string;
  descripcion: string;
}

export interface MockDoctor {
  id_medico: number;
  id_usuario: number;
  nombres: string;
  apellidos: string;
  id_especialidad: number;
  especialidad_nombre?: string;
  numero_colegiatura: string;
  costo_consulta: number;
  turno: 'Mañana' | 'Tarde';
  horario_atencion: string;
  email: string;
}

export interface MockAppointment {
  id_cita: number;
  id_paciente: number;
  id_medico: number;
  fecha: string;
  turno: string;
  estado: 'Pendiente' | 'Pagada' | 'Atendida' | 'Cancelada';
  monto: number;
  metodo_pago?: string;
  fecha_registro: string;
  nombre_medico?: string;
  especialidad_nombre?: string;
  nombre_paciente?: string;
  dni_paciente?: string;
}

export interface MockAttention {
  id_atencion: number;
  id_cita: number;
  id_paciente: number;
  id_medico: number;
  fecha: string;
  motivo: string;
  diagnostico: string;
  tratamiento: string;
  observaciones?: string;
  nombre_medico?: string;
  especialidad_nombre?: string;
}

export class MockDbHelper {
  private static isInitialized = false;

  static init() {
    if (this.isInitialized) return;

    // Inicializar Especialidades
    if (!localStorage.getItem('mock_especialidades')) {
      const specs: MockSpecialty[] = [
        { id_especialidad: 1, nombre: 'Medicina General', descripcion: 'Atención médica general y preventiva' },
        { id_especialidad: 2, nombre: 'Cardiología', descripcion: 'Especialidad en enfermedades del corazón y sistema cardiovascular' },
        { id_especialidad: 3, nombre: 'Dermatología', descripcion: 'Diagnóstico y tratamiento de enfermedades de la piel' },
        { id_especialidad: 4, nombre: 'Pediatría', descripcion: 'Atención médica especializada en niños y adolescentes' },
        { id_especialidad: 5, nombre: 'Traumatología', descripcion: 'Tratamiento de lesiones, fracturas y enfermedades del sistema locomotor' }
      ];
      localStorage.setItem('mock_especialidades', JSON.stringify(specs));
    }

    // Inicializar Médicos y sus Usuarios vinculados
    if (!localStorage.getItem('mock_medicos')) {
      const doctors: MockDoctor[] = [
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

      // Agregar los usuarios de estos médicos
      const existingUsers: MockUser[] = JSON.parse(localStorage.getItem('mock_usuarios') || '[]');
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
            password: 'medico123' // Contraseña por defecto para médicos
          });
        }
      });
      localStorage.setItem('mock_usuarios', JSON.stringify(existingUsers));
    }

    // Inicializar Usuarios (Paciente, Admin y Médico por defecto)
    if (!localStorage.getItem('mock_usuarios')) {
      const defaultUsers: MockUser[] = [
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

    // Inicializar Pacientes correspondientes a los usuarios
    if (!localStorage.getItem('mock_pacientes')) {
      const patients = [
        { id_paciente: 1, id_usuario: 1, nombres: 'José', apellidos: 'Mamani', dni: '77777777', email: 'paciente@email.com', fecha_nacimiento: '1990-05-15', genero: 'masculino', celular: '999888777' }
      ];
      localStorage.setItem('mock_pacientes', JSON.stringify(patients));
    }

    // Inicializar Citas de Prueba
    if (!localStorage.getItem('mock_citas')) {
      const appointments: MockAppointment[] = [
        {
          id_cita: 1,
          id_paciente: 1,
          id_medico: 3, // Dr. Bruno Benítez (Cardiología)
          fecha: new Date(Date.now() + 86400000).toISOString().split('T')[0], // Mañana
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

    // Inicializar Historial Clínico
    if (!localStorage.getItem('mock_atenciones')) {
      const attentions: MockAttention[] = [
        {
          id_atencion: 1,
          id_cita: 1,
          id_paciente: 1,
          id_medico: 3,
          fecha: new Date(Date.now() - 172800000).toISOString().split('T')[0], // Hace 2 días
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

    // Inicializar Servicios adicionales (para admin)
    if (!localStorage.getItem('mock_servicios')) {
      const services = [
        { id_servicio: 1, nombre: 'Consulta Externa', descripcion: 'Atención primaria y diagnóstico', id_departamento: 1, precio: 30 },
        { id_servicio: 2, nombre: 'Electrocardiograma', descripcion: 'Examen de ritmo cardíaco', id_departamento: 1, precio: 80 },
        { id_servicio: 3, nombre: 'Ecografía Abdominal', descripcion: 'Ultrasonido de órganos abdominales', id_departamento: 2, precio: 120 }
      ];
      localStorage.setItem('mock_servicios', JSON.stringify(services));
    }

    this.isInitialized = true;
  }

  // Métodos de acceso

  static getSpecialties(): MockSpecialty[] {
    this.init();
    return JSON.parse(localStorage.getItem('mock_especialidades') || '[]');
  }

  static getDoctors(): MockDoctor[] {
    this.init();
    return JSON.parse(localStorage.getItem('mock_medicos') || '[]');
  }

  static getDoctorsBySpecialty(specialtyId: number): MockDoctor[] {
    return this.getDoctors().filter(doc => doc.id_especialidad === specialtyId);
  }

  static getPatients(): any[] {
    this.init();
    return JSON.parse(localStorage.getItem('mock_pacientes') || '[]');
  }

  static getServices(): any[] {
    this.init();
    return JSON.parse(localStorage.getItem('mock_servicios') || '[]');
  }

  static login(credentials: { email: string; password?: string }): { status: string; message?: string; data?: any } {
    this.init();
    const users: MockUser[] = JSON.parse(localStorage.getItem('mock_usuarios') || '[]');
    const user = users.find(u => u.email.toLowerCase() === credentials.email.toLowerCase());

    if (!user) {
      return { status: 'ERROR', message: 'Usuario no encontrado.' };
    }

    if (credentials.password && user.password !== credentials.password) {
      return { status: 'ERROR', message: 'Contraseña incorrecta.' };
    }

    // Retornar información adaptada
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
  }

  static register(data: any): { status: string; message?: string } {
    this.init();
    const users: MockUser[] = JSON.parse(localStorage.getItem('mock_usuarios') || '[]');
    const patients = JSON.parse(localStorage.getItem('mock_pacientes') || '[]');

    if (users.some(u => u.email.toLowerCase() === data.email.toLowerCase())) {
      return { status: 'ERROR', message: 'El correo electrónico ya está registrado.' };
    }

    if (patients.some((p: any) => p.dni === data.dni)) {
      return { status: 'ERROR', message: 'El DNI ya se encuentra registrado.' };
    }

    const nextUserId = Math.max(...users.map(u => u.id_usuario), 0) + 1;
    const nextPatientId = Math.max(...patients.map((p: any) => p.id_paciente), 0) + 1;

    const newUser: MockUser = {
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
  }

  static getAppointmentsByPatient(patientId: number): MockAppointment[] {
    this.init();
    const appointments: MockAppointment[] = JSON.parse(localStorage.getItem('mock_citas') || '[]');
    return appointments.filter(app => app.id_paciente === patientId);
  }

  static getAppointmentsByDoctor(doctorId: number): MockAppointment[] {
    this.init();
    const appointments: MockAppointment[] = JSON.parse(localStorage.getItem('mock_citas') || '[]');
    return appointments.filter(app => app.id_medico === doctorId);
  }

  static checkAvailability(doctorId: number, fecha: string, turno: string): boolean {
    this.init();
    const appointments: MockAppointment[] = JSON.parse(localStorage.getItem('mock_citas') || '[]');
    // Simular disponibilidad: un médico solo puede tener hasta 3 citas por turno y día
    const matchCount = appointments.filter(app =>
      app.id_medico === doctorId &&
      app.fecha === fecha &&
      app.turno === turno &&
      app.estado !== 'Cancelada'
    ).length;

    return matchCount < 3;
  }

  static createAppointment(data: any): { status: string; data?: any; message?: string } {
    this.init();
    const appointments: MockAppointment[] = JSON.parse(localStorage.getItem('mock_citas') || '[]');
    const doctors = this.getDoctors();
    const patients = this.getPatients();

    const doctor = doctors.find(d => d.id_medico === data.id_medico);
    const patient = patients.find((p: any) => p.id_paciente === data.id_paciente);

    if (!doctor) return { status: 'ERROR', message: 'Médico no encontrado.' };

    const nextId = Math.max(...appointments.map(app => app.id_cita), 0) + 1;
    const newApp: MockAppointment = {
      id_cita: nextId,
      id_paciente: data.id_paciente,
      id_medico: data.id_medico,
      fecha: data.fecha,
      turno: data.turno,
      estado: 'Pagada', // Automáticamente pagada en la demo
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
  }

  static getPatientMedicalProfile(patientId: number): any {
    this.init();
    const patients = this.getPatients();
    const patient = patients.find((p: any) => p.id_paciente === patientId);

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
  }

  static getPatientHistory(patientId: number): MockAttention[] {
    this.init();
    const attentions: MockAttention[] = JSON.parse(localStorage.getItem('mock_atenciones') || '[]');
    return attentions.filter(att => att.id_paciente === patientId);
  }

  static registerAttention(data: any): { status: string; message?: string } {
    this.init();
    const attentions: MockAttention[] = JSON.parse(localStorage.getItem('mock_atenciones') || '[]');
    const appointments: MockAppointment[] = JSON.parse(localStorage.getItem('mock_citas') || '[]');
    const doctors = this.getDoctors();

    const doctor = doctors.find(d => d.id_medico === data.id_medico);
    const nextId = Math.max(...attentions.map(att => att.id_atencion), 0) + 1;

    const newAtt: MockAttention = {
      id_atencion: nextId,
      id_cita: data.id_cita,
      id_paciente: data.id_paciente,
      id_medico: data.id_medico,
      fecha: new Date().toISOString().split('T')[0],
      motivo: data.motivo,
      diagnostico: data.diagnostico,
      tratamiento: data.tratamiento,
      observaciones: data.observaciones || '',
      nombre_medico: doctor ? `${doctor.nombres} ${doctor.apellidos}` : 'Médico',
      especialidad_nombre: doctor?.especialidad_nombre || ''
    };

    // Marcar cita como atendida
    const appointmentIdx = appointments.findIndex(app => app.id_cita === data.id_cita);
    if (appointmentIdx !== -1) {
      appointments[appointmentIdx].estado = 'Atendida';
      localStorage.setItem('mock_citas', JSON.stringify(appointments));
    }

    attentions.push(newAtt);
    localStorage.setItem('mock_atenciones', JSON.stringify(attentions));

    return { status: 'OK' };
  }

  static addDoctor(data: any): { status: string; message?: string } {
    this.init();
    const doctors: MockDoctor[] = JSON.parse(localStorage.getItem('mock_medicos') || '[]');
    const users: MockUser[] = JSON.parse(localStorage.getItem('mock_usuarios') || '[]');
    const specialties = this.getSpecialties();

    const spec = specialties.find(s => s.id_especialidad === Number(data.id_especialidad));

    const nextDocId = Math.max(...doctors.map(d => d.id_medico), 0) + 1;
    const nextUserId = Math.max(...users.map(u => u.id_usuario), 0) + 1;

    const newDoc: MockDoctor = {
      id_medico: nextDocId,
      id_usuario: nextUserId,
      nombres: data.nombres,
      apellidos: data.apellidos,
      id_especialidad: Number(data.id_especialidad),
      especialidad_nombre: spec ? spec.nombre : 'General',
      numero_colegiatura: data.numero_colegiatura,
      costo_consulta: Number(data.costo_consulta) || 30,
      turno: data.turno || 'Mañana',
      horario_atencion: data.horario_atencion || '08:00 - 13:00',
      email: data.email
    };

    const newUser: MockUser = {
      id_usuario: nextUserId,
      email: data.email,
      nombres: data.nombres,
      apellidos: data.apellidos,
      nombre: `${data.nombres} ${data.apellidos}`,
      tipo_usuario: 'medico',
      id_medico: nextDocId,
      password: data.password || 'medico123'
    };

    doctors.push(newDoc);
    users.push(newUser);

    localStorage.setItem('mock_medicos', JSON.stringify(doctors));
    localStorage.setItem('mock_usuarios', JSON.stringify(users));

    return { status: 'OK' };
  }
}
