db = db.getSiblingDB('noticias_db');

db.users.createIndex({ email: 1 }, { unique: true });
db.categories.createIndex({ name: 1 }, { unique: true });
db.news.createIndex({ slug: 1 }, { unique: true });
db.news.createIndex({ category: 1, status: 1, publicationDate: -1 });
db.news.createIndex({ status: 1, publicationDate: -1 });
db.newsletters.createIndex({ user: 1 }, { unique: true });

const now = new Date();
const categories = [
  { name: 'Tecnología', description: 'Noticias sobre tecnología e innovación', isActive: true, createdAt: now, updatedAt: now },
  { name: 'Política', description: 'Actualidad política nacional e internacional', isActive: true, createdAt: now, updatedAt: now },
  { name: 'Deportes', description: 'Noticias deportivas y eventos', isActive: true, createdAt: now, updatedAt: now },
  { name: 'Economía', description: 'Mercados financieros y economía', isActive: true, createdAt: now, updatedAt: now }
];

const insertedCategories = db.categories.insertMany(categories);
const categoryIds = Object.values(insertedCategories.insertedIds);
const [techId, polId, sportsId, econId] = categoryIds;

const seedAuthor = db.users.insertOne({
  email: 'editor@noticias.com',
  password: '$2a$10$SeedUserPlaceholderHashNotForLogin12345',
  role: 'editor',
  name: 'Carlos',
  lastName: 'Redactor',
  createdAt: now,
  updatedAt: now
});
const authorId = seedAuthor.insertedId;

