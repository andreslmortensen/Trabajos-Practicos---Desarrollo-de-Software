
// Seleccionar elementos del DOM
const btnCargar = document.getElementById('cargar');
const galeria = document.getElementById('galeria');
const loader = document.getElementById('loader');
const errorDiv = document.getElementById('error');

// Función para obtener un personaje aleatorio de Los Simpsons
async function obtenerPersonajeSimpsons() {
    console.log('🔍 Intentando obtener personaje...');
    const response = await fetch('https://thesimpsonsapi.com/api/characters/random');
    console.log('📡 Respuesta recibida:', response.status);
    
    if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status}`);
    }
    
    const personaje = await response.json();
    console.log('✅ Personaje obtenido:', personaje);
    return personaje;
}

// Función para crear una tarjeta de personaje
function crearTarjeta(personaje) {
    console.log('🎨 Creando tarjeta para:', personaje.name);
    const card = document.createElement('div');
    card.className = 'card';
    
    // Manejar ocupación que puede ser array o string
    const ocupaciones = Array.isArray(personaje.occupation) 
        ? personaje.occupation.join(', ') 
        : personaje.occupation;
    
    card.innerHTML = `
        <img class="card-img" src="${personaje.image}" alt="${personaje.name}">
        <div class="card-content">
            <div class="card-title">${personaje.name}</div>
            <div class="card-occupation">
                <strong>Ocupación:</strong><br>
                ${ocupaciones || 'No especificada'}
            </div>
        </div>
    `;
    
    return card;
}

// Función para cargar múltiples personajes usando Promise.all
async function cargarPersonajes() {
    console.log('🚀 Iniciando carga de personajes...');
    
    try {
        // Deshabilitar botón y mostrar loader
        btnCargar.disabled = true;
        loader.style.display = 'block';
        errorDiv.innerHTML = '';
        galeria.innerHTML = '';
        
        console.log('⏳ Cargando 6 personajes...');

        // Cargar 6 personajes en paralelo usando Promise.all
        const promesas = [];
        for (let i = 0; i < 6; i++) {
            promesas.push(obtenerPersonajeSimpsons());
        }
        
        console.log('⏰ Esperando respuestas...');
        const personajes = await Promise.all(promesas);
        console.log('🎉 Todos los personajes obtenidos:', personajes);

        // Crear y agregar las tarjetas
        personajes.forEach((personaje, index) => {
            console.log(`📋 Agregando personaje ${index + 1}:`, personaje.name);
            const tarjeta = crearTarjeta(personaje);
            galeria.appendChild(tarjeta);
        });

        console.log('✅ ¡Carga completada exitosamente!');

    } catch (error) {
        console.error('❌ ERROR CAPTURADO:', error);
        console.error('Tipo de error:', error.name);
        console.error('Mensaje:', error.message);
        
        errorDiv.innerHTML = `
            <div class="error">
                ⚠️ Error al cargar personajes: ${error.message}<br>
                <small>Revisa la consola (F12) para más detalles</small>
            </div>
        `;
        galeria.innerHTML = `
            <div class="empty-state">
                <h2>¡Ay caramba!</h2>
                <p>No se pudieron cargar los personajes.</p>
                <p><small>La API puede estar caída o bloqueada por CORS</small></p>
            </div>
        `;
    } finally {
        // Habilitar botón y ocultar loader
        console.log('🔄 Finalizando proceso...');
        btnCargar.disabled = false;
        loader.style.display = 'none';
    }
}

// Event listener para el botón
btnCargar.addEventListener('click', () => {
    console.log('🖱️ Botón clickeado!');
    cargarPersonajes();
});

// Log informativo al cargar la página
console.log('🍩 App de Los Simpsons cargada!');
console.log('📡 API configurada: https://thesimpsonsapi.com/api/characters/random');
console.log('👉 Presiona el botón "Cargar Nuevos Personajes" para empezar');
console.log('---------------------------------------------------');