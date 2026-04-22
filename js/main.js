// CURSOR
const cursor = document.getElementById('cursor');
const cursorRing = document.getElementById('cursorRing');
document.addEventListener('mousemove', e => {
  cursor.style.left = e.clientX + 'px';
  cursor.style.top = e.clientY + 'px';
  setTimeout(() => {
    cursorRing.style.left = e.clientX + 'px';
    cursorRing.style.top = e.clientY + 'px';
  }, 80);
});
document.querySelectorAll('a,button,.book-card').forEach(el => {
  el.addEventListener('mouseenter', () => {
    cursor.style.transform = 'translate(-50%,-50%) scale(2.5)';
    cursorRing.style.transform = 'translate(-50%,-50%) scale(1.5)';
  });
  el.addEventListener('mouseleave', () => {
    cursor.style.transform = 'translate(-50%,-50%) scale(1)';
    cursorRing.style.transform = 'translate(-50%,-50%) scale(1)';
  });
});

// NAV SCROLL
window.addEventListener('scroll', () => {
  document.getElementById('mainNav').classList.toggle('scrolled', window.scrollY > 60);
});

// SCROLL REVEAL
const revealEls = document.querySelectorAll('.reveal');
const observer = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('visible'); observer.unobserve(e.target); }
  });
}, { threshold: 0.12 });
revealEls.forEach(el => observer.observe(el));

// FILTER
function filterBooks(col, btn) {
  document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  document.querySelectorAll('.book-card').forEach(card => {
    card.style.display = (col === 'todos' || card.dataset.col === col) ? 'block' : 'none';
  });
}

