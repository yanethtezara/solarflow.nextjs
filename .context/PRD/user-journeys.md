# User Journeys: SolarFlow
---
## Journey 1: Registro y Primera Gestión Completa (Happy Path)
-   **Journey Title:** Registro y Primera Gestión Completa
-   **Persona:** Javier "Javi" Morales
-   **Scenario:** Javi acaba de oír hablar de SolarFlow en un foro de instaladores. Decide
      probarlo en su portátil una noche, después del trabajo, para ver si puede reemplazar su
      caótico sistema de notas.
---
### Steps
**Step 1: Descubrimiento y Registro**
-   **User Action:** Javi navega a la página de inicio de SolarFlow y hace clic en
      "Registrarse".
-   **System Response:** Muestra un formulario simple pidiendo email y contraseña, con el
      logo de SolarFlow visible.
-   **Pain Point:** Si el formulario pidiera demasiados datos (ej. nombre de la empresa,
      teléfono) desde el inicio, podría abandonarlo.
**Step 2: Creación de Cuenta**
-   **User Action:** Javi introduce su email y una contraseña segura. Hace clic en "Crear
      Cuenta".
-   **System Response:** El sistema valida los datos. Crea la cuenta, lo autentica
      automáticamente y lo redirige al Dashboard/Calendario, que está vacío. Muestra un mensaje d
      bienvenida.
-   **Pain Point:** Si el sistema no diera feedback inmediato (un spinner de carga y luego
      mensaje), Javi podría pensar que se ha colgado.
**Step 3: Creación de un Cliente**
-   **User Action:** Javi ve una interfaz limpia y decide agregar a su próximo cliente. Va
      la sección "Clientes" y hace clic en "Nuevo Cliente".
-   **System Response:** Presenta un formulario para los datos del cliente (nombre,
      dirección, teléfono).
-   **Pain Point:** La navegación para encontrar "Clientes" debe ser extremadamente obvia
      (ej. un ícono claro en un menú lateral).
**Step 4: Creación de un Trabajo**
-   **User Action:** Con el cliente ya creado, Javi va al Calendario y hace clic en el día
      la instalación. Se le presenta la opción de crear un nuevo trabajo.
-   **System Response:** Abre el formulario de "Nuevo Trabajo", con la fecha ya seleccionad
      Javi puede seleccionar al cliente que acaba de crear desde un desplegable.
-   **Pain Point:** Si tuviera que escribir el nombre del cliente a mano en lugar de
      seleccionarlo, podría cometer errores y crearía datos duplicados.
**Step 5: Completar Datos del Trabajo**
-   **User Action:** Javi añade los materiales que necesita desde su catálogo pre-cargado y
      el costo de la mano de obra. Guarda el trabajo.
-   **System Response:** El trabajo aparece en la vista de Calendario y en la Lista de
      Trabajos con el estado "Agendado". Se muestra un toast de "Trabajo creado con éxito".
-   **Pain Point:** La carga de materiales debe ser rápida. Si tuviera que añadirlos uno po
      uno manualmente cada vez, el proceso sería tedioso.
**Step 6: Completar y Facturar el Trabajo**
-   **User Action:** Días después, tras realizar la instalación, Javi abre la app en su
      móvil, busca el trabajo y cambia su estado a "Completado". Inmediatamente, hace clic en
      "Generar Factura".
-   **System Response:** El sistema le presenta una vista previa de la factura con todos lo
      datos y el cálculo total. El botón "Descargar PDF" está visible.
-   **Pain Point:** Si la vista previa de la factura no fuera idéntica al PDF final,
      generaría desconfianza.
**Step 7: Descargar Factura**
-   **User Action:** Javi hace clic en "Descargar PDF".
-   **System Response:** El navegador descarga el archivo PDF de la factura, listo para ser
      enviado al cliente. El sistema muestra un toast de "Factura descargada".
-   **Pain Point:** El PDF debe tener un nombre de archivo lógico (ej.
      `Factura-001-NombreCliente.pdf`), no uno genérico como `output.pdf`.
---
### Expected Outcome
Javi ha gestionado con éxito todo el ciclo de vida de un trabajo dentro de SolarFlow, desde
      la creación del cliente hasta la facturación, de manera rápida y sin fricción. Percibe
      inmediatamente el valor frente a su antiguo método.
### Alternative Paths / Edge Cases
-   ¿Qué pasa si el email de registro ya existe? El sistema debe mostrar un error en línea
      ("Este email ya está en uso. ¿Quieres iniciar sesión?").
-   ¿Qué pasa si la conexión se pierde mientras se guarda un formulario? El sistema debería
      intentar reanudar o al menos guardar los datos en el local storage para no perderlos.
---
## Journey 2: Error de Validación al Crear un Trabajo (Edge Case)
-   **Journey Title:** Error de Validación al Crear un Trabajo
-   **Persona:** David Rojas
-   **Scenario:** David está apurado, intentando agendar 5 trabajos seguidos para su equipo
      desde su tablet. En uno de ellos, olvida seleccionar un cliente.
---
### Steps
**Step 1: Intento de Creación Rápida**
-   **User Action:** David está en el formulario "Nuevo Trabajo". Rellena la fecha y los
      materiales, pero se olvida de seleccionar un cliente en el desplegable. Hace clic en "Guard
      Trabajo".
-   **System Response:** El sistema detecta que el campo `clientId` es obligatorio y está
      vacío. **No guarda el formulario.**
-   **Pain Point:** Si el sistema guardara el trabajo con datos incompletos, podría causar
      problemas de facturación y seguimiento más adelante.
**Step 2: Feedback de Error**
-   **User Action:** David ve que la página no ha cambiado.
-   **System Response:** El sistema resalta el campo "Cliente" en rojo y muestra un mensaje
      de error claro justo debajo: "Debes seleccionar un cliente." La página hace scroll
      automáticamente hasta el primer campo con error.
-   **Pain Point:** Un mensaje de error genérico como "Error al guardar" sería frustrante.
      feedback debe ser específico y accionable.
**Step 3: Corrección y Guardado Exitoso**
-   **User Action:** David ve el error, selecciona el cliente correcto del desplegable y
      vuelve a hacer clic en "Guardar Trabajo".
-   **System Response:** El sistema valida que todos los campos obligatorios están completo
      y guarda el trabajo. Muestra un toast de "Trabajo creado con éxito" y lo redirige a la vist
      de calendario.
-   **Pain Point:** Si el sistema borrara los datos que David ya había introducido
      (materiales, descripción) al mostrar el error, la frustración sería máxima.
---
### Expected Outcome
David es guiado por la interfaz para corregir su error sin perder el trabajo que ya había
      introducido, lo que le permite mantener su ritmo de trabajo a pesar del despiste inicial.
### Alternative Paths / Edge Cases
-   ¿Qué pasa si el usuario introduce una fecha pasada por error? El sistema podría mostrar
      una advertencia no bloqueante: "¿Estás seguro de que quieres agendar un trabajo en el
      pasado?".
-   ¿Qué pasa si el usuario intenta guardar un trabajo sin conexión a internet? El sistema
      debería mostrar un mensaje claro "Sin conexión. Se guardará automáticamente cuando recupere
      la conexión" (funcionalidad avanzada, pero buen ideal).
