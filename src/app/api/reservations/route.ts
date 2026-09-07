import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { items, guestName, whatsapp, message } = body;

    if (!guestName || !items || items.length === 0) {
      return NextResponse.json({ error: 'Faltan datos requeridos' }, { status: 400 });
    }

    // Process reservations in a transaction
    const reservations = await prisma.$transaction(async (tx) => {
      const createdReservations = [];
      
      for (const item of items) {
        // Verify availability
        const product = await tx.product.findUnique({
          where: { id: item.productId },
          include: { reservations: true }
        });
        
        if (!product) throw new Error(`Producto ${item.productId} no encontrado`);
        
        const reservedQuantity = product.reservations.reduce((acc, curr) => acc + curr.quantity, 0);
        const available = product.quantityNeeded - reservedQuantity;
        
        if (item.quantity > available) {
          throw new Error(`No hay suficiente cantidad para ${product.name}`);
        }
        
        const res = await tx.reservation.create({
          data: {
            productId: item.productId,
            guestName,
            whatsapp,
            message,
            quantity: item.quantity
          }
        });
        
        createdReservations.push(res);
      }
      return createdReservations;
    });

    return NextResponse.json({ success: true, reservations });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Error creating reservation' }, { status: 500 });
  }
}
