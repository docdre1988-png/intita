# 🐉 Landing Page: Cajita Musical Portarretrato Dragon Ball GT ("Mi Corazón Encantado")

Landing page de alta conversión optimizada para venta directa de la **Cajita Musical Portarretrato de Madera de Bambú** con cierre por **WhatsApp**, reproductor interactivo de melodía y contenedor de video para TikTok.

---

## 🚀 Características Principales

1. **Diseño Visual Inspirado en el Mockup UI:**
   - Hero Section con 2 columnas (desktop) y 1 columna fluida (móvil).
   - Marco de video vertical para enlaces de TikTok en el lado derecho.
   - Efectos Glassmorphism, paleta cálida de madera de bambú y animaciones suaves.

2. **Cierre de Venta Optimizado a WhatsApp:**
   - Todos los botones ("QUIERO LA MÍA", "Pedir por WhatsApp", Barra Flotante) envían un mensaje estructurado con el desglose exacto de la compra.

3. **Personalizador Interactivo en Tiempo Real:**
   - **Precio Base:** S/ 80 (Cajita Musical + Caja de Regalo + Guía de Cuidados).
   - **Opción 1:** 2 Fotos impresas en papel fotográfico (+S/ 5).
   - **Opción 2:** Grabado láser personalizado (+S/ 6) con campo de texto para dedicatoria o nombres.
   - Calcula el total dinámicamente y lo adjunta al mensaje de WhatsApp.

4. **Reproductor de Melodía Real (Web Audio API):**
   - El botón **"Probar Melodía"** reproduce las notas de campana/cajita de música de *"Mi Corazón Encantado"* directamente en el navegador con ecualizador visual dinámico.

5. **Integración con Videos de TikTok:**
   - Botón superior **"Config TikTok"** para cambiar el link del video en cualquier momento sin tocar código.
   - También se puede definir el link por defecto en `app.js`.

6. **Información Logística y de Confianza en Perú:**
   - Pestañas interactivas para **Shalom** (S/ 8 con opción de adelanto 50% y saldo al llegar) y **Olva Courier** a domicilio.
   - Tiempos de entrega para Lima (2-3 días) y Provincias (2-5 días).
   - Testimonios con reseñas y puntuación de 5 estrellas.
   - Sección de Preguntas Frecuentes (FAQ) en acordeón interactivo.
   - Barra fija inferior en celulares (Sticky Mobile Bar) para maximizar la tasa de conversión.

---

## ⚙️ Cómo Personalizar Tu Tienda

### 1. Cambiar tu número de WhatsApp
Abre el archivo `app.js` y edita la línea superior:
```javascript
const CONFIG = {
  whatsappPhone: "51922590492", // Número configurado de WhatsApp Intita Casa de Regalos
  basePrice: 80,
  photoPrice: 5,
  engravePrice: 6,
  tiktokDefaultUrl: "https://www.tiktok.com/@tu_cuenta/video/TU_VIDEO_ID"
};
```

### 2. Cambiar el Video de TikTok
- **Opción A (Desde la propia web):** Haz clic en el botón **"Config TikTok"** en la barra superior de la página, pega el enlace de tu video de TikTok y presiona *Guardar*.
- **Opción B (En el código):** Cambia `tiktokDefaultUrl` en `app.js`.

---

## 🌐 Cómo Probar y Desplegar

- Puedes abrir directamente el archivo `index.html` en cualquier navegador (Chrome, Edge, Safari, Firefox).
- Para subirla a internet puedes usar **Vercel**, **Netlify**, **GitHub Pages** o tu propio hosting cPanel/Hostinger con solo arrastrar la carpeta.
