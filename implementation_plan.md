# Unificación de Backend para Angular y React

Este plan detalla los pasos para consolidar el backend de ambos proyectos en un único servicio centralizado, optimizando recursos y asegurando la consistencia de los datos.

## User Review Required

> [!IMPORTANT]
> Se ha detectado que `neo_sisol_angular` usa `sisol_db` y `neo_sisol_react2` usa `sisol2_bd`.
> - Se propone utilizar `sisol2_bd` como la base de datos única, ya que es la que se pobló recientemente con la información de producción de los doctores.
> - Si existen datos en `sisol_db` (como pacientes registrados o citas antiguas) que no estén en `sisol2_bd`, se perderán a menos que se realice una migración manual.

## Cambios Propuestos

### Backend Central
Se utilizará el backend ubicado en `neo_sisol_react2/backend-central` como el único servidor de la API.

#### [MODIFY] [.env](file:///c:/Users/User/Desktop/TAREAS/CICLO_4/Desarrollo%20de%20aplicaciones%20Backend/SISOL/neo_sisol_react2/backend-central/.env)
- Verificar que `DB_NAME=sisol2_bd`.
- Asegurar que el puerto sea `5000`.

### Proyecto Angular (`neo_sisol_angular`)
El proyecto Angular se conectará al backend centralizado.

#### [MODIFY] [proxy.js](file:///c:/Users/User/Desktop/TAREAS/CICLO_4/Desarrollo%20de%20aplicaciones%20Backend/SISOL/neo_sisol_angular/proxy.js)
- Confirmar que el target sea `http://localhost:5000`. (Ya está configurado así).

### Proyecto React (`neo_sisol_react2`)
Ya está configurado para usar el backend centralizado a través de sus scripts de `package.json`.

## Plan de Verificación

### Pruebas Automatizadas
1. **Verificación de Conexión:**
   - Ejecutar el backend central: `node server.js`.
   - Probar el endpoint de salud: `curl http://localhost:5000/api/health`.
   - Probar la conexión a la base de datos: `curl http://localhost:5000/api/test-db`.

### Verificación Manual
1. **Frontend Angular:**
   - Iniciar el servidor unificado: `node proxy.js` (en la raíz de Angular).
   - Acceder a `http://localhost:4200`.
   - Intentar iniciar sesión con un usuario existente en `sisol2_bd`.
2. **Frontend React:**
   - Iniciar el proyecto: `npm start` (en la carpeta `neo-sisol`).
   - Acceder a `http://localhost:3000`.
   - Verificar que los datos mostrados (médicos, especialidades) coincidan con los de `sisol2_bd`.
