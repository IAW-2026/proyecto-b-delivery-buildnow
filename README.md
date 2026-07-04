[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-22041afd0340ce965d47ae6ef1cefeee28c7c493a6346c4f15d667ab976d596c.svg)](https://classroom.github.com/a/Bq5YHSVI)

# delivery

Aplicación **Delivery** del [Proyecto IAW 2026](https://iaw-2026.github.io/proyecto/) — comisión `buildnow`.

Esta app corresponde al rol del repartidor en el proyecto de tipo **B (Delivery)**.

🔗 [Link al deploy de producción](https://proyecto-b-delivery-buildnow.vercel.app)

---

## Usuarios disponibles

> **Contraseña para todas las cuentas:** `iawuser#`

- `admin+clerk_test@iaw.com`
- `delivery1+clerk_test@iaw.com`
- `delivery2+clerk_test@iaw.com`
- `delivery3+clerk_test@iaw.com`
- `delivery4+clerk_test@iaw.com`
- `delivery5+clerk_test@iaw.com`

---

## Instrucciones para utilizar aplicación

1. Ingresar a la plataforma utilizando cualquiera de los usuarios de prueba provistas arriba según el rol que desee evaluar.
2. Flujo de Entrega (**Delivery**):
   - Explore el listado de órdenes disponibles y seleccione una para iniciar el envío.
   - Cambie el estado de la orden.
   - Al finalizar la entrega, puede acceder a la sección "Ver Cuenta" para ver la solicitud de pago generada (en estado pendiente). Puede también revisar el historial de anteriores entregas.
3. En ambos roles, acceda a "Ver Cuenta" para editar los datos personales del usuario autenticado.

---

## Descripción del proyecto

**buildNOW** es una aplicación web integral de logística orientada al mercado de materiales de construcción. El sistema optimiza y conecta las necesidades de corralones (vendedores), clientes (compradores) y repartidores en una única arquitectura eficiente basada en Next.js, Prisma y Vercel.

La plataforma segmenta su experiencia a través de dos roles principales:

> **Administrador:** Dispone de un panel de control estratégico con métricas en tiempo real sobre el funcionamiento del sistema, permitiéndole gestionar de manera centralizada el estado de los pedidos y la información de los repartidores.

> **Delivery:** Ofrece una interfaz móvil-first enfocada en la productividad del repartidor. Este flujo le permite visualizar los pedidos pendientes de distribución, tomar órdenes de forma autónoma, trazar rutas en vivo para las entregas, realizar el seguimiento de sus pedidos tomados y gestionar sus solicitudes de cobro (payouts), promoviendo un ecosistema de trabajo transparente y ágil.

---

## Notas y comentarios

- **Accesibilidad y Contraste:** Durante la etapa de optimización mediante Lighthouse, se ajustó la paleta cromática original (especialmente en botones y pestañas activas basados en tonos naranjas) para garantizar un ratio de contraste.
- **Rendimiento en Testing:** El puntaje de performance en el entorno de testing puede presentar fluctuaciones menores debido a dos factores de la infraestructura de desarrollo:
  1. El uso de cookies y scripts de terceros por parte del middleware de autenticación de Clerk.
  2. Eventuales "arranques en frío" de las funciones Serverless en Vercel al conectar con la base de datos a través de Prisma.
- **Manejo de Direcciones:** Siguiendo el contrato de interfaces establecido con el equipo, se estipuló que las ubicaciones de recogida y entrega se recibirían estrictamente en formato de texto (string) y no como coordenadas geográficas. Para respetar este acuerdo sin alterar las APIs de mis compañeros, diseñé e implementé lógica adicional de procesamiento para consumir las direcciones y renderizarlas correctamente.
- **Integración de Mapas:** Inicialmente se evaluó usar OpenRouteService para trazar el recorrido, pero debido a la complejidad del entorno se optó por una solución más eficiente: renderizar mapas directamente a través de la API de Google Maps, garantizando el impacto visual de la ruta entre el punto de origen y el destino sin comprometer los tiempos de entrega del proyecto (aunque el tiempo de recorrido no coincida con el calculado).
- **Límites de API y Caché:** La aplicación utiliza los servicios gratuitos de OpenStreetMap Nominatim y OpenRouteService. Para mitigar sus restricciones de peticiones y evitar consultas repetidas, se implementó la tabla GeocodeCache en la base de datos. Sin embargo, ante cargas masivas simultáneas o recargas continuas en la corrección, la API puede devolver un error 429 Rate Limit Exceeded. Si esto ocurre, se solicita esperar unos minutos hasta que la cuota de solicitudes se restablezca automáticamente.
- **Registro de Usuarios:** Al registrar un nuevo usuario, solamente se puede crear uno de tipo Delivery. Por default, se le asigna tipo de vehiculo "motorbike". Si se quiere cambiar ir a "ver cuenta".

---

Enunciado completo: <https://iaw-2026.github.io/proyecto/>
