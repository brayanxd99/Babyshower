import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

const products = [
    {"name": "Luna de lactancia", "category": "Esenciales", "quantityNeeded": 1, "priority": "Alta", "hasLink": true, "description": "Firme, cómoda, con funda removible y lavable."},
    {"name": "Tina de baño", "category": "Baño", "quantityNeeded": 1, "priority": "Alta", "hasLink": true, "description": "Preferiblemente plegable, estable, antideslizante."},
    {"name": "Cobijas", "category": "Dormir", "quantityNeeded": 3, "priority": "Alta", "hasLink": false, "description": "Livianas: algodón o tejido transpirable. Térmica: abrigada pero suave."},
    {"name": "Fular o cargador", "category": "Esenciales", "quantityNeeded": 1, "priority": "Alta", "hasLink": true, "description": "Ergonómico, ajustable y apto para recién nacido."},
    {"name": "Teteros", "category": "Alimentación", "quantityNeeded": 2, "priority": "Alta", "hasLink": true, "description": "Kits pequeños, preferiblemente anticólicos."},
    {"name": "Pañalera", "category": "Otros", "quantityNeeded": 1, "priority": "Muy alta", "hasLink": true, "description": "Preferiblemente tipo morral, cómoda, resistente."},
    {"name": "Toallas de baño", "category": "Baño", "quantityNeeded": 3, "priority": "Muy alta", "hasLink": false, "description": "Suaves, absorbentes y preferiblemente de algodón."},
    {"name": "Kit de aseo", "category": "Baño", "quantityNeeded": 1, "priority": "Muy alta", "hasLink": true, "description": "Para recién nacido: cepillo suave, cortaúñas/lima, aspirador nasal."},
    {"name": "Cambiador", "category": "Esenciales", "quantityNeeded": 2, "priority": "Muy alta", "hasLink": true, "description": "Casa: impermeable. Portátil: plegable."},
    {"name": "Muselinas", "category": "Esenciales", "quantityNeeded": 4, "priority": "Muy alta", "hasLink": false, "description": "Preferiblemente paquetes de algodón, suaves, ligeras y transpirables."},
    {"name": "Gimnasio para bebé", "category": "Estimulación", "quantityNeeded": 1, "priority": "Media", "hasLink": true, "description": "Acolchado, lavable, con estímulos visuales."},
    {"name": "Móvil", "category": "Dormir", "quantityNeeded": 1, "priority": "Media", "hasLink": true, "description": "Estimulación visual suave, instalación segura."},
    {"name": "Juegos de sonidos / sensoriales", "category": "Estimulación", "quantityNeeded": 2, "priority": "Media", "hasLink": false, "description": "Sonajeros o juguetes sensoriales."},
    {"name": "Mordederos", "category": "Estimulación", "quantityNeeded": 3, "priority": "Alta", "hasLink": false, "description": "Silicona de grado alimentario."},
    {"name": "Recipientes para porcionar", "category": "Alimentación", "quantityNeeded": 2, "priority": "Alta", "hasLink": true, "description": "Para alimentación complementaria."},
    // Ropita sizes
    {"name": "Ropita (Talla 0-3 meses)", "category": "Ropita", "quantityNeeded": 1, "priority": "Muy alta", "hasLink": false, "description": "Bodies, enterizo o conjunto cómodo (0-3 meses)"},
    {"name": "Ropita (Talla 3-6 meses)", "category": "Ropita", "quantityNeeded": 2, "priority": "Muy alta", "hasLink": false, "description": "Bodies o conjunto (3-6 meses)"},
    {"name": "Ropita (Talla 6-9 meses)", "category": "Ropita", "quantityNeeded": 3, "priority": "Muy alta", "hasLink": false, "description": "Conjunto cómodo para mayor movimiento (6-9 meses)"},
    {"name": "Ropita (Talla 9-12 meses)", "category": "Ropita", "quantityNeeded": 4, "priority": "Muy alta", "hasLink": false, "description": "Conjunto, vestido, body o leggings (9-12 meses)"},
    {"name": "Ropita (Talla 12-18 meses)", "category": "Ropita", "quantityNeeded": 5, "priority": "Muy alta", "hasLink": false, "description": "Ropa cómoda para gateo/caminata (12-18 meses)"},
    // Pijama sizes
    {"name": "Pijama (Talla 0-3 meses)", "category": "Ropita", "quantityNeeded": 1, "priority": "Muy alta", "hasLink": false, "description": "Enterizo cómodo, preferiblemente con cierre (0-3 meses)"},
    {"name": "Pijama (Talla 3-6 meses)", "category": "Ropita", "quantityNeeded": 2, "priority": "Muy alta", "hasLink": false, "description": "Enterizo o pijama suave (3-6 meses)"},
    {"name": "Pijama (Talla 6-9 meses)", "category": "Ropita", "quantityNeeded": 3, "priority": "Muy alta", "hasLink": false, "description": "Enterizo o pijama según talla (6-9 meses)"},
    {"name": "Pijama (Talla 9-12 meses)", "category": "Ropita", "quantityNeeded": 4, "priority": "Muy alta", "hasLink": false, "description": "Pijama cómoda que permita movimiento (9-12 meses)"},
    {"name": "Pijama (Talla 12-18 meses)", "category": "Ropita", "quantityNeeded": 5, "priority": "Muy alta", "hasLink": false, "description": "Pijama para mayor movilidad (12-18 meses)"},
    
    {"name": "Baberos", "category": "Alimentación", "quantityNeeded": 3, "priority": "Muy alta", "hasLink": false, "description": "Paquetes absorbentes de tela."},
    {"name": "Medias y gorritos", "category": "Ropita", "quantityNeeded": 2, "priority": "Media", "hasLink": false, "description": "Sets suaves y sin elásticos apretados."},
    {"name": "Tapete de juego", "category": "Estimulación", "quantityNeeded": 1, "priority": "Alta", "hasLink": true, "description": "Acolchado, antideslizante, lavable."},
    {"name": "Mecedora para bebé", "category": "Otros", "quantityNeeded": 1, "priority": "Media", "hasLink": true, "description": "Base estable, arnés de seguridad."},
    {"name": "Monitor para bebé", "category": "Otros", "quantityNeeded": 1, "priority": "Alta", "hasLink": true, "description": "Con cámara, visión nocturna y buen alcance."}
];

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const force = url.searchParams.get('force');
    const count = await prisma.product.count();
    
    if (count === 0 || force === 'true') {
      if (force === 'true') {
         await prisma.reservation.deleteMany({});
         await prisma.product.deleteMany({});
      }

      for (const p of products) {
        await prisma.product.create({ data: p });
      }
      return NextResponse.json({ message: 'Base de datos llenada exitosamente con los regalos (y tallas)' });
    } else {
      return NextResponse.json({ message: 'La base de datos ya tenía productos. Agrega ?force=true a la URL para reiniciar.' });
    }
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
