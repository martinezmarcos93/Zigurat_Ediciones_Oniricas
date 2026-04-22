# Deploy en Render — Instrucciones paso a paso

## Estructura de archivos necesaria

Antes de subir, verificar que el proyecto tenga esta estructura:

```
zigurat/
├── index.html
├── server.py          ← contiene la función app() que Render ejecuta
├── main.js
├── styles.css
├── requirements.txt   ← solo tiene: gunicorn
└── assets/
    ├── icons/
    │   ├── logo blanco-22.png
    │   └── ZEO SIN FONDO-12.png
    └── colections/
        ├── Colección Dorada.png
        ├── Colección Azul 1.png … Colección Azul 4.png
        ├── Colección Verde 1.png … Colección Verde 6.png
        └── Colección Violeta 1.png … Colección Violeta 9.png
```

---

## Paso 1 — Subir el proyecto a GitHub

Render necesita un repositorio. Si no tenés Git instalado:

1. Ir a [github.com/new](https://github.com/new)
2. Crear repositorio privado llamado `zigurat-web`
3. Subir todos los archivos (drag & drop en la interfaz web de GitHub sirve)

Si tenés Git:
```bash
git init
git add .
git commit -m "Zigurat web v1"
git remote add origin https://github.com/TU_USUARIO/zigurat-web.git
git push -u origin main
```

---

## Paso 2 — Crear el servicio en Render

1. Ir a [render.com](https://render.com) e iniciar sesión
2. Click en **"New +"** → **"Web Service"**
3. Conectar el repositorio `zigurat-web`
4. Configurar el servicio:

| Campo | Valor |
|---|---|
| **Name** | `zigurat-web` |
| **Region** | Oregon (US West) o el más cercano |
| **Branch** | `main` |
| **Runtime** | `Python 3` |
| **Build Command** | `pip install -r requirements.txt` |
| **Start Command** | `gunicorn server:app` |
| **Instance Type** | `Free` (suficiente para empezar) |

5. Click en **"Create Web Service"**

Render va a instalar `gunicorn`, correr el servidor y darte una URL tipo:
`https://zigurat-web.onrender.com`

---

## Paso 3 — Variable de entorno (ya configurada en el código)

El `server.py` detecta automáticamente que está en Render leyendo la variable `RENDER=true` que Render inyecta solo. No hay que configurar nada extra.

---

## Paso 4 — Verificar que funciona

Una vez deployado:

- `https://tu-app.onrender.com` → debe mostrar el sitio
- `https://tu-app.onrender.com/subscribe` (POST con `{"email":"test@test.com"}`) → debe devolver `{"ok":true,"new":true}`

---

## Paso 5 — Ver los suscriptores

Los emails se guardan en `subscribers.txt` en el servidor.

**Localmente** (durante desarrollo):
```
http://localhost:8080/subscribers
```

**En producción** con Render, el archivo vive en el servidor pero se puede ver desde los logs o conectarse por SSH si tenés plan pago. En el plan gratuito, la forma más simple es revisar los logs de Render — cada suscripción nueva imprime una línea `[+] Nuevo suscriptor: email@ejemplo.com`.

> **Nota importante sobre el plan gratuito de Render:** Los servicios gratuitos se "duermen" después de 15 minutos de inactividad y el disco no es persistente entre deploys. Esto significa que `subscribers.txt` se puede perder si hay un nuevo deploy. Para producción real con persistencia garantizada, hay dos opciones:
> - Actualizar al plan Starter de Render (~$7/mes) que tiene disco persistente
> - O migrar los emails a una hoja de Google Sheets via API (más trabajo pero gratis)

---

## Dominio personalizado (opcional)

Si tenés un dominio (ej. `ziguratediciones.com`):

1. En el panel de Render → **Settings** → **Custom Domains**
2. Agregar el dominio
3. Render te da los registros DNS que hay que configurar en tu registrador (GoDaddy, Namecheap, etc.)

---

## Actualizar el sitio después del deploy

Cada vez que hacés cambios:

```bash
git add .
git commit -m "descripción del cambio"
git push
```

Render detecta el push automáticamente y re-deploya en ~1-2 minutos.
