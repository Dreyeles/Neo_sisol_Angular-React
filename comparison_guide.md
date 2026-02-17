# Guía de Comparación: SISOL React vs Angular

Esta guía resume las diferencias técnicas clave entre ambas implementaciones para apoyar tu exposición.

## 1. Arquitectura de Componentes

| Característica | React (`neo_sisol_react2`) | Angular (`neo_sisol_angular`) |
| :--- | :--- | :--- |
| **Estructura** | Componentes Funcionales. | Clases con Decoradores (`@Component`). |
| **Lógica y Vista** | Mezcladas en el mismo archivo `.jsx` (JSX). | Separación estricta: `.ts` (lógica) y `.html` (vista). |
| **Estilos** | Archivos `.css` importados directamente. | Estilos encapsulados por componente. |

## 2. Registro de Pacientes: Diferencias Técnicas

| Aspecto | React (`Register.jsx`) | Angular (`register.component.ts`) |
| :--- | :--- | :--- |
| **Control de Datos** | `useState` (Cualquier cambio refresca el estado local). | `FormGroup` (El framework gestiona el árbol de datos). |
| **Validación** | Función manual `validate()` con lógica imperativa. | Validadores declarativos (`Validators.required`, `pattern`). |
| **Confirmación Pass** | Comparación simple en el `validate()`. | Validador personalizado (`passwordMatchValidator`). |
| **Petición API** | `fetch` nativo con `JSON.stringify`. | `HttpClient` de Angular (basado en Observables). |
| **Funciones Extra** | Manejo de UI (tecla ESC, scroll del body). | Lógica de negocio (filtro de provincias y distritos). |

## 3. Agendamiento de Citas y Pasarela de Pago

Ambas versiones implementan un flujo de **Agendamiento -> Verificación de Disponibilidad -> Pago -> Confirmación**.

| Aspecto | React (`Dashboard.jsx`) | Angular (`patient-dashboard.component.ts`) |
| :--- | :--- | :--- |
| **Flujo de Pago** | Modal controlado por estado `showPaymentModal`. | Modal controlado por variable `showPaymentModal`. |
| **Disponibilidad** | Verificación asíncrona con `fetch` y debounce manual. | Verificación mediante `AppointmentService` con `RxJS`. |
| **Envío de Datos** | Payload construido manualmente en `handleConfirmPayment`. | Objeto `payload` enviado a través del servicio inyectado. |
| **Confirmación** | `alert()` y reseteo manual de múltiples estados `useState`. | `alert()` y llamada al método `resetForm()` de la clase. |

## 4. Gestión de Formularios y Validación

*   **React:** Utiliza un enfoque **manual (Controlled Components)**. Se usa `useState` para seguir cada cambio de tecla (`handleChange`) y una función manual `validate()` con expresiones regulares.
*   **Angular:** Utiliza **Formularios Reactivos (`ReactiveForms`)**. Es un enfoque más robusto donde el estado del formulario se define en TypeScript (`FormGroup`, `FormBuilder`) y las validaciones son automáticas mediante `Validators`.

## 3. Navegación y Enrutamiento

> [!IMPORTANT]
> Esta es una de las diferencias más grandes en tu implementación actual.
> - **Angular:** Usa el **Router oficial**. Las rutas están definidas en `app.routes.ts` y cambian la URL del navegador (e.g., `/doctor`, `/admin`).
> - **React:** Usa **Renderizado Condicional**. En `App.jsx`, se decide qué componente mostrar basándose en el estado `isAuthenticated` y el rol del usuario, sin cambiar necesariamente la URL (`react-router-dom` no está siendo usado en esta versión).

## 4. Servicios y Comunicación con la API

*   **Angular (Servicios Centralizados):** Utiliza un `AuthService` inyectable que maneja la persistencia (`localStorage`) y el estado del usuario mediante **RxJS (`BehaviorSubject`)**. Las peticiones se hacen con `HttpClient` (que devuelve Observables).
*   **React (Estado Local):** La lógica de autenticación y persistencia está más distribuida. El estado del usuario se mantiene en el componente raíz (`App.jsx`) y se pasa a los hijos mediante *props*. Las peticiones usan el estándar nativo `fetch` con `async/await`.

## 5. El "Punto de Unión": Backend Compartido

Un punto fuerte para tu exposición es que, a pesar de las diferencias visuales y estructurales en el frontend, **ambos proyectos consumen la misma API**:
- Backend en **Node.js + Express**.
- Base de datos **MySQL**.
- Estructura de endpoints (`/api/auth`, `/api/citas`, etc.) idéntica.

## Resumen para la Exposición

> [!TIP]
> Puedes explicar que **React** te dio más flexibilidad y velocidad para prototipar la interfaz, mientras que **Angular** te proporcionó una estructura más sólida y escalable para un sistema médico empresarial gracias a su tipado fuerte (TypeScript) y su sistema de inyección de dependencias.
