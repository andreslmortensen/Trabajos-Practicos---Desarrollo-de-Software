// =====================================================
// DESAFÍO FINAL - GALERÍA DE PERSONAJES DE LOS SIMPSONS
// API: https://thesimpsonsapi.com/api
// =====================================================

// Elementos del DOM
const galeria = document.getElementById('galeria');
const btnCargar = document.getElementById('cargar');
const btnCargarMas = document.getElementById('cargar-mas');
const loader = document.getElementById('loader');
const mensajeError = document.getElementById('mensaje-error');
const filtroInput = document.getElementById('filtro');

// Variables globales
let todosPersonajes = [];
let personajesMostrados = [];
const API_BASE = 'https://thesimpsonsapi.com/api';


// REQUISITO 1: OBTENER PERSONAJES DE LA API

async function obtenerTodosLosPersonajes() {
    try {
        const response = await fetch(`${API_BASE}/characters?limit=100`);
        
        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status}`);
        }
        
        const data = await response.json();
        return data.results || [];
        
    } catch (error) {
        console.error('Error al obtener personajes:', error);
        throw error;
    }
}

// REQUISITO 1: PROMISE.ALL() - 6 PETICIONES SIMULTÁNEAS

async function obtener6PersonajesAleatorios(personajes) {
    const indicesAleatorios = [];
    const personajesSeleccionados = [];
    
    // Seleccionar 6 personajes aleatorios
    while (indicesAleatorios.length < 6 && indicesAleatorios.length < personajes.length) {
        const indiceAleatorio = Math.floor(Math.random() * personajes.length);
        if (!indicesAleatorios.includes(indiceAleatorio)) {
            indicesAleatorios.push(indiceAleatorio);
            personajesSeleccionados.push(personajes[indiceAleatorio]);
        }
    }
    
    // Usar Promise.all() para obtener detalles de 6 personajes en paralelo
    const promesas = personajesSeleccionados.map(p => 
        fetch(`${API_BASE}/characters/${p.id}`).then(res => res.json())
    );
    
    const personajesDetallados = await Promise.all(promesas);
    return personajesDetallados;
}


// REQUISITO 3: BOTÓN "CARGAR NUEVOS PERSONAJES"

async function cargar6PersonajesSimultaneos() {
    try {
        // REQUISITO 4: Mostrar loader mientras se cargan los datos
        mostrarLoader(true);
        btnCargar.disabled = true;
        ocultarMensajeError();
        
        // Obtener lista de personajes si no existe
        if (todosPersonajes.length === 0) {
            todosPersonajes = await obtenerTodosLosPersonajes();
        }
        
        if (todosPersonajes.length === 0) {
            throw new Error('No se obtuvieron personajes de la API');
        }
        
        // Obtener 6 personajes aleatorios usando Promise.all()
        const personajes = await obtener6PersonajesAleatorios(todosPersonajes);
        
        // REQUISITO 2: Formatear para mostrar nombre, imagen y primera ocupación
        personajesMostrados = personajes.map(p => {
            let imagenUrl = '';
            if (p.portrait_path) {
                imagenUrl = p.portrait_path.startsWith('http') 
                    ? p.portrait_path 
                    : `https://thesimpsonsapi.com${p.portrait_path}`;
            } else {
                imagenUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(p.name)}&size=300&background=ffeaa7&color=333`;
            }
            
            return {
                id: p.id,
                nombre: p.name,
                imagen: imagenUrl,
                ocupacion: p.occupation || 'Personaje de Springfield',
                edad: p.age,
                genero: p.gender
            };
        });
        
        mostrarPersonajes(personajesMostrados);
        btnCargarMas.classList.remove('oculto');
        
    } catch (error) {
        // REQUISITO 5: Manejo de errores con mensajes apropiados
        console.error('Error al cargar personajes:', error);
        mostrarMensajeError('No se pudieron cargar los personajes. Intenta de nuevo.');
    } finally {
        // REQUISITO 4: Ocultar loader
        mostrarLoader(false);
        btnCargar.disabled = false;
    }
}

// BONUS: CARGAR 6 PERSONAJES ADICIONALES

async function cargarMasPersonajes() {
    try {
        mostrarLoader(true);
        btnCargarMas.disabled = true;
        ocultarMensajeError();
        
        const nuevosPersonajes = await obtener6PersonajesAleatorios(todosPersonajes);
        
        const personajesFormateados = nuevosPersonajes.map(p => {
            let imagenUrl = '';
            if (p.portrait_path) {
                imagenUrl = p.portrait_path.startsWith('http') 
                    ? p.portrait_path 
                    : `https://thesimpsonsapi.com${p.portrait_path}`;
            } else {
                imagenUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(p.name)}&size=300&background=ffeaa7&color=333`;
            }
            
            return {
                id: p.id,
                nombre: p.name,
                imagen: imagenUrl,
                ocupacion: p.occupation || 'Personaje de Springfield',
                edad: p.age,
                genero: p.gender
            };
        });
        
        personajesMostrados = [...personajesMostrados, ...personajesFormateados];
        mostrarPersonajes(personajesMostrados);
        
    } catch (error) {
        console.error('Error al cargar más personajes:', error);
        mostrarMensajeError('Error al cargar más personajes');
    } finally {
        mostrarLoader(false);
        btnCargarMas.disabled = false;
    }
}

// BONUS: FILTRAR/BUSCAR PERSONAJES POR NOMBRE

async function filtrarPersonajes() {
    const termino = filtroInput.value.toLowerCase().trim();
    
    if (termino === '') {
        mostrarPersonajes(personajesMostrados);
        return;
    }
    
    if (termino.length < 2) {
        galeria.innerHTML = `
            <div class="no-resultados">
                <h2>Escribe al menos 2 letras</h2>
                <p>Para buscar necesitas escribir más caracteres</p>
            </div>
        `;
        return;
    }
    
    try {
        mostrarLoader(true);
        
        if (todosPersonajes.length === 0) {
            todosPersonajes = await obtenerTodosLosPersonajes();
        }
        
        const resultados = todosPersonajes.filter(p => 
            p.name.toLowerCase().includes(termino)
        );
        
        if (resultados.length === 0) {
            galeria.innerHTML = `
                <div class="no-resultados">
                    <h2>😔 No se encontró "${termino}"</h2>
                    <p>Intenta con: Homer, Bart, Lisa, Marge, Maggie, Ned, Moe</p>
                </div>
            `;
        } else {
            const personajesAMostrar = resultados.slice(0, 12);
            
            const promesas = personajesAMostrar.map(p => 
                fetch(`${API_BASE}/characters/${p.id}`).then(res => res.json())
            );
            
            const personajesDetallados = await Promise.all(promesas);
            
            const personajesFormateados = personajesDetallados.map(p => {
                let imagenUrl = '';
                if (p.portrait_path) {
                    imagenUrl = p.portrait_path.startsWith('http') 
                        ? p.portrait_path 
                        : `https://thesimpsonsapi.com${p.portrait_path}`;
                } else {
                    imagenUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(p.name)}&size=300&background=ffeaa7&color=333`;
                }
                
                return {
                    id: p.id,
                    nombre: p.name,
                    imagen: imagenUrl,
                    ocupacion: p.occupation || 'Personaje de Springfield',
                    edad: p.age,
                    genero: p.gender
                };
            });
            
            mostrarPersonajes(personajesFormateados);
        }
        
    } catch (error) {
        console.error('Error en búsqueda:', error);
        mostrarMensajeError('Error al buscar personaje');
    } finally {
        mostrarLoader(false);
    }
}


// MOSTRAR PERSONAJES EN LA GALERÍA

function mostrarPersonajes(personajes) {
    galeria.innerHTML = '';
    
    if (personajes.length === 0) {
        galeria.innerHTML = `
            <div class="no-resultados">
                <h2>¡D'oh!</h2>
                <p>Presiona "Cargar Nuevos Personajes" para comenzar</p>
            </div>
        `;
        return;
    }
    
    personajes.forEach(personaje => {
        const card = crearTarjetaPersonaje(personaje);
        galeria.appendChild(card);
    });
}


// CREAR TARJETA DE PERSONAJE

function crearTarjetaPersonaje(personaje) {
    const card = document.createElement('div');
    card.className = 'personaje-card';
    
    card.innerHTML = `
        <img 
            class="personaje-imagen" 
            src="${personaje.imagen}" 
            alt="${personaje.nombre}"
            onerror="this.onerror=null; this.src='https://ui-avatars.com/api/?name=${encodeURIComponent(personaje.nombre)}&size=300&background=ffeaa7&color=333&font-size=0.4';"
        >
        <div class="personaje-info">
            <div class="personaje-nombre">${personaje.nombre}</div>
            <div class="personaje-ocupacion">
                ${personaje.ocupacion}
            </div>
        </div>
    `;
    
    return card;
}


// FUNCIONES AUXILIARES

function mostrarLoader(mostrar) {
    loader.classList.toggle('oculto', !mostrar);
}

function mostrarMensajeError(mensaje) {
    mensajeError.textContent = `⚠️ ${mensaje}`;
    mensajeError.classList.remove('oculto');
    setTimeout(() => ocultarMensajeError(), 4000);
}

function ocultarMensajeError() {
    mensajeError.classList.add('oculto');
}


// EVENT LISTENERS

btnCargar.addEventListener('click', cargar6PersonajesSimultaneos);
btnCargarMas.addEventListener('click', cargarMasPersonajes);

// Búsqueda con debounce
let timeoutBusqueda;
filtroInput.addEventListener('input', () => {
    clearTimeout(timeoutBusqueda);
    timeoutBusqueda = setTimeout(filtrarPersonajes, 500);
});