const news = [
  {
    title: 'OpenAI presenta GPT-5 con capacidades multimodales revolucionarias',
    slug: 'openai-presenta-gpt5-capacidades-multimodales-revolucionarias',
    summary: 'La nueva versión del modelo de lenguaje promete cambios significativos en la inteligencia artificial.',
    content: 'OpenAI ha anunciado oficialmente el lanzamiento de GPT-5, su modelo más avanzado hasta la fecha. Esta nueva versión incluye capacidades multimodales que permiten procesar texto, imágenes, audio y video de manera integrada. Los expertos sugieren que podría revolucionar industrias enteras.',
    highlights: ['Procesamiento multimodal nativo', 'Mejora en razonamiento lógico', 'Reducción de alucinaciones'],
    author: authorId,
    category: techId,
    variant: 'highlighted',
    status: 'published',
    publicationDate: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000),
    source: 'TechCrunch',
    createdAt: now,
    updatedAt: now
  },
  {
    title: 'Apple Vision Pro llega a Latinoamérica con precio sorprendente',
    slug: 'apple-vision-pro-llega-latinoamerica-precio-sorprendente',
    summary: 'El dispositivo de realidad mixta de Apple finalmente desembarca en la región con una estrategia de pricing agresiva.',
    content: 'Apple confirmó que Vision Pro estará disponible en México, Brasil, Argentina y Colombia a partir del próximo trimestre. El precio de lanzamiento será significativamente más competitivo que en Estados Unidos, buscando capturar el mercado emergente de realidad mixta.',
    highlights: ['Lanzamiento en 4 países', 'Precio regional ajustado', 'Contenido local prometido'],
    author: authorId,
    category: techId,
    variant: 'featured',
    status: 'published',
    publicationDate: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000),
    source: 'Apple Insider',
    createdAt: now,
    updatedAt: now
  },
  {
    title: 'Quantum computing: IBM alcanza hito de 1000 qubits estables',
    slug: 'quantum-computing-ibm-alcanza-hito-1000-qubits-estables',
    summary: 'El avance podría acelerar drásticamente el desarrollo de aplicaciones prácticas para computación cuántica.',
    content: 'IBM ha logrado mantener 1000 qubits en estado coherente durante un tiempo récord, superando el obstáculo más grande de la computación cuántica. Este avance abre la puerta a aplicaciones prácticas en farmacología, criptografía y optimización logística.',
    highlights: ['1000 qubits coherentes', 'Aplicaciones en farmacología', 'Nuevo récord mundial'],
    author: authorId,
    category: techId,
    variant: 'default',
    status: 'published',
    publicationDate: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000),
    source: 'Nature',
    createdAt: now,
    updatedAt: now
  },
  {
    title: 'Reforma electoral: Senado aprueba cambios controversiales en votación dividida',
    slug: 'reforma-electoral-senado-aprueba-cambios-controversiales-votacion-dividida',
    summary: 'La nueva legislación modifica el sistema de elección de diputados y genera fuertes debates entre la oposición.',
    content: 'El Senado aprobó con 52 votos a favor y 48 en contra la reforma electoral propuesta por el ejecutivo. Los cambios incluyen la modificación del sistema de representación proporcional y la reducción del período legislativo.',
    highlights: ['52 votos a favor, 48 en contra', 'Cambios en representación proporcional', 'Oposición anuncia recursos'],
    author: authorId,
    category: polId,
    variant: 'highlighted',
    status: 'published',
    publicationDate: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000),
    source: 'El País',
    createdAt: now,
    updatedAt: now
  },
  {
    title: 'Cumbre de líderes latinoamericanos define agenda común sobre cambio climático',
    slug: 'cumbre-lideres-latinoamericanos-agenda-comun-cambio-climatico',
    summary: 'Los presidentes de 12 países firmaron un acuerdo histórico para la protección de la Amazonia.',
    content: 'En una reunión histórica en Brasilia, los líderes de América Latina firmaron el Pacto Verde Amazónico, comprometiéndose a detener la deforestación para 2030 y crear un fondo común de 5000 millones de dólares para proyectos sustentables.',
    highlights: ['12 países firmantes', 'Fondo de 5000 millones', 'Meta: cero deforestación 2030'],
    author: authorId,
    category: polId,
    variant: 'featured',
    status: 'published',
    publicationDate: new Date(now.getTime() - 4 * 24 * 60 * 60 * 1000),
    source: 'BBC Mundo',
    createdAt: now,
    updatedAt: now
  },
  {
    title: 'Nuevo escándalo de corrupción involucra a ex ministros de tres países',
    slug: 'nuevo-escandalo-corrupcion-involucra-ex-ministros-tres-paises',
    summary: 'La investigación internacional revela una red de sobornos millonarios en contratos de obra pública.',
    content: 'Una investigación conjunta entre fiscales de Argentina, Brasil y Chile destapó una red de corrupción que habría desviado más de 200 millones de dólares en contratos de infraestructura. Ya hay 15 imputados y se esperan más detenciones.',
    highlights: ['200 millones en sobornos', '15 imputados', 'Investigación trinacional'],
    author: authorId,
    category: polId,
    variant: 'default',
    status: 'published',
    publicationDate: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000),
    source: 'Reuters',
    createdAt: now,
    updatedAt: now
  },
  {
    title: 'Argentina campeón del mundo: La Scaloneta hace historia en la final épica',
    slug: 'argentina-campeon-mundo-scaloneta-historia-final-epica',
    summary: 'El equipo argentino venció en una final inolvidable y se consagró tricampeón del mundo.',
    content: 'En un partido que quedará en los libros de historia, Argentina derrotó a Francia en una final llena de emociones. Con goles de Messi y una actuación memorable del arquero, el equipo sudamericano levantó su tercera copa del mundo.',
    highlights: ['Tercer título mundial', 'Messi figura del partido', 'Final considerada la mejor de la historia'],
    author: authorId,
    category: sportsId,
    variant: 'highlighted',
    status: 'published',
    publicationDate: new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000),
    source: 'ESPN',
    createdAt: now,
    updatedAt: now
  },
  {
    title: 'Champions League: Real Madrid avanza a semifinales con remontada épica',
    slug: 'champions-league-real-madrid-avanza-semifinales-remontada-epica',
    summary: 'El equipo merengue volvió a demostrar su mística europea con una victoria agónica.',
    content: 'Real Madrid consiguió una remontada histórica en el Santiago Bernabéu, anotando tres goles en los últimos 15 minutos para eliminar al Manchester City. Vinicius y Bellingham fueron los héroes de una noche que pasará a la historia.',
    highlights: ['3 goles en 15 minutos', 'Vinicius figura', 'Semifinales aseguradas'],
    author: authorId,
    category: sportsId,
    variant: 'featured',
    status: 'published',
    publicationDate: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000),
    source: 'Marca',
    createdAt: now,
    updatedAt: now
  },
  {
    title: 'Fórmula 1: Verstappen rompe récord de victorias en una temporada',
    slug: 'formula-1-verstappen-rrompe-record-victorias-temporada',
    summary: 'El piloto neerlandés estableció una nueva marca histórica con su victoria número 18 del año.',
    content: 'Max Verstappen continuó su dominio absoluto en la Fórmula 1 al conseguir su victoria número 18 de la temporada, superando el récord que él mismo había establecido el año anterior. Red Bull celebra un año perfecto.',
    highlights: ['18 victorias en una temporada', 'Nuevo récord histórico', 'Red Bull invicto'],
    author: authorId,
    category: sportsId,
    variant: 'default',
    status: 'published',
    publicationDate: new Date(now.getTime() - 10 * 24 * 60 * 60 * 1000),
    source: 'Motorsport.com',
    createdAt: now,
    updatedAt: now
  },
  {
    title: 'El dólar alcanza máximo histórico y genera incertidumbre en los mercados',
    slug: 'dolar-alcanza-maximo-historico-genera-incertidumbre-mercados',
    summary: 'La moneda estadounidense superó los 1000 pesos en algunos mercados de la región.',
    content: 'La fuerte demanda de dólares y la política monetaria de la Reserva Federal impulsaron la divisa a niveles récord. Los analistas prevén mayor volatilidad en las próximas semanas mientras los bancos centrales de la región buscan estrategias de contención.',
    highlights: ['Máximo histórico', 'Impacto regional', 'Intervención de bancos centrales'],
    author: authorId,
    category: econId,
    variant: 'highlighted',
    status: 'published',
    publicationDate: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000),
    source: 'Bloomberg',
    createdAt: now,
    updatedAt: now
  },
  {
    title: 'Banco Central anuncia nueva tasa de interés para controlar inflación',
    slug: 'banco-central-anuncia-nueva-tasa-interes-controlar-inflacion',
    summary: 'La medida busca enfriar la economía y reducir la presión sobre los precios al consumidor.',
    content: 'El Banco Central elevó la tasa de interés de referencia al 45%, su nivel más alto en dos décadas. La decisión busca frenar una inflación que supera el 100% anual, aunque economistas advierten sobre el impacto en el crecimiento económico.',
    highlights: ['Tasa al 45%', 'Meta: reducir inflación', 'Preocupación por crecimiento'],
    author: authorId,
    category: econId,
    variant: 'featured',
    status: 'published',
    publicationDate: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000),
    source: 'Financial Times',
    createdAt: now,
    updatedAt: now
  },
  {
    title: 'Tesla pierde 15% en bolsa tras anuncios de Musk sobre producción',
    slug: 'tesla-pierde-15-por-ciento-bolsa-anuncios-musk-produccion',
    summary: 'Las acciones de la empresa de vehículos eléctricos cayeron tras reducir proyecciones de ventas.',
    content: 'El anuncio de Elon Musk sobre la reducción de la producción proyectada para 2025 generó una venta masiva de acciones de Tesla. La empresa cita problemas en la cadena de suministro y menor demanda en mercados clave.',
    highlights: ['Caída del 15% en bolsa', 'Proyecciones reducidas', 'Problemas de suministro'],
    author: authorId,
    category: econId,
    variant: 'default',
    status: 'published',
    publicationDate: new Date(now.getTime() - 6 * 24 * 60 * 60 * 1000),
    source: 'CNBC',
    createdAt: now,
    updatedAt: now
  },
  {
    title: 'Startups de IA recaudan récord de 50.000 millones en el primer trimestre',
    slug: 'startups-ia-recaudan-record-50000-millones-primer-trimestre',
    summary: 'El interés inversor en inteligencia artificial sigue en auge pese a la incertidumbre económica global.',
    content: 'Las empresas dedicadas a la inteligencia artificial captaron 50.000 millones de dólares en inversiones solo en el primer trimestre del año, superando todo lo recaudado en 2024. OpenAI, Anthropic y varias startups latinas lideran el ranking.',
    highlights: ['Récord de inversión', 'Startups latinas destacan', 'OpenAI lidera'],
    author: authorId,
    category: techId,
    variant: 'default',
    status: 'in_review',
    publicationDate: new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000),
    source: 'VentureBeat',
    createdAt: now,
    updatedAt: now
  },
  {
    title: 'COP30: Brasil prepara cumbre climática más ambiciosa de la historia',
    slug: 'cop30-brasil-prepara-cumbre-climatica-mas-ambiciosa-historia',
    summary: 'El país anfitrión promete acuerdos vinculantes y financiación concreta para países en desarrollo.',
    content: 'Brasil se prepara para recibir a delegaciones de 195 países en la que se espera sea la cumbre climática más importante desde París 2015. Entre los objetivos principales está establecer un fondo de pérdidas y daños operativo.',
    highlights: ['195 países invitados', 'Fondo de pérdidas y daños', 'Acuerdos vinculantes'],
    author: authorId,
    category: polId,
    variant: 'default',
    status: 'approved',
    publicationDate: new Date(now.getTime() + 5 * 24 * 60 * 60 * 1000),
    source: 'UN Climate',
    createdAt: now,
    updatedAt: now
  },
  {
    title: 'NBA: Jugadores latinos protagonizan la mejor temporada de la historia',
    slug: 'nba-jugadores-latinos-protagonizan-mejor-temporada-historia',
    summary: 'El talento latinoamericano brilla en la liga con números récord y candidaturas al MVP.',
    content: 'Jugadores de Argentina, Brasil, República Dominicana y Puerto Rico están having la mejor temporada colectiva en la historia de la NBA. Las estadísticas combinadas superan todos los registros previos y varios son candidatos a premios individuales.',
    highlights: ['Números récord combinados', 'Candidatos al MVP', '8 latinos en All-Star'],
    author: authorId,
    category: sportsId,
    variant: 'default',
    status: 'draft',
    publicationDate: new Date(now.getTime() + 10 * 24 * 60 * 60 * 1000),
    source: 'NBA.com',
    createdAt: now,
    updatedAt: now
  }
];

db.news.insertMany(news);

print('Inicialización completada:');
print('   - 4 categorías');
print('   - 1 usuario editor (seed)');
print('   - 15 noticias de ejemplo');
print('El superadmin se crea desde la app con INIT_SUPERADMIN=true');
