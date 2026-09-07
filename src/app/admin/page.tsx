import prisma from '@/lib/prisma';
import { Heart } from 'lucide-react';

export default async function AdminPage() {
  const products = await prisma.product.findMany({
    include: { reservations: true },
    orderBy: { category: 'asc' }
  });

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <h1 className="text-3xl font-serif text-[#d8a1a4] mb-8 flex items-center gap-3">
        <Heart /> Panel de Padres
      </h1>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left text-sm text-gray-600">
          <thead className="bg-pink-50 text-gray-800">
            <tr>
              <th className="px-6 py-4 font-medium">Regalo</th>
              <th className="px-6 py-4 font-medium">Categoría</th>
              <th className="px-6 py-4 font-medium">Reservados / Necesarios</th>
              <th className="px-6 py-4 font-medium">Invitados</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {products.map(product => {
              const reservedQty = product.reservations.reduce((acc, curr) => acc + curr.quantity, 0);
              return (
                <tr key={product.id} className="hover:bg-gray-50/50">
                  <td className="px-6 py-4 font-medium text-gray-800">{product.name}</td>
                  <td className="px-6 py-4">{product.category}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${reservedQty === product.quantityNeeded ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                      {reservedQty} / {product.quantityNeeded}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {product.reservations.length === 0 ? (
                      <span className="text-gray-400 italic">Nadie aún</span>
                    ) : (
                      <ul className="space-y-1">
                        {product.reservations.map(res => (
                          <li key={res.id} className="text-sm">
                            <span className="font-medium">{res.guestName}</span> 
                            {res.quantity > 1 && ` (x${res.quantity})`}
                            {res.message && <span className="block text-xs text-gray-500 italic mt-0.5">"{res.message}"</span>}
                          </li>
                        ))}
                      </ul>
                    )}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
