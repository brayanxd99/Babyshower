# 🎀 Baby Shower - Lista de Regalos

Esta es la aplicación web para la lista de regalos del Baby Shower, con un diseño tierno (Rosa empolvado, lila suave, beige), y la funcionalidad para reservar cantidades limitadas de productos.

## 🚀 Cómo subir esto a tu GitHub y Vercel

### Paso 1: Subir a GitHub
1. Entra a [GitHub](https://github.com/) e inicia sesión.
2. Crea un nuevo repositorio (por ejemplo, `baby-shower-lista`). **No marques** "Add a README file".
3. Abre una terminal en la carpeta de este proyecto (`C:\Users\SOPORTEPQ\.gemini\antigravity\scratch\baby-shower-registry`) y ejecuta los siguientes comandos:
   ```bash
   git add .
   git commit -m "Versión inicial de la lista de regalos"
   git branch -M main
   git remote add origin https://github.com/TU_USUARIO/baby-shower-lista.git
   git push -u origin main
   ```
   *(Asegúrate de cambiar la URL por la de tu repositorio).*

### Paso 2: Desplegar en Vercel y crear la Base de Datos
1. Entra a [Vercel](https://vercel.com/) e inicia sesión con tu cuenta de GitHub.
2. Haz clic en **Add New Project** y selecciona el repositorio `baby-shower-lista` que acabas de subir.
3. **¡Espera antes de darle a Deploy!** Necesitamos crear la base de datos.
4. En Vercel, ve a la pestaña **Storage** (arriba a la izquierda) y haz clic en **Create Database** > **Postgres**. Sigue los pasos para crearla.
5. Vuelve a tu proyecto en Vercel, ve a **Settings** > **Environment Variables**. Vercel habrá añadido automáticamente una variable llamada `DATABASE_URL`.
6. En **Settings** > **Build & Development Settings**, asegúrate de que el **Build Command** sea:
   ```bash
   npx prisma generate && npx prisma db push && npm run build
   ```
   *Esto es muy importante, ya que `prisma db push` creará las tablas en tu base de datos.*
7. Ahora sí, haz clic en **Deploy** en la pestaña *Deployments*.

### Paso 3: Subir los datos iniciales (Productos)
Una vez que el proyecto esté desplegado, necesitas cargar los productos.
1. Abre tu terminal de nuevo.
2. Ejecuta este comando conectándote a la URL de la base de datos de Vercel (la encuentras en Storage):
   ```bash
   $env:DATABASE_URL="TU_URL_DE_VERCEL_AQUI"
   npx prisma db seed
   ```
   *(Esto ejecutará el archivo `prisma/seed.ts` y llenará la base de datos con los regalos del excel).*

## 🔐 Panel de Administración (Padres)
Para ver quién ha reservado qué regalo, simplemente ingresa a la ruta `/admin` de tu página:
- `https://tu-pagina.vercel.app/admin`

*(Por ahora el panel está abierto, si deseas protegerlo podemos agregar una contraseña simple más adelante).*
