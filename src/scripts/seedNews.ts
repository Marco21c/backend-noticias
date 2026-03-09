import mongoose from 'mongoose';

import '../config/database.js';
import CategoryModel from '../models/category.model.js';
import NewsModel from '../models/news.model.js';
import UserModel from '../models/user.model.js';
import logger from '../utils/logger.js';

/**
 * CLI script to seed the database with 30 dummy news articles.
 * Includes items with images, and assigns them to categories and an author.
 * Usage: npm run seed
 */
async function seedNews(): Promise<void> {
  try {
    if (mongoose.connection.readyState !== 1) {
      await mongoose.connection.asPromise();
    }

    // 1. Get or create an author
    let author = await UserModel.findOne({ role: 'superadmin' }).exec();
    if (!author) {
      author = await UserModel.findOne().exec();
    }
    if (!author) {
      logger.error('No users found in database to act as an author. Please run create-superadmin first.');
      process.exit(1);
    }

    // 2. Define dummy categories
    const categoryNames = ['Tecnología', 'Deportes', 'Economía', 'Política', 'Ciencia'];
    const categoriesMap: Record<string, string> = {};

    for (const name of categoryNames) {
      let category = await CategoryModel.findOne({ name }).exec();
      if (!category) {
        category = await CategoryModel.create({ name, description: `Noticias sobre ${name}`, isActive: true });
      }
      categoriesMap[name] = category._id.toString();
    }

    // 3. Clear existing news (Reset database state for clean UX testing)
    const deleted = await NewsModel.deleteMany({});
    logger.info(`Cleared ${deleted.deletedCount} existing news from database.`);

    // 4. Generate 31 realistic news articles
    const dummyNews = [];
    const dummyContents = `
    <p>A pesar del escepticismo inicial por parte de varios analistas del sector, los últimos reportes oficiales reafirman el cambio de paradigma.</p>
    <h2>Impacto socioeconómico y proyecciones futuras</h2>
    <p>Diversos especialistas sostienen que la clave de esta transición radica en la correcta implementación de políticas públicas integrales. No obstante, advierten que los plazos de adecuación podrían verse sofocados por presiones coyunturales derivadas del entorno internacional.</p>
    <blockquote>"El mayor desafío no es la adopción del sistema, sino garantizar la sustentabilidad de la matriz a largo plazo", afirmaron portavoces de la entidad colegiada durante el informe anual.</blockquote>
    <ul>
      <li>Optimización de los tiempos procesales administrativos.</li>
      <li>Monitoreo en tiempo real bajo esquemas descentralizados.</li>
      <li>Reducción significativa del margen de error estático.</li>
    </ul>
    <p>Para complementar estas iniciativas, el consorcio público-privado anunció un paquete de inversiones estructurales enfocadas en el recambio de equipamiento obsoleto y capacitaciones del factor humano durante el primer semestre del próximo año corriente.</p>
    `;

    const realisticData = [
      { title: "Inflación interanual cae al nivel más bajo en cinco años", summary: "La tendencia a la baja se consolida gracias a la estabilidad cambiaria.", category: "Economía" },
      { title: "Debate legislativo: Avanza el proyecto de reforma laboral", summary: "Con apoyo opositor, el oficialismo logró dictamen de mayoría y buscará debate plenario.", category: "Política" },
      { title: "La NASA confirma la existencia de agua líquida en un exoplaneta", summary: "El telescopio detectó firmas espectrales de vapor abriendo nuevas esperanzas de habitabilidad.", category: "Ciencia" },
      { title: "Sorpresa en el torneo internacional: el favorito fue eliminado", summary: "Contra los pronósticos, el número uno cayó ante una joven promesa de 19 años.", category: "Deportes" },
      { title: "Presentan el primer teléfono cuántico: batería y seguridad insuperables", summary: "Utiliza entrelazamiento cuántico para asegurar comunicaciones impenetrables.", category: "Tecnología" },
      { title: "Exportaciones agrícolas rompen nuevo récord histórico de volumen", summary: "La mejora en los rindes de la soja y maíz compensó las pérdidas.", category: "Economía" },
      { title: "Cumbre del Mercosur: tensiones latentes por aranceles", summary: "Mandatarios postergan la decisión sobre flexibilización del bloque regional.", category: "Política" },
      { title: "Desarrollan plástico biodegradable revolucionario a partir de algas", summary: "El material es igual de resistente pero se degrada en 90 días en el mar.", category: "Ciencia" },
      { title: "Récord mundial en salto con garrocha durante el campeonato de atletismo", summary: "El atleta sueco rompió su marca superando los 6,24 metros en un intento limpio.", category: "Deportes" },
      { title: "Crisis de los microchips: millonarias inversiones en la región", summary: "Nuevas plantas prometen aliviar el mercado tecnológico frente a la sobredemanda.", category: "Tecnología" },
      { title: "El dólar en baja: mercado reacciona a los acuerdos de deuda", summary: "Los bonos soberanos subieron y el riesgo país perforó la barrera psicológica.", category: "Economía" },
      { title: "Nuevos roces diplomáticos: retiran al embajador local de la capital europea", summary: "Cruces de declaraciones precipitaron una crisis en el ala diplomática.", category: "Política" },
      { title: "Descubren ciudad maya milenaria usando tecnología láser LIDAR", summary: "Mapeos revelaron complejas superestructuras ocultas en la densa selva amazónica.", category: "Ciencia" },
      { title: "La Fórmula 1 vuelve a correr en el histórico circuito metropolitano", summary: "Vuelven los motores con entradas totalmente agotadas tras de diez años de ausencia.", category: "Deportes" },
      { title: "La Inteligencia Artificial revoluciona los diagnósticos médicos", summary: "Nuevos algoritmos detectan patologías silenciosas con 98% de precisión temprana.", category: "Tecnología" },
      { title: "Se anuncia mega paquete impositivo de alivio para pequeñas pymes", summary: "Baja en el impuesto a las ganancias y prórroga en los vencimientos mensuales.", category: "Economía" },
      { title: "El Senado frena polémico decreto ley del poder ejecutivo", summary: "Argumentan vicios constitucionales e inician un debate extendido en las cámaras altas.", category: "Política" },
      { title: "Astrónomos captan a un agujero negro devorando una estrella lejana", summary: "El destello de la disrupción de marea arrojó información vital al consorcio global.", category: "Ciencia" },
      { title: "El seleccionado nacional asciende al top 5 del ranking competitivo", summary: "Triunfos consecutivos catapultaron a los atletas al selecto grupo de líderes globales.", category: "Deportes" },
      { title: "Hackers paralizan operaciones de una multinacional petrolera", summary: "Ransomware detuvo oleoductos desencadenando alertas rojas de ciberseguridad.", category: "Tecnología" },
      { title: "Nuevo acuerdo salarial docente destraba el conflicto gremial", summary: "El gobierno ofreció bonos no remunerativos cerrando la histórica ronda de paritarias.", category: "Política" },
      { title: "Aprobado el primer ETF cripto que impulsa el Bitcoin a rumbos desconocidos", summary: "Wall Street inyecta miles de millones validando financieramente al ecosistema cripto.", category: "Economía" },
      { title: "Lanzan nanobots exploradores de flujo sanguíneo al sector clínico", summary: "Ingeniería bio-robótica logra disolver coágulos sin intervención quirúrgica masiva.", category: "Ciencia" },
      { title: "El multicampeón de ajedrez abandona el tablero de forma inesperada", summary: "Fatiga crónica y ataques de pánico empujaron al genio a su retiro prematuro.", category: "Deportes" },
      { title: "Metaverso en declive: gigante tech anuncia despidos globales masivos", summary: "Priorizan re-enfocarse en la Inteligencia Artificial ante el nulo interés por la VR.", category: "Tecnología" },
      { title: "Nuevas restricciones a la importación complican los stocks internos", summary: "Diversos sectores advierten desabastecimiento si continúan pisando permisos aduaneros.", category: "Economía" },
      { title: "Histórico fallo judicial anula controvertida licitación nacional", summary: "Jueces señalan posibles sobreprecios en el proceso original frenando las retroexcavadoras.", category: "Política" },
      { title: "Biólogos clonan especie de hurón al borde del colapso de extinción", summary: "El hito celular podría proveer nuevas técnicas vitales para recuperar la biodiversidad.", category: "Ciencia" },
      { title: "Confirmada la sede para la final del campeonato del mundo", summary: "El megaestadio sudamericano albergará a más de cien mil almas para el encuentro de oro.", category: "Deportes" },
      { title: "Presentan procesador neuromórfico que imita redes neuronales biológicas", summary: "La revolucionaria arquitectura gasta una cien milésima de energía respecto al resto.", category: "Tecnología" },
      { title: "Sindicato histórico llama repentinamente a huelga de transportes", summary: "El servicio de carga e interurbano amenazan con paralizar la actividad regional.", category: "Política" }
    ];

    for (let i = 0; i < realisticData.length; i++) {
        const item = realisticData[i];
        if (!item) continue;
        
        // Variante Layout Logic: 5 Highlighted (Hero y pasadas), 6 Featured (Importantes), 20 Default (Listado)
        const isFeatured = (i >= 0 && i <= 4) ? 'highlighted' : (i >= 5 && i <= 10 ? 'featured' : 'default');
        
        dummyNews.push({
            title: item.title,
            slug: `noticia-${i}-${Date.now()}`,
            summary: item.summary,
            content: dummyContents,
            highlights: ['actualidad', 'cobertura', 'periodismo'],
            author: author._id,
            category: categoriesMap[item.category],
            variant: isFeatured,
            status: 'published',
            publicationDate: new Date(Date.now() - i * 3600000), // Diferentes horas para simular historial
            mainImage: `https://picsum.photos/seed/${i * 4567}/800/600`, // Imágenes semidiferentes
        });
    }

    // 5. Insert all into DB
    const inserted = await NewsModel.insertMany(dummyNews);
    
    logger.info(`Successfully seeded ${inserted.length} dummy news articles!`);
    logger.info(`With Images: 30 | Categorization distributed cleanly.`);

  } catch (error) {
    logger.error({ error }, 'Error seeding database');
  } finally {
    await mongoose.connection.close();
  }
}

seedNews();
