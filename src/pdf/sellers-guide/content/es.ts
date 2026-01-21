import type { SellerGuideContent } from './en';

export const content: SellerGuideContent = {
  locale: 'es',

  // Cover Page
  cover: {
    title: 'Guía del Vendedor\nde Casa en Texas',
    subtitle: 'Tu Camino Hacia una Venta Exitosa',
    agentTitle: 'Tu Guía Personal por',
    agentName: 'Sully Ruiz',
    edition: 'Edición 2025',
    brokerage: 'Keller Williams Realty',
  },

  // Page 2: Welcome + Market Overview
  welcome: {
    chapterTitle: 'Bienvenida',
    greeting: 'Bienvenido a Tu Viaje de Venta de Casa',
    message: `Felicidades por dar el primer paso hacia la venta de tu casa en Texas. Ya sea que te estés mudando, mejorando, o simplemente listo para un nuevo capítulo, esta guía te acompañará en cada paso del proceso. El mercado inmobiliario de Texas ofrece oportunidades increíbles para los vendedores preparados. Con la estrategia y orientación adecuadas, maximizarás el valor de tu casa y lograrás una venta exitosa y sin problemas.`,
    signature: '— Sully Ruiz',
  },

  marketOverview: {
    sectionTitle: 'Panorama del Mercado de Austin y Central Texas',
    intro: `El mercado inmobiliario del centro de Texas continúa atrayendo compradores de todo el país. Esto es lo que los vendedores necesitan saber para 2025:`,
    stats: [
      { label: 'Precio Medio en Austin Metro', value: '$450,000 - $550,000' },
      { label: 'Round Rock / Georgetown', value: '$400,000 - $480,000' },
      { label: 'San Marcos / Kyle', value: '$320,000 - $400,000' },
      { label: 'Días Promedio en el Mercado', value: '45-60 días' },
    ],
    timing: {
      title: 'Mejor Momento para Vender',
      content: `La primavera y el inicio del verano tradicionalmente ven la mayor actividad de compradores, pero las casas bien valoradas se venden todo el año en Central Texas. La clave es fijar el precio correcto desde el principio y presentar tu casa de la mejor manera.`,
    },
    callout: {
      title: 'La Realidad de Texas',
      content: `Las casas que tienen el precio correcto y están debidamente preparadas se venden más rápido y por más dinero. Sobrevalorar lleva a más días en el mercado y a menudo resulta en vender por menos que si se hubiera fijado el precio correcto desde el principio.`,
    },
  },

  // Pages 3-5: The Home Selling Journey (5 Steps)
  steps: {
    chapterTitle: 'El Viaje de Venta de Casa',
    chapterNumber: 'Capítulo Uno',
    intro: `Cada venta exitosa de casa sigue un camino probado. Aquí están los cinco pasos esenciales que te llevarán desde el listado hasta el cierre.`,

    items: [
      {
        number: 1,
        title: 'Fija el Precio Correcto',
        description: `La decisión más crítica que tomarás es el precio de lista. Si el precio es muy alto, los compradores pasarán de largo. Si es muy bajo, dejarás dinero sobre la mesa. Te proporcionaré un análisis de mercado completo comparando tu casa con ventas recientes, ayudándote a encontrar el punto óptimo que atraiga compradores mientras maximiza tu retorno.`,
        tip: `Las primeras dos semanas en el mercado son cruciales. Es cuando tu casa recibe la mayor atención de compradores activos. Comenzar con el precio correcto significa capturar compradores serios cuando el interés está en su punto más alto.`,
      },
      {
        number: 2,
        title: 'Prepara Tu Casa',
        description: `Las primeras impresiones lo son todo. Antes de listar, identificaremos mejoras que ofrecen el mejor retorno de inversión. Esto puede incluir ordenar, reparaciones menores, pintura fresca, o staging profesional. El objetivo es ayudar a los compradores a imaginarse viviendo en tu casa.`,
        tip: `No necesitas renovar toda tu casa. Enfócate en el atractivo exterior, cocina y baños. Una limpieza profunda, jardinería fresca y colores de pintura neutros pueden transformar cómo los compradores perciben tu casa.`,
      },
      {
        number: 3,
        title: 'Marketing Efectivo',
        description: `Tu casa merece máxima exposición a compradores calificados. Uso fotografía profesional, recorridos virtuales, marketing digital dirigido, y mi red de agentes y compradores para mostrar tu propiedad. Cada listado recibe un plan de marketing personalizado diseñado para alcanzar la audiencia correcta.`,
        tip: `Las fotos profesionales no son negociables. Las casas con fotografía profesional se venden 32% más rápido y por más dinero. Las fotos de tu listado son a menudo la primera impresión que los compradores tienen de tu casa.`,
      },
      {
        number: 4,
        title: 'Navega las Ofertas',
        description: `Cuando llegan las ofertas, el trabajo realmente comienza. Te ayudaré a evaluar cada oferta más allá del precio—considerando términos de financiamiento, contingencias, cronograma de cierre y calificaciones del comprador. Juntos, negociaremos para obtener los mejores términos posibles.`,
        tip: `La oferta más alta no siempre es la mejor oferta. Un comprador sólido con financiamiento seguro y menos contingencias a menudo resulta en una transacción más fluida que una oferta más alta con financiamiento inestable.`,
      },
      {
        number: 5,
        title: 'Cierra Exitosamente',
        description: `Una vez que hayas aceptado una oferta, coordinaré inspecciones, avalúos y todo el papeleo para asegurar un cierre sin problemas. Te mantendré informado en cada paso del camino, abordando cualquier problema antes de que se convierta en un obstáculo. El día del cierre, firmarás documentos, recibirás tus ganancias y entregarás las llaves.`,
        tip: `Guarda los recibos de cualquier reparación o mejora hecha para el comprador. Ten todas las garantías, manuales y registros organizados para los nuevos propietarios—deja una gran impresión y puede prevenir disputas después de la venta.`,
      },
    ],
  },

  // Page 6: Understanding Seller Costs
  costs: {
    chapterTitle: 'Entendiendo los Costos del Vendedor',
    chapterNumber: 'Capítulo Dos',
    intro: `Conocer tus costos por adelantado te ayuda a planificar efectivamente y establecer expectativas realistas. Esto es lo que puedes esperar al vender tu casa en Texas.`,

    costBreakdown: {
      title: 'Costos Típicos del Vendedor',
      headers: ['Tipo de Costo', 'Rango Típico', 'Notas'],
      rows: [
        ['Comisión del Agente', '5-6%', 'Dividido entre agentes del comprador y vendedor'],
        ['Costos de Cierre', '1-3%', 'Seguro de título, tarifas de escrow, etc.'],
        ['Reparaciones/Concesiones', '0-2%', 'Negociado con el comprador'],
        ['Preparación de Casa', '$500-$5,000', 'Staging, reparaciones, limpieza'],
      ],
    },

    netProceeds: {
      title: 'Calculando Tus Ganancias Netas',
      items: [
        'Precio de Venta: Por cuánto se vende tu casa',
        'Menos Pago de Hipoteca: Tu saldo restante del préstamo',
        'Menos Costos del Vendedor: Comisiones, costos de cierre, reparaciones',
        'Igual a Ganancias Netas: Lo que te llevas',
      ],
    },

    callout: {
      title: 'Consejo para Ahorrar Dinero',
      content: `Solicita una hoja de ganancias netas del vendedor a tu agente antes de listar. Este desglose detallado muestra exactamente cuánto recibirás de la venta en diferentes puntos de precio, ayudándote a tomar decisiones informadas sobre precios y negociaciones.`,
    },
  },

  // Page 7: Top 5 Mistakes to Avoid
  mistakes: {
    chapterTitle: 'Los 5 Errores Principales a Evitar',
    chapterNumber: 'Capítulo Tres',
    intro: `Incluso los propietarios experimentados pueden tropezar al vender. Aquí están los errores más comunes que veo—y cómo evitarlos.`,

    items: [
      {
        number: 1,
        title: 'Sobrevalorar Tu Casa',
        description: `El apego emocional y el optimismo del mercado llevan a muchos vendedores a sobrevalorar. Esto resulta en menos visitas, más días en el mercado y, finalmente, vender por menos que si se hubiera fijado el precio correcto desde el inicio.`,
      },
      {
        number: 2,
        title: 'Descuidar el Atractivo Exterior',
        description: `Los compradores forman opiniones antes de entrar por la puerta. Jardinería descuidada, pintura descascarada o un porche desordenado pueden alejar a los compradores antes de que vean el interior de tu casa.`,
      },
      {
        number: 3,
        title: 'Estar Presente Durante las Visitas',
        description: `Es natural querer mostrar tu casa, pero los compradores necesitan espacio para imaginarse viviendo allí. Tu presencia los hace sentir incómodos y reacios a mirar de cerca o discutir preocupaciones con su agente.`,
      },
      {
        number: 4,
        title: 'Ocultar Problemas Conocidos',
        description: `La ley de Texas requiere divulgación de defectos conocidos. Ocultar problemas puede llevar a responsabilidad legal y a menudo arruina tratos durante la inspección. La transparencia construye confianza y transacciones más fluidas.`,
      },
      {
        number: 5,
        title: 'Rechazar la Primera Oferta',
        description: `La primera oferta es a menudo tu mejor oferta. Los compradores serios que han estado observando el mercado típicamente actúan rápido. Rechazar una oferta justa esperando algo mejor a menudo resulta contraproducente.`,
      },
    ],
  },

  // Page 8: Checklist + Contact
  checklist: {
    chapterTitle: 'Tu Lista de Verificación Pre-Listado',
    items: [
      'Ordena y despersonaliza cada habitación',
      'Limpieza profunda de toda la casa (incluyendo ventanas)',
      'Completa reparaciones menores (grifos, puertas rechinantes)',
      'Retoca pintura y rellena agujeros en paredes',
      'Mejora el atractivo exterior (jardinería, puerta principal)',
      'Organiza armarios y áreas de almacenamiento',
      'Reúne documentos del hogar (garantías, permisos, facturas)',
      'Programa fotografía profesional',
      'Planifica acomodaciones para mascotas durante visitas',
      'Revisa y firma el acuerdo de listado',
      'Prepárate para tu próxima mudanza',
    ],
  },

  contact: {
    sectionTitle: 'Conectemos',
    message: `¿Listo para vender tu casa en Texas? Estoy aquí para guiarte en cada paso del camino. Ya sea que estés explorando tus opciones o listo para listar, hablemos sobre cómo puedo ayudarte a lograr una venta exitosa.`,
    cta: '¿Listo para vender tu casa en Texas? Hablemos.',
    name: 'Sully Ruiz',
    title: 'Agente de Bienes Raíces',
    phone: '(512) 555-0123',
    email: 'sully@sullyruiz.com',
    website: 'sullyruiz.com',
  },

  // Footer
  footer: {
    agentName: 'Sully Ruiz',
    website: 'sullyruiz.com',
  },
};
