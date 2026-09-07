"use client";
import { useState, useEffect } from "react";
import { Heart, Gift, ShoppingCart, Trash2, X, Info } from "lucide-react";

type Product = {
  id: string;
  name: string;
  category: string;
  quantityNeeded: number;
  priority: string;
  hasLink: boolean;
  description: string;
  availableQuantity: number;
  reservedQuantity: number;
};

type CartItem = Product & { cartQuantity: number };

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("inicio");
  const [categoryFilter, setCategoryFilter] = useState("Todos");
  
  // Form state
  const [guestName, setGuestName] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await fetch("/api/products");
      const data = await res.json();
      setProducts(data);
      setLoading(false);
    } catch (e) {
      console.error(e);
      setLoading(false);
    }
  };

  const categories = ["Todos", ...Array.from(new Set(products.map(p => p.category)))];

  const filteredProducts = categoryFilter === "Todos" 
    ? products 
    : products.filter(p => p.category === categoryFilter);

  const addToCart = (product: Product) => {
    const existing = cart.find(item => item.id === product.id);
    if (existing) {
      if (existing.cartQuantity < product.availableQuantity) {
        setCart(cart.map(item => item.id === product.id ? { ...item, cartQuantity: item.cartQuantity + 1 } : item));
      }
    } else {
      setCart([...cart, { ...product, cartQuantity: 1 }]);
    }
  };

  const removeFromCart = (id: string) => {
    setCart(cart.filter(item => item.id !== id));
  };

  const handleReserve = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!guestName || cart.length === 0) return;
    
    setIsSubmitting(true);
    
    try {
      const res = await fetch("/api/reservations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: cart.map(item => ({ productId: item.id, quantity: item.cartQuantity })),
          guestName,
          whatsapp,
          message
        })
      });
      
      const data = await res.json();
      if (data.success) {
        setSuccess(true);
        setCart([]);
        setGuestName("");
        setWhatsapp("");
        setMessage("");
        fetchProducts(); // refresh quantities
      } else {
        alert(data.error);
      }
    } catch (err) {
      alert("Ocurrió un error. Intenta nuevamente.");
    }
    
    setIsSubmitting(false);
  };

  const renderProductCard = (product: Product) => {
    const cartItem = cart.find(i => i.id === product.id);
    const available = product.availableQuantity - (cartItem?.cartQuantity || 0);

    return (
      <div key={product.id} className="bg-white rounded-2xl shadow-sm p-5 border border-pink-100 flex flex-col h-full relative overflow-hidden">
        {product.priority === "Alta" || product.priority === "Muy alta" ? (
          <div className="absolute top-0 right-0 bg-pink-100 text-pink-700 text-xs font-semibold px-3 py-1 rounded-bl-xl">
            Lo necesitamos mucho ⭐
          </div>
        ) : null}
        
        <h3 className="font-bold text-lg text-gray-800 mt-2 mb-1">{product.name}</h3>
        <p className="text-sm text-gray-500 mb-2">{product.category}</p>
        <p className="text-sm text-gray-600 mb-4 flex-grow">{product.description}</p>
        
        <div className="flex justify-between items-end mt-auto">
          <div>
            {product.availableQuantity === 0 ? (
              <span className="text-gray-400 font-medium text-sm flex items-center">
                🔒 Reservado
              </span>
            ) : (
              <span className="text-pink-600 font-medium text-sm">
                {product.availableQuantity} disponible{product.availableQuantity > 1 ? 's' : ''}
              </span>
            )}
          </div>
          
          {product.availableQuantity > 0 && available > 0 ? (
            <button 
              onClick={() => addToCart(product)}
              className="bg-[#e4b5b8] hover:bg-[#d8a1a4] text-white px-4 py-2 rounded-full text-sm transition font-medium flex items-center gap-2"
            >
              <Gift size={16} /> Reservar
            </button>
          ) : product.availableQuantity > 0 && available === 0 ? (
             <span className="text-gray-400 font-medium text-sm">En carrito</span>
          ) : null}
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-8">
      {/* HEADER */}
      <header className="text-center mb-10 py-10 bg-white rounded-3xl shadow-sm border border-pink-50 relative overflow-hidden">
        <div className="absolute top-[-20px] left-[-20px] text-pink-100 opacity-50"><Heart size={120} /></div>
        <div className="absolute bottom-[-20px] right-[-20px] text-pink-100 opacity-50"><Heart size={120} /></div>
        <h1 className="text-4xl md:text-5xl font-serif text-[#d8a1a4] mb-4 z-10 relative">Nuestra bebé está en camino 🎀</h1>
        <p className="text-gray-600 max-w-lg mx-auto z-10 relative">
          Ayúdanos a preparar su llegada. Hemos preparado esta lista con cositas que necesitaremos.
        </p>
      </header>

      {/* NAVIGATION */}
      <div className="flex justify-center mb-8 bg-white p-2 rounded-full shadow-sm mx-auto max-w-fit border border-pink-100">
        <button onClick={() => setActiveTab('inicio')} className={`px-6 py-2 rounded-full transition font-medium text-sm ${activeTab === 'inicio' ? 'bg-[#e4b5b8] text-white' : 'text-gray-500 hover:bg-pink-50'}`}>Inicio</button>
        <button onClick={() => setActiveTab('lista')} className={`px-6 py-2 rounded-full transition font-medium text-sm ${activeTab === 'lista' ? 'bg-[#e4b5b8] text-white' : 'text-gray-500 hover:bg-pink-50'}`}>Lista de Regalos</button>
        <button onClick={() => setActiveTab('cart')} className={`px-6 py-2 rounded-full transition font-medium text-sm relative ${activeTab === 'cart' ? 'bg-[#e4b5b8] text-white' : 'text-gray-500 hover:bg-pink-50'}`}>
          Mis Regalos 🛒
          {cart.length > 0 && <span className="absolute top-0 right-1 w-2 h-2 bg-pink-500 rounded-full"></span>}
        </button>
        <button onClick={() => setActiveTab('info')} className={`px-6 py-2 rounded-full transition font-medium text-sm ${activeTab === 'info' ? 'bg-[#e4b5b8] text-white' : 'text-gray-500 hover:bg-pink-50'}`}>Información</button>
      </div>

      {/* CONTENT */}
      <main>
        {activeTab === 'inicio' && (
          <div className="text-center py-12 bg-white rounded-3xl border border-pink-100 p-8 shadow-sm">
            <h2 className="text-2xl font-serif text-[#d8a1a4] mb-4">¡Gracias por acompañarnos!</h2>
            <p className="text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
              Puedes elegir uno o varios regalos de la lista y reservarlos. 
              Esto nos ayudará muchísimo a organizarnos y evitar regalos repetidos. 💗<br/><br/>
              No es una tienda online, es simplemente un catálogo donde reservas lo que deseas regalar.
            </p>
            <button 
              onClick={() => setActiveTab('lista')}
              className="bg-[#e4b5b8] hover:bg-[#d8a1a4] text-white px-8 py-3 rounded-full font-medium transition text-lg shadow-sm"
            >
              Ver lista de regalos
            </button>
          </div>
        )}

        {activeTab === 'lista' && (
          <div>
            {/* Filters */}
            <div className="flex flex-wrap gap-2 mb-8 justify-center">
              {categories.map(cat => (
                <button 
                  key={cat} 
                  onClick={() => setCategoryFilter(cat)}
                  className={`px-4 py-1.5 rounded-full text-sm transition ${categoryFilter === cat ? 'bg-[#d8a1a4] text-white' : 'bg-white text-gray-600 border border-pink-100 hover:border-pink-300'}`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {loading ? (
              <div className="text-center py-12 text-pink-300">Cargando regalos...</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map(renderProductCard)}
              </div>
            )}
            
            <div className="mt-16 text-center bg-white p-8 rounded-3xl border border-pink-100 shadow-sm">
               <h3 className="text-xl font-serif text-[#d8a1a4] mb-2">¿Tienes otro regalo en mente? 💗</h3>
               <p className="text-gray-600">¡También será bienvenido! La lista es únicamente una guía para ayudarnos a organizar las cositas que nuestra bebé necesitará.</p>
            </div>
          </div>
        )}

        {activeTab === 'cart' && (
          <div className="bg-white rounded-3xl shadow-sm border border-pink-100 p-6 md:p-10">
            <h2 className="text-2xl font-serif text-[#d8a1a4] mb-6 flex items-center gap-2">
              <ShoppingCart /> Tus regalos seleccionados
            </h2>
            
            {success ? (
              <div className="text-center py-12">
                <div className="w-20 h-20 bg-green-100 text-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Heart size={40} />
                </div>
                <h3 className="text-2xl font-medium text-gray-800 mb-2">¡Gracias! 🎀</h3>
                <p className="text-gray-600">Tus regalos han sido reservados con éxito.</p>
                <button onClick={() => {setSuccess(false); setActiveTab('lista');}} className="mt-6 text-[#d8a1a4] underline font-medium">Volver a la lista</button>
              </div>
            ) : cart.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                Aún no has seleccionado ningún regalo.
                <br/>
                <button onClick={() => setActiveTab('lista')} className="mt-4 text-[#d8a1a4] underline font-medium">Ver lista de regalos</button>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 gap-10">
                {/* Cart Items */}
                <div>
                  <ul className="space-y-4 mb-6">
                    {cart.map(item => (
                      <li key={item.id} className="flex justify-between items-center p-4 border border-pink-50 rounded-xl bg-pink-50/30">
                        <div>
                          <p className="font-bold text-gray-800">{item.name}</p>
                          <p className="text-sm text-gray-500">Cantidad: {item.cartQuantity}</p>
                        </div>
                        <button onClick={() => removeFromCart(item.id)} className="text-gray-400 hover:text-red-500 transition p-2">
                          <Trash2 size={18} />
                        </button>
                      </li>
                    ))}
                  </ul>
                  <button onClick={() => setActiveTab('lista')} className="text-sm text-[#d8a1a4] font-medium">+ Agregar otro regalo</button>
                </div>
                
                {/* Form */}
                <div className="bg-pink-50/50 p-6 rounded-2xl border border-pink-100">
                  <h3 className="font-bold text-gray-800 mb-4">Confirma tu reserva</h3>
                  <form onSubmit={handleReserve} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Nombre completo *</label>
                      <input 
                        type="text" 
                        required
                        value={guestName}
                        onChange={(e) => setGuestName(e.target.value)}
                        className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-pink-300"
                        placeholder="Ej. Natalia Gómez"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">WhatsApp (opcional)</label>
                      <input 
                        type="tel" 
                        value={whatsapp}
                        onChange={(e) => setWhatsapp(e.target.value)}
                        className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-pink-300"
                        placeholder="Para confirmarte detalles"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Mensaje para los papás (opcional)</label>
                      <textarea 
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-pink-300"
                        rows={3}
                        placeholder="Un lindo mensaje para la bebé..."
                      ></textarea>
                    </div>
                    <button 
                      type="submit" 
                      disabled={isSubmitting}
                      className="w-full bg-[#e4b5b8] hover:bg-[#d8a1a4] text-white py-3 rounded-xl font-bold transition flex justify-center items-center gap-2"
                    >
                      {isSubmitting ? "Reservando..." : "Confirmar Reserva"}
                    </button>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'info' && (
          <div className="bg-white rounded-3xl shadow-sm border border-pink-100 p-8 md:p-12 text-center max-w-2xl mx-auto">
             <Heart size={40} className="mx-auto text-pink-200 mb-6" />
             <h2 className="text-3xl font-serif text-[#d8a1a4] mb-6">Información del Baby Shower</h2>
             
             <div className="space-y-6 text-gray-700 text-lg">
                <p>
                  <strong>Fecha:</strong> 17 de octubre
                </p>
                <p>
                  <strong>Hora de inicio:</strong> 3:00 pm
                </p>
                <p>
                  <strong>Dirección:</strong> Calle 185 #55-55
                </p>
                <p>
                  <strong>Salón:</strong> Conjunto residencial Villanova 3
                </p>
             </div>
             
             <div className="mt-10 pt-10 border-t border-pink-100 text-gray-500 italic">
                Será un gusto compartir contigo este momento tan especial. 
                Tu presencia lo hará aún más significativo y lleno de lindos recuerdos.
             </div>
          </div>
        )}
      </main>
    </div>
  );
}