// BOOK DATA
const books = {
  'relatos1': {
    collection: 'Colección Azul · Microrelatos',
    collectionColor: '#6AACFF',
    title: 'Relatos del Zigurat I',
    desc: 'Una serie de microrrelatos que exploran, desde distintos ángulos filosóficos, el proceso de emancipación individual. En ellos confluyen el existencialismo, el pensamiento oriental, el misticismo simbólico y la crítica a las estructuras de poder. Cada texto propone una situación límite en la que el personaje toma conciencia de su libertad y su responsabilidad.'
  },
  'relatos2': { collection: 'Colección Azul · Microrelatos', collectionColor: '#6AACFF', title: 'Relatos del Zigurat II', desc: 'Continúa el recorrido por las situaciones límite donde la emancipación individual se vuelve ineludible. Microrrelatos que combinan filosofía y literatura para provocar al lector desde ángulos distintos.' },
  'relatos3': { collection: 'Colección Azul · Microrelatos', collectionColor: '#6AACFF', title: 'Relatos del Zigurat III', desc: 'El tercer volumen de la serie profundiza en la crítica a las estructuras de obediencia y el cuestionamiento de las certezas heredadas. Narrativa breve y precisa al servicio del pensamiento.' },
  'relatos4': { collection: 'Colección Azul · Microrelatos', collectionColor: '#6AACFF', title: 'Relatos del Zigurat IV', desc: 'Cierre del primer ciclo de Relatos del Zigurat. Los personajes enfrentan aquí sus decisiones más profundas: ejercicios de pensamiento y sensibilidad que combinan filosofía y literatura.' },
  'fabulas1': { collection: 'Colección Verde · Fábulas', collectionColor: '#4ABF8A', title: 'Fábulas Oníricas I', desc: 'Relatos breves que utilizan el lenguaje del sueño, la naturaleza y el símbolo para explorar los grandes dilemas humanos: la libertad, el tiempo, el amor, la muerte. Animales, astros y elementos como metáforas vivas de procesos internos.' },
  'fabulas2': { collection: 'Colección Verde · Fábulas', collectionColor: '#4ABF8A', title: 'Fábulas Oníricas II', desc: 'El segundo volumen propone nuevas preguntas desde el lenguaje simbólico. No moraleja tradicional — sino un espejo, a veces críptico, donde el lector intuirá algo de su propia verdad.' },
  'fabulas3': { collection: 'Colección Verde · Fábulas', collectionColor: '#4ABF8A', title: 'Fábulas Oníricas III', desc: 'Inspiradas en la tradición de la fábula pero con enfoque contemporáneo y filosófico. El diálogo entre existencialismo, pensamiento oriental y psicología profunda alcanza nuevas capas.' },
  'fabulas4': { collection: 'Colección Verde · Fábulas', collectionColor: '#4ABF8A', title: 'Fábulas Oníricas IV', desc: 'El cuarto libro de la serie verde ahonda en la pregunta central: ¿qué parte de nosotros necesita transformarse? Más que respuestas, ofrece umbrales.' },
  'fabulas5': { collection: 'Colección Verde · Fábulas', collectionColor: '#4ABF8A', title: 'Fábulas Oníricas V', desc: 'Los grandes dilemas humanos siguen desplegándose a través del símbolo y el sueño. Cada texto es un espejo colocado en el ángulo exacto para incomodar.' },
  'fabulas6': { collection: 'Colección Verde · Fábulas', collectionColor: '#4ABF8A', title: 'Fábulas Oníricas VI', desc: 'El cierre del ciclo verde. Las fábulas alcanzan aquí su mayor densidad simbólica — el lector que haya llegado hasta aquí ya no saldrá igual.' },
  'siete-esotericos': {
    collection: 'Colección Dorada · Ensayos',
    collectionColor: '#C9A84C',
    title: 'Siete Ensayos Esotéricos',
    desc: 'Un recorrido por los grandes enigmas de la existencia desde una mirada filosófica, simbólica y espiritual. Hermetismo, existencialismo, pensamiento gnóstico y filosofía oriental se articulan para interrogar la experiencia humana. No respuestas cerradas — claves de lectura para quien se atreva a cuestionar los límites de lo real.'
  },
  'ficciones1': {
    collection: 'Colección Violeta · Ficciones',
    collectionColor: '#B07AFF',
    title: 'Sobre la Oscuridad',
    desc: 'Un tratado filosófico y poético que explora la Oscuridad como principio primordial, anterior a la luz. Dividido en cuatro libros, defiende la oscuridad como origen, madre, refugio y fuente de conocimiento verdadero, en contraposición a la luz como mera ilusión o máscara.'
  },
  'ficciones2': {
    collection: 'Colección Violeta · Ficciones',
    collectionColor: '#B07AFF',
    title: 'Sobre el Árbol Rúnico y la Cábala',
    desc: 'Un manual esotérico que sincroniza el Yggdrasil nórdico con el Árbol de la Vida de la Cábala. Incluye rituales, meditaciones y el uso de runas para recorrer los nueve mundos, integrando sefirots y qlifots, con el fin de lograr autoconocimiento y transformación espiritual.'
  },
  'ficciones3': {
    collection: 'Colección Violeta · Ficciones',
    collectionColor: '#B07AFF',
    title: 'El Libro Negro de Alsophocus',
    desc: 'La traducción de un grimorio prohibido vinculado a un hechicero legendario. Contiene rituales de nigromancia y demonología, descripciones de entidades extradimensionales, advertencias sobre sus peligros y relatos de quienes sucumbieron a su poder corruptor.'
  },
  'ficciones4': {
    collection: 'Colección Violeta · Ficciones',
    collectionColor: '#B07AFF',
    title: 'Sobre los Poderes Sumerios',
    desc: 'Una guía espiritual basada en la mitología mesopotámica, centrada en la autodeificación y la integración de arquetipos como Tiamat, Inanna y Enki. Propone rituales, altares y ciclos festivos reinterpretados para el empoderamiento personal y la transformación interior.'
  },
  'ficciones5': {
    collection: 'Colección Violeta · Ficciones',
    collectionColor: '#B07AFF',
    title: 'Los 4 Reyes de Alu-Ragaal',
    desc: 'Un texto sobre una ciudad legendaria y sus cuatro reyes espirituales (Enkalludur, Zigur-Namgal, Ashurkallim y Namrutur), cada uno asociado a un punto cardinal y a fuerzas como la sombra, el caos, el abismo y la protección. Incluye rituales de invocación y entidades sirvientes.'
  },
  'ficciones6': {
    collection: 'Colección Violeta · Ficciones',
    collectionColor: '#B07AFF',
    title: 'Un Manuscrito Descifrado',
    desc: 'El relato del descubrimiento y traducción de un antiguo códice hallado en Anatolia, escrito en sumerio, griego y avéstico. Describe un viaje al inframundo sumerio y un testimonio atribuido a Calístenes de Rodas, advirtiendo sobre los peligros de abrir ciertos umbrales espirituales.'
  },
  'ficciones7': {
    collection: 'Colección Violeta · Ficciones',
    collectionColor: '#B07AFF',
    title: 'Sobre el Poder de las Serpientes',
    desc: 'Una bitácora que explora el simbolismo y poder de serpientes mitológicas de distintas culturas (Persia, Sumeria, Egipto, Grecia, tradición hebrea, nórdica, azteca). Incluye ritos de invocación, descripciones de sus efectos y advertencias sobre la corrupción que pueden desatar.'
  },
  'ficciones8': {
    collection: 'Colección Violeta · Ficciones',
    collectionColor: '#B07AFF',
    title: 'Sobre el Poder Paleolítico',
    desc: 'Una reflexión sobre la espiritualidad perdida del Paleolítico, proponiendo rituales adaptados a la vida urbana para reconectar con fuerzas ancestrales (fuego interior, noche, umbrales) y con espíritus animales como el bisonte, el lobo, el oso y la serpiente.'
  },
  'ficciones9': {
    collection: 'Colección Violeta · Ficciones',
    collectionColor: '#B07AFF',
    title: 'Las Nueve Moradas de los Muertos',
    desc: 'Un estudio sobre los destinos del alma en la mitología nórdica, describiendo nueve reinos funerarios (Gefjun, Vingolf, Fólkvangr, Valhalla, Palacio de Aegir, Naströnd, Helheim, Helgafell y Fensalir). Incluye meditaciones y cantos (Galdr) para armonizar con los muertos.'
  },
  'ficciones10': {
    collection: 'Colección Violeta · Ficciones',
    collectionColor: '#B07AFF',
    title: 'Ecuaciones de la No Forma',
    desc: 'Un texto perturbador que mezcla matemáticas y ocultismo, presentando ecuaciones como llaves para modificar la realidad y contactar con dioses olvidados previos a la humanidad. Advierte sobre la disolución del yo y el lenguaje como prisión cósmica.'
  }
};

function openModal(id) {
  const b = books[id];
  if (!b) return;
  document.getElementById('modalCollection').style.color = b.collectionColor;
  document.getElementById('modalCollection').textContent = b.collection;
  document.getElementById('modalTitle').textContent = b.title;
  document.getElementById('modalDesc').textContent = b.desc;
  document.getElementById('modalOverlay').classList.add('open');
  document.body.style.overflow = 'hidden';
}
function closeModal() {
  document.getElementById('modalOverlay').classList.remove('open');
  document.body.style.overflow = '';
}
function closeModalOutside(e) {
  if (e.target === document.getElementById('modalOverlay')) closeModal();
}
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });

// EMAIL
function subscribeEmail() {
  const val = document.getElementById('emailInput').value;
  if (!val || !val.includes('@')) return;
  document.getElementById('emailForm').style.display = 'none';
  document.getElementById('emailConfirm').style.display = 'block';
  console.log('New subscriber:', val);
  // Aquí conectar con tu backend o servicio de email (Mailchimp, etc.)
}