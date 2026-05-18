# 🔐 Proyecto Seguridad UC

🌐 **Ver online:** [https://libro-de-reclamos-login.netlify.app/](https://libro-de-reclamos-login.netlify.app/)


### Vistas disponibles

| Ruta | Descripción |
|------|-------------|
| `/` | Página de inicio con links a las simulaciones | 
| `/eduram` | Simulación de login de Microsoft 365 UC |
| `/micomunidad` | Simulación de otra página |
| `/leccion-seguridad` | Lección educativa sobre phishing |

⚠️⚠️⚠️ De momento solo está el de eduram bien, la primera es para debugear, los qr los ponemos desde ya conn las vistas, y las otras aun no las hago. 

🟢🟢🟢 Al inspecionar he ir a consola se muetra el número de visisitas que ha tenido cada vista.
---

## Correrlo en local

### Requisitos previos

Necesitas tener instalado en tu computador:

- [Node.js](https://nodejs.org/) (versión 18 o superior) — para correr el proyecto
- [Git](https://git-scm.com/) — para clonar el repositorio

Puedes verificar si ya los tienes abriendo una terminal y escribiendo:

```bash
node --version
git --version
```

Si ambos muestran un número de versión, estás lista. Si no, instálalos desde los links de arriba.

---

### Paso 1 — Clonar el repositorio

Abre una terminal, navega a la carpeta donde quieres guardar el proyecto y ejecuta:

```bash
git clone https://github.com/16Kmi16/Proyecto_seguridad.git
```

Luego entra a la carpeta del proyecto:

```bash
cd Proyecto_seguridad/experimentoSEG
```

---

### Paso 2 — Instalar dependencias

Ejecuta este comando para instalar todo lo necesario:

```bash
npm install
```

---

### Paso 3 — Configurar las variables de entorno

El proyecto usa Supabase para contar visitas globalmente. Necesitas crear un archivo `.env` en la carpeta `experimentoSEG` con estas variables:

```
VITE_SUPABASE_URL=***
VITE_SUPABASE_ANON_KEY=***
```
esto te lo mandé por wsp

---

### Paso 4 — Correr el proyecto

```bash
npm run dev
```

Abre tu navegador en [http://localhost:5173](http://localhost:5173) y verás la app funcionando.

---

## Tecnologías usadas

- **React + TypeScript** — framework principal
- **Vite** — bundler y servidor de desarrollo
- **React Router** — navegación entre vistas
- **Supabase** — base de datos para el contador global de visitas
- **Netlify** — plataforma de deploy via GitHub Actions

---

## ⚠️IMPORTANTE⚠️ Deploy automático

Cada vez que se hace `push` a la rama `main`, GitHub Actions construye el proyecto automáticamente y lo despliega en Netlify. No hay que hacer nada manual. Pero segun el profe de web si hacemos muchos push nos pueden empezar a cobrar. Asi que haz una rama "dev" y de ahí las sub ramas segun lo que vas haciendo. y cuando esté como bien avanzado y mergiado en dev le hacemos merge a main para no tener problemas. en resumen:

🚨⚠️ NO TRABAJES DIRECTO EN MAIN ⚠️🚨
