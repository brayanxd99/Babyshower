import os
import json

# Product Data extracted from CSV
products = [
    {"name": "Luna de lactancia", "category": "Esenciales", "quantityNeeded": 1, "priority": "Alta", "hasLink": True, "description": "Firme, cómoda, con funda removible y lavable."},
    {"name": "Tina de baño", "category": "Baño", "quantityNeeded": 1, "priority": "Alta", "hasLink": True, "description": "Preferiblemente plegable, estable, antideslizante."},
    {"name": "Cobijas", "category": "Dormir", "quantityNeeded": 3, "priority": "Alta", "hasLink": False, "description": "Livianas: algodón o tejido transpirable. Térmica: abrigada pero suave."},
    {"name": "Fular o cargador", "category": "Esenciales", "quantityNeeded": 1, "priority": "Alta", "hasLink": True, "description": "Ergonómico, ajustable y apto para recién nacido."},
    {"name": "Teteros", "category": "Alimentación", "quantityNeeded": 2, "priority": "Alta", "hasLink": True, "description": "Kits pequeños, preferiblemente anticólicos."},
    {"name": "Pañalera", "category": "Otros", "quantityNeeded": 1, "priority": "Muy alta", "hasLink": True, "description": "Preferiblemente tipo morral, cómoda, resistente."},
    {"name": "Toallas de baño", "category": "Baño", "quantityNeeded": 3, "priority": "Muy alta", "hasLink": False, "description": "Suaves, absorbentes y preferiblemente de algodón."},
    {"name": "Kit de aseo", "category": "Baño", "quantityNeeded": 1, "priority": "Muy alta", "hasLink": True, "description": "Para recién nacido: cepillo suave, cortaúñas/lima, aspirador nasal."},
    {"name": "Cambiador", "category": "Esenciales", "quantityNeeded": 2, "priority": "Muy alta", "hasLink": True, "description": "Casa: impermeable. Portátil: plegable."},
    {"name": "Muselinas", "category": "Esenciales", "quantityNeeded": 4, "priority": "Muy alta", "hasLink": False, "description": "Preferiblemente paquetes de algodón, suaves, ligeras y transpirables."},
    {"name": "Gimnasio para bebé", "category": "Estimulación", "quantityNeeded": 1, "priority": "Media", "hasLink": True, "description": "Acolchado, lavable, con estímulos visuales."},
    {"name": "Móvil", "category": "Dormir", "quantityNeeded": 1, "priority": "Media", "hasLink": True, "description": "Estimulación visual suave, instalación segura."},
    {"name": "Juegos de sonidos / sensoriales", "category": "Estimulación", "quantityNeeded": 2, "priority": "Media", "hasLink": False, "description": "Sonajeros o juguetes sensoriales."},
    {"name": "Mordederos", "category": "Estimulación", "quantityNeeded": 3, "priority": "Alta", "hasLink": False, "description": "Silicona de grado alimentario."},
    {"name": "Recipientes para porcionar", "category": "Alimentación", "quantityNeeded": 2, "priority": "Alta", "hasLink": True, "description": "Para alimentación complementaria."},
    {"name": "Ropita (Tallas)", "category": "Ropita", "quantityNeeded": 5, "priority": "Muy alta", "hasLink": False, "description": "Telas suaves y cómodas, preferiblemente algodón."},
    {"name": "Pijamas (Tallas)", "category": "Ropita", "quantityNeeded": 5, "priority": "Muy alta", "hasLink": False, "description": "Suaves y cómodas. Enterizos con cierre."},
    {"name": "Baberos", "category": "Alimentación", "quantityNeeded": 3, "priority": "Muy alta", "hasLink": False, "description": "Paquetes absorbentes de tela."},
    {"name": "Medias y gorritos", "category": "Ropita", "quantityNeeded": 2, "priority": "Media", "hasLink": False, "description": "Sets suaves y sin elásticos apretados."},
    {"name": "Tapete de juego", "category": "Estimulación", "quantityNeeded": 1, "priority": "Alta", "hasLink": True, "description": "Acolchado, antideslizante, lavable."},
    {"name": "Mecedora para bebé", "category": "Otros", "quantityNeeded": 1, "priority": "Media", "hasLink": True, "description": "Base estable, arnés de seguridad."},
    {"name": "Monitor para bebé", "category": "Otros", "quantityNeeded": 1, "priority": "Alta", "hasLink": True, "description": "Con cámara, visión nocturna y buen alcance."},
]

SCHEMA_PRISMA = """
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

model Product {
  id               String   @id @default(cuid())
  name             String
  category         String
  quantityNeeded   Int
  priority         String
  hasLink          Boolean  @default(false)
  linkUrl          String?
  description      String?
  reservations     Reservation[]
}

model Reservation {
  id           String   @id @default(cuid())
  productId    String
  product      Product  @relation(fields: [productId], references: [id])
  guestName    String
  quantity     Int
  whatsapp     String?
  message      String?
  createdAt    DateTime @default(now())
}
"""

SEED_TS = f"""
import {{ PrismaClient }} from '@prisma/client'
const prisma = new PrismaClient()

const products = {json.dumps(products, indent=2, ensure_ascii=False)}

async function main() {{
  for (const p of products) {{
    await prisma.product.create({{
      data: p
    }})
  }}
}}
main()
  .catch((e) => {{ console.error(e); process.exit(1); }})
  .finally(async () => {{ await prisma.$disconnect(); }})
"""

# Let's just create these two files for now to test, then I'll create the UI files.
os.makedirs("prisma", exist_ok=True)
with open("prisma/schema.prisma", "w", encoding="utf-8") as f:
    f.write(SCHEMA_PRISMA)

with open("prisma/seed.ts", "w", encoding="utf-8") as f:
    f.write(SEED_TS)

print("Created prisma schema and seed.")
