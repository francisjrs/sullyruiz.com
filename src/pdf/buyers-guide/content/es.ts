import type { GuideContent } from './en';

export const content: GuideContent = {
  locale: 'es',

  // Cover Page
  cover: {
    title: 'Guía del Comprador\nde Casa en Texas',
    subtitle: 'Tu Camino Hacia la Propiedad de Vivienda',
    agentTitle: 'Tu Guía Personal por',
    agentName: 'Sully Ruiz',
    edition: 'Edición 2025',
    brokerage: 'Keller Williams Realty',
  },

  // Page 2: Welcome + Market Overview
  welcome: {
    chapterTitle: 'Bienvenida',
    greeting: 'Bienvenido a Tu Viaje de Compra de Casa',
    message: `Gracias por dar el primer paso hacia encontrar tu hogar en Texas. Ya sea que seas un comprador por primera vez o te estés mudando al Estado de la Estrella Solitaria, esta guía te acompañará en cada paso del proceso. El mercado inmobiliario de Texas se mueve rápido, pero con la preparación y orientación adecuadas, estarás listo para encontrar el hogar perfecto para ti y tu familia.`,
    signature: '— Sully Ruiz',
  },

  marketOverview: {
    sectionTitle: 'Panorama del Mercado de Austin y Central Texas',
    intro: `El mercado inmobiliario del centro de Texas continúa siendo uno de los más dinámicos del país. Esto es lo que necesitas saber para 2025:`,
    stats: [
      { label: 'Precio Medio en Austin Metro', value: '$450,000 - $550,000' },
      { label: 'Round Rock / Georgetown', value: '$400,000 - $480,000' },
      { label: 'San Marcos / Kyle', value: '$320,000 - $400,000' },
      { label: 'Días Promedio en el Mercado', value: '45-60 días' },
    ],
    timing: {
      title: 'Mejor Momento para Comprar',
      content: `Aunque la primavera y el verano tienen más listados, los compradores inteligentes saben que el otoño y el invierno a menudo traen menos competencia y vendedores más motivados. La clave es estar preparado cuando aparezca la casa correcta.`,
    },
    callout: {
      title: 'La Realidad de Texas',
      content: `En Texas, el mercado se mueve rápido. Las casas en áreas deseables pueden recibir múltiples ofertas en días. Tener tu pre-aprobación lista y un agente de confianza a tu lado hace toda la diferencia.`,
    },
  },

  // Pages 3-5: The Home Buying Journey (5 Steps)
  steps: {
    chapterTitle: 'El Viaje de Compra de Casa',
    chapterNumber: 'Capítulo Uno',
    intro: `Cada compra exitosa de casa sigue un camino probado. Aquí están los cinco pasos esenciales que te llevarán desde soñar hasta ser propietario.`,

    items: [
      {
        number: 1,
        title: 'Obtén Tu Pre-Aprobación',
        description: `Antes de enamorarte de una casa, sabe exactamente cuánto puedes pagar. Una carta de pre-aprobación de un prestamista muestra a los vendedores que eres un comprador serio y te indica tu rango de precios. Reúne tus documentos financieros—talones de pago, declaraciones de impuestos, estados de cuenta bancarios—y reúnete con un prestamista para comenzar.`,
        tip: `Una pre-aprobación es diferente de una pre-calificación. La pre-aprobación implica verificación de tu información financiera y tiene más peso con los vendedores. En mercados competitivos, a menudo es requerida incluso para presentar una oferta.`,
      },
      {
        number: 2,
        title: 'Encuentra Tu Casa Ideal',
        description: `Crea dos listas: tus "imprescindibles" y tus "deseables." Sé realista sobre lo que necesitas versus lo que quieres. Tu agente de bienes raíces configurará búsquedas personalizadas y programará visitas que coincidan con tus criterios. Recuerda, ninguna casa es perfecta—enfócate en lo que más te importa.`,
        tip: `No intentes hacerlo solo. Un agente de compradores no te cuesta nada (el vendedor paga la comisión) y proporciona experiencia invaluable en vecindarios, precios, negociaciones y todo el proceso de compra.`,
      },
      {
        number: 3,
        title: 'Haz una Oferta Ganadora',
        description: `Cuando encuentres "la indicada," es hora de hacer una oferta. Tu agente te ayudará a determinar un precio competitivo basado en ventas comparables y condiciones del mercado. En Texas, el período de opción—típicamente 7-10 días—te da tiempo para realizar inspecciones y retirarte si es necesario, por una pequeña tarifa.`,
        tip: `El período de opción de Texas es único en nuestro estado. Por una tarifa negociable (usualmente $100-$500), puedes terminar el contrato por cualquier razón durante este período. Es tu red de seguridad—úsala sabiamente.`,
      },
      {
        number: 4,
        title: 'Completa la Debida Diligencia',
        description: `Una vez que tu oferta es aceptada, el reloj comienza a correr. Necesitarás completar una inspección de la casa, ordenar una tasación (tu prestamista maneja esto), y trabajar con una compañía de títulos para asegurar que la propiedad tenga un título limpio. Cualquier problema descubierto puede ser negociado con el vendedor durante esta fase.`,
        tip: `Nunca te saltes la inspección de la casa. Un inspector calificado identificará problemas potenciales con los cimientos, techo, electricidad, plomería y más. Esta pequeña inversión puede ahorrarte miles en el futuro.`,
      },
      {
        number: 5,
        title: 'Cierra y Recibe Tus Llaves',
        description: `¡La meta está a la vista! Antes del cierre, harás un recorrido final para asegurar que la propiedad esté en las condiciones acordadas. En el cierre, firmarás documentos, pagarás los costos de cierre y recibirás las llaves de tu nueva casa. En Texas, a menudo puedes cerrar dentro de 30-45 días de una oferta aceptada.`,
        tip: `Lleva una identificación válida y un cheque de caja (o confirmación de transferencia bancaria) para tus costos de cierre y pago inicial. ¡No olvides configurar los servicios y cambiar tu dirección antes del día de la mudanza!`,
      },
    ],
  },

  // Page 6: Financing Made Simple
  financing: {
    chapterTitle: 'Financiamiento Simplificado',
    chapterNumber: 'Capítulo Dos',
    intro: `Entender tus opciones de financiamiento es clave para tomar decisiones informadas. Aquí hay un desglose de los tipos de préstamos más comunes y programas específicos de Texas que pueden ayudar.`,

    loanComparison: {
      title: 'Comparación de Tipos de Préstamo',
      headers: ['Tipo de Préstamo', 'Pago Inicial', 'Ideal Para'],
      rows: [
        ['Convencional', '3-20%', 'Buen crédito, ingresos estables'],
        ['FHA', '3.5%', 'Compradores primerizos, puntajes más bajos'],
        ['VA', '0%', 'Veteranos y militares activos'],
        ['USDA', '0%', 'Áreas rurales, aplican límites de ingresos'],
      ],
    },

    texasPrograms: {
      title: 'Programas y Asistencia de Texas',
      items: [
        {
          name: 'TSAHC (Corporación de Vivienda Asequible del Estado de Texas)',
          description: 'Asistencia para pago inicial y certificados de crédito hipotecario para compradores elegibles.',
        },
        {
          name: 'TDHCA (Departamento de Vivienda de Texas)',
          description: 'El programa Mi Primera Casa de Texas ofrece tasas competitivas y asistencia para pago inicial.',
        },
        {
          name: 'Programas de Ciudades Locales',
          description: 'Muchas ciudades de Texas ofrecen programas de asistencia adicionales—pregunta a tu prestamista sobre opciones en tu área.',
        },
      ],
    },

    keyCosts: {
      title: 'Costos Clave a Conocer',
      items: [
        'Pago Inicial: Típicamente 3-20% del precio de compra',
        'Costos de Cierre: 2-5% del monto del préstamo (tarifas, seguro de título, impuestos prepagados)',
        'Impuestos de Propiedad: Texas no tiene impuesto estatal sobre la renta, pero los impuestos de propiedad promedian 1.8-2.2% del valor de la casa anualmente',
        'Seguro de Propietarios: Requerido por los prestamistas, varía por ubicación y cobertura',
      ],
    },

    callout: {
      title: 'Consejo para Ahorrar Dinero',
      content: `Pregunta a tu prestamista sobre comprar puntos para reducir tu tasa de interés. Un punto (1% del monto del préstamo) puede reducir tu tasa 0.25%. Si planeas quedarte en la casa a largo plazo, esto puede ahorrarte miles durante la vida del préstamo.`,
    },
  },

  // Page 7: Top 5 Mistakes to Avoid
  mistakes: {
    chapterTitle: 'Los 5 Errores Principales a Evitar',
    chapterNumber: 'Capítulo Tres',
    intro: `Incluso los compradores más preparados pueden tropezar. Aquí están los errores más comunes que veo—y cómo evitarlos.`,

    items: [
      {
        number: 1,
        title: 'No Obtener Pre-Aprobación Primero',
        description: `Buscar sin pre-aprobación pierde tiempo y puede costarte la casa que amas. Los vendedores en mercados competitivos ni siquiera considerarán ofertas sin prueba de financiamiento.`,
      },
      {
        number: 2,
        title: 'Saltarse la Inspección de la Casa',
        description: `Incluso las construcciones nuevas pueden tener problemas. Una inspección de $400-500 puede descubrir problemas que cuestan decenas de miles en reparaciones. Es tu mejor seguro contra sorpresas ocultas.`,
      },
      {
        number: 3,
        title: 'Hacer Compras Grandes Antes del Cierre',
        description: `Ese auto nuevo o juego de muebles puede esperar. Las compras grandes o nuevas cuentas de crédito pueden cambiar tu relación deuda-ingreso y poner en riesgo la aprobación de tu préstamo en el último minuto.`,
      },
      {
        number: 4,
        title: 'Renunciar al Período de Opción',
        description: `En mercados calientes, algunos compradores renuncian al período de opción para hacer su oferta más atractiva. Esto es arriesgado—pierdes tu capacidad de retirarte si las inspecciones revelan problemas importantes.`,
      },
      {
        number: 5,
        title: 'Hacerlo Solo',
        description: `Comprar una casa es la transacción financiera más grande que la mayoría de personas hace. Un agente de bienes raíces calificado proporciona experiencia, habilidades de negociación y tranquilidad—sin costo para ti como comprador.`,
      },
    ],
  },

  // Page 8: Checklist + Contact
  checklist: {
    chapterTitle: 'Tu Lista de Verificación para Comprar',
    items: [
      'Revisa tu puntaje de crédito (apunta a 620+)',
      'Calcula tu presupuesto (pago mensual ≤ 28% de ingresos)',
      'Obtén pre-aprobación con un prestamista',
      'Crea tu lista de imprescindibles vs. deseables',
      'Encuentra un agente de bienes raíces de confianza',
      'Comienza tu búsqueda de casa',
      'Haz una oferta y negocia',
      'Completa inspección y tasación',
      'Revisa documentos de cierre',
      'Haz recorrido final',
      '¡Cierra y celebra!',
    ],
  },

  contact: {
    sectionTitle: 'Conectemos',
    message: `¿Listo para encontrar tu hogar en Texas? Estoy aquí para guiarte en cada paso del camino. Ya sea que estés comenzando a explorar o listo para hacer una oferta, hablemos sobre cómo puedo ayudar a hacer realidad tus sueños de ser propietario.`,
    cta: '¿Listo para encontrar tu hogar en Texas? Hablemos.',
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
