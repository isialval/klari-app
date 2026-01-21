# Klari — Skincare Routine App

Aplicación mobile de skincare desarrollada con **React Native (Expo)** y **TypeScript**, enfocada en la creación y gestión de rutinas personalizadas según el tipo de piel y las metas del usuario.

## ✨ Qué hace

- Onboarding donde el usuario define su tipo de piel (seca, normal, mixta, grasa o sensible) y sus metas (poros, manchas, líneas de expresión, etc.).
- Generación automática de rutinas de día y noche según el perfil del usuario.
- Exploración de productos por categoría (limpiadores, tónicos, sérums, hidratantes, etc.).
- Gestión de favoritos y mis productos.
- Edición completa de rutinas con productos sugeridos por el sistema o seleccionados por el usuario.

## 🧴 Rutinas personalizadas

- **Día:** limpiador, sérum, hidratante y protector solar.
- **Noche:** limpiador, sérum e hidratante.
- Las rutinas pueden editarse añadiendo, quitando o reemplazando pasos y productos desde sugerencias del sistema, favoritos o mis productos.

## 🛠️ Stack

- React Native + Expo
- TypeScript
- Tailwind CSS (NativeWind)

## 🔗 Backend / API

Esta aplicación consume una API REST desarrollada en **Spring Boot**.

👉 **Repositorio del backend:**
https://github.com/isialval/klari-api

## 👤 Mi rol

- Desarrollo completo del frontend
- Integración con API REST
- Manejo de estado y navegación

## ⚙️ Configuración (.env)

Esta app consume una API REST desarrollada en Spring Boot.

1. Copia el archivo de ejemplo:

```
cp .env.example .env
```

2. Configura la URL de la API:

```
EXPO_PUBLIC_API_URL=http://localhost:8080/api
```

> Nota: en un dispositivo físico debes usar la IP local de tu PC
> (ej: [http://192.168.x.x:8080/api](http://192.168.x.x:8080/api))

## 🚀 Cómo correr el proyecto

1. Instala dependencias:

```
npm install
```

2. Inicia la app:

```
npx expo start
```

Luego puedes abrirla en Expo Go, un emulador Android o el simulador iOS.

## Vista Previa

### Onboarding

<p align="center">
  <img src="assets/preview/1.gif" width="200" />
</p>

### Rutinas personalizadas

<p align="center">
  <img src="assets/preview/2.gif" width="200" />
</p>

## 💡 Aprendizajes

- Implementación de flujos de personalización basados en preferencias del usuario
- Integración frontend–backend en aplicaciones móviles
- Organización de proyectos con file-based routing en Expo
