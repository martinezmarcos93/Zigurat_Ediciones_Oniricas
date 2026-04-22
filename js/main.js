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
    title: 'Ficciones Esotéricas I',
    desc: 'Un compendio de relatos filosófico-místicos que combinan el ensayo simbólico, la ficción ritual y el mito personal. Inspiradas en el esoterismo occidental, el gnosticismo, la mitología ancestral y la filosofía del lenguaje, estas narraciones descienden a lo más profundo del Abismo en busca de verdades veladas por la razón. Más que relatos, estas ficciones son umbrales. Quien las cruce, no saldrá indemne.'
  },
  'ficciones2': { collection: 'Colección Violeta · Ficciones', collectionColor: '#B07AFF', title: 'Ficciones Esotéricas II', desc: 'El segundo volumen desciende más profundo en el territorio de lo simbólico. Grimorios prohibidos, ecuaciones que desfiguran la realidad y viajes a inframundos donde lo sagrado y lo profano se vuelven indistinguibles.' },
  'ficciones3': { collection: 'Colección Violeta · Ficciones', collectionColor: '#B07AFF', title: 'Ficciones Esotéricas III', desc: 'Rituales arquetípicos y mitos personales se entrelazan en este tercer volumen. La historia y el mito, lo real y lo onírico, cuestionan los límites del ser, el conocimiento y el tiempo.' },
  'ficciones4': { collection: 'Colección Violeta · Ficciones', collectionColor: '#B07AFF', title: 'Ficciones Esotéricas IV', desc: 'Lo desconocido no como objeto de miedo, sino como camino. Este volumen enfrenta al lector con las estructuras más profundas del inconsciente colectivo a través de la ficción ritual.' },
  'ficciones5': { collection: 'Colección Violeta · Ficciones', collectionColor: '#B07AFF', title: 'Ficciones Esotéricas V', desc: 'El quinto umbral de la colección violeta. Narraciones donde el lenguaje mismo se convierte en operación mágica — cada texto es un acto, no solo una lectura.' },
  'ficciones6': { collection: 'Colección Violeta · Ficciones', collectionColor: '#B07AFF', title: 'Ficciones Esotéricas VI', desc: 'La mitología ancestral y el esoterismo occidental convergen en este volumen. Los personajes no son protagonistas de historias — son instrumentos de fuerzas que los trascienden.' },
  'ficciones7': { collection: 'Colección Violeta · Ficciones', collectionColor: '#B07AFF', title: 'Ficciones Esotéricas VII', desc: 'Séptimo volumen de la colección más profunda del catálogo. La filosofía del lenguaje y el gnosticismo se fusionan en relatos donde nombrar algo es, inevitablemente, transformarlo.' },
  'ficciones8': { collection: 'Colección Violeta · Ficciones', collectionColor: '#B07AFF', title: 'Ficciones Esotéricas VIII', desc: 'Los textos de este volumen operan en el límite entre la ficción y el tratado esotérico. La voz narrativa ya no distingue entre el que cuenta y lo que cuenta.' },
  'ficciones9': { collection: 'Colección Violeta · Ficciones', collectionColor: '#B07AFF', title: 'Ficciones Esotéricas IX', desc: 'Noveno umbral. Nueve descensos, nueve transformaciones. Este texto es también una antesala — quien llegue hasta aquí sabrá que el ciclo no ha terminado.' },
  'ficciones10': {
    collection: 'Colección Violeta · Ficciones',
    collectionColor: '#B07AFF',
    title: 'Ecuaciones de la No Forma',
    desc: 'Décimo volumen de la Colección Violeta. Un matemático encuentra un registro cifrado en un edificio abandonado: fórmulas que no describen la realidad sino que la modifican. A medida que resuelve las ecuaciones, la percepción del tiempo se disuelve y la identidad se fragmenta. El lenguaje es la prisión — la matemática, la llave. Quien se atreva a girarla verá los muros de la realidad derrumbarse.'
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
