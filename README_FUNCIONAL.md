# Dashboard Gerente - version funcional

Este paquete convierte el dashboard estatico en una app con guardado real:

- `app.js` sigue manejando la interfaz.
- `/api/login` crea una sesion temporal usando la contrasena configurada en Vercel.
- `/api/state` lee y guarda los datos en Supabase.
- `db/schema.sql` crea la tabla `dashboard_app_state`.
- `localStorage` queda solo como respaldo local/offline.

Importante: conserva tu `styles.css` actual. No venia en los archivos subidos a ChatGPT, por eso no esta incluido aqui.

## 1. Crear la base de datos

En Supabase:

1. Crea un proyecto.
2. Abre SQL Editor.
3. Pega y ejecuta el contenido de `db/schema.sql`.

Eso crea una tabla:

```sql
public.dashboard_app_state
```

La app guarda un JSON con clientes, actividades, equipo y notas. Es el MVP mas rapido para volver funcional tu app sin redisenar toda la interfaz.

## 2. Configurar variables en Vercel

En Vercel > Project > Settings > Environment Variables agrega:

```env
SUPABASE_URL=https://TU-PROYECTO.supabase.co
SUPABASE_SERVICE_ROLE_KEY=TU_SERVICE_ROLE_KEY
APP_PASSWORD=TU_CONTRASENA_DE_ACCESO
APP_SESSION_SECRET=UN_TEXTO_LARGO_ALEATORIO
```

No pongas `SUPABASE_SERVICE_ROLE_KEY` dentro de `app.js`, `index.html` ni ningun archivo publico.

## 3. Subir archivos a GitHub

En tu repo `Dashboard-Gerente`, agrega o reemplaza:

```text
index.html
app.js
api/_auth.js
api/login.js
api/state.js
db/schema.sql
package.json
.env.example
README_FUNCIONAL.md
```

Tambien deja tu `styles.css` actual en la raiz del proyecto.

## 4. Desplegar

Haz commit y push. Vercel debe detectar el cambio y desplegar.

Usa la URL de Vercel, no GitHub Pages. GitHub Pages no ejecuta la carpeta `/api`.

## 5. Probar

1. Abre la app en Vercel.
2. Ingresa la contrasena que pusiste en `APP_PASSWORD`.
3. Crea un cliente o una actividad.
4. Recarga la pagina.
5. Abre la app en otro navegador, inicia sesion y revisa que el cambio aparezca.

## Siguiente mejora recomendada

Esta version guarda todo en una fila JSONB. Funciona y es rapida para tu caso actual. Cuando quieras permisos por usuario reales, lo ideal es separar en tablas:

- users / profiles
- clients
- activities
- comments
- meeting_notes
- audit_log

Ahi se puede agregar Supabase Auth y Row Level Security por rol: gerente, contador y auxiliar.
