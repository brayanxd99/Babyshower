import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const products = await prisma.product.findMany({
      include: {
        reservations: true
      }
    });
    
    const formattedProducts = products.map(product => {
      const reservedQuantity = product.reservations.reduce((acc, curr) => acc + curr.quantity, 0);
      return {
        ...product,
        reservedQuantity,
        availableQuantity: product.quantityNeeded - reservedQuantity
      };
    });

    return NextResponse.json(formattedProducts);
  } catch (error) {
    return NextResponse.json({ error: 'Error fetching products' }, { status: 500 });
  }
}
