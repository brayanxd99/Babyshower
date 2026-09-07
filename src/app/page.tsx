"use client";
import { useState, useEffect } from "react";
import { Heart, Gift, ShoppingCart, Trash2, Calendar, MapPin, Clock } from "lucide-react";

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

const BottleLoader = () => (
  <div className="fixed inset-0 bg-[#fff8f5] z-50 flex flex-col items-center justify-center">
    <div className="relative flex flex-col items-center">
      {/* Nipple */}
      <div className="w-6 h-8 bg-[#e3d5ca] rounded-t-full border-2 border-[#d8a1a4] z-10 -mb-1"></div>
      <div className="w-12 h-6 bg-[#d8a1a4] rounded-full z-10 border-2 border-white -mb-2"></div>
      
      {/* Bottle Body */}
      <div className="relative w-16 h-32 border-4 border-[#d8a1a4] rounded-3xl overflow-hidden bg-white shadow-inner">
        {/* Measurement marks */}
        <div className="absolute top-4 left-0 w-3 h-0.5 bg-[#d8a1a4] opacity-50 z-20"></div>
        <div className="absolute top-10 left-0 w-4 h-0.5 bg-[#d8a1a4] opacity-50 z-20"></div>
        <div className="absolute top-16 left-0 w-3 h-0.5 bg-[#d8a1a4] opacity-50 z-20"></div>
        <div className="absolute top-22 left-0 w-4 h-0.5 bg-[#d8a1a4] opacity-50 z-20"></div>
        
        {/* Liquid */}
        <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-[#ffd1d1] to-[#ffebeb] animate-fill-bottle"></div>
      </div>
    </div>
    <p className="mt-8 text-[#d8a1a4] font-serif text-lg tracking-widest animate-pulse">CARGANDO...</p>
  </div>
);

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
    // Simulate loading for the bottle animation
    setTimeout(() => {
      fetchProducts();
    }, 1500);
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await fetch("/api/products");
      const data = await res.json();
      if (Array.isArray(data)) {
         setProducts(data);
      }
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
        fetchProducts();
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
      <div key={product.id} className="bg-white rounded-3xl shadow-sm p-6 border border-[#ffe0e0] flex flex-col h-full relative overflow-hidden transition hover:shadow-md">
        {product.priority === "Alta" || product.priority === "Muy alta" ? (
          <div className="absolute top-0 right-0 bg-[#e6d1f2] text-[#86599b] text-xs font-bold px-4 py-1.5 rounded-bl-2xl">
            Lo necesitamos mucho ⭐
          </div>
        ) : null}
        
        <div className="flex-grow mt-4">
          <h3 className="font-serif font-bold text-xl text-[#b77b7f] mb-1">{product.name}</h3>
          <span className="inline-block px-3 py-1 bg-[#fff8f5] text-[#d8a1a4] rounded-full text-xs font-medium mb-3 border border-[#ffe0e0]">
            {product.category}
          </span>
          <p className="text-sm text-gray-600 mb-4">{product.description}</p>
        </div>
        
        <div className="flex justify-between items-end mt-4 pt-4 border-t border-[#fff8f5]">
          <div>
            {product.availableQuantity === 0 ? (
              <span className="text-gray-400 font-medium text-sm flex items-center bg-gray-50 px-3 py-1 rounded-full">
                🔒 Reservado
              </span>
            ) : (
              <span className="text-[#d8a1a4] font-medium text-sm">
                {product.availableQuantity} disponible{product.availableQuantity > 1 ? 's' : ''}
              </span>
            )}
          </div>
          
          {product.availableQuantity > 0 && available > 0 ? (
            <button 
              onClick={() => addToCart(product)}
              className="bg-[#d8a1a4] hover:bg-[#c98a8e] text-white px-5 py-2.5 rounded-full text-sm transition font-medium flex items-center gap-2 shadow-sm hover:shadow-md"
            >
              <Gift size={16} /> Reservar
            </button>
          ) : product.availableQuantity > 0 && available === 0 ? (
             <span className="text-[#c98a8e] font-medium text-sm bg-pink-50 px-3 py-1 rounded-full">En carrito</span>
          ) : null}
        </div>
      </div>
    );
  };

  if (loading) {
    return <BottleLoader />;
  }

  return (
    <div className="min-h-screen bg-[#fff8f5] font-sans selection:bg-[#ffd1d1] selection:text-[#d8a1a4]">
      
      {/* MAIN NAVIGATION */}
      <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-md z-40 border-b border-[#ffe0e0] shadow-sm">
        <div className="max-w-5xl mx-auto px-4 py-3 flex justify-between items-center overflow-x-auto no-scrollbar">
          <span className="font-serif text-[#d8a1a4] font-bold text-xl tracking-wide flex-shrink-0 mr-6">Baby Shower 🎀</span>
          <div className="flex gap-2">
            <button onClick={() => setActiveTab('inicio')} className={`px-4 py-2 rounded-full transition font-medium text-sm whitespace-nowrap ${activeTab === 'inicio' ? 'bg-[#d8a1a4] text-white' : 'text-gray-500 hover:bg-[#fff8f5]'}`}>Inicio</button>
            <button onClick={() => setActiveTab('lista')} className={`px-4 py-2 rounded-full transition font-medium text-sm whitespace-nowrap ${activeTab === 'lista' ? 'bg-[#d8a1a4] text-white' : 'text-gray-500 hover:bg-[#fff8f5]'}`}>Regalos</button>
            <button onClick={() => setActiveTab('cart')} className={`px-4 py-2 rounded-full transition font-medium text-sm whitespace-nowrap relative ${activeTab === 'cart' ? 'bg-[#d8a1a4] text-white' : 'text-gray-500 hover:bg-[#fff8f5]'}`}>
              Carrito 🛒
              {cart.length > 0 && <span className="absolute top-0 right-0 w-3 h-3 bg-red-400 border-2 border-white rounded-full"></span>}
            </button>
          </div>
        </div>
      </nav>

      <div className="pt-24 pb-12 px-4 md:px-8 max-w-5xl mx-auto">
        
        {/* INICIO TAB (Hero + Event Details) */}
        {activeTab === 'inicio' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* HERO SECTION */}
            <div className="bg-white rounded-[3rem] shadow-sm border border-[#ffe0e0] p-10 md:p-20 text-center relative overflow-hidden mb-8">
              {/* Decorative elements */}
              <div className="absolute top-10 left-10 text-[#ffd1d1] opacity-50 animate-float" style={{ animationDelay: '0s' }}><Heart size={40} /></div>
              <div className="absolute bottom-20 right-10 text-[#e6d1f2] opacity-50 animate-float" style={{ animationDelay: '1.5s' }}><Heart size={60} /></div>
              <div className="absolute top-20 right-20 text-[#e3d5ca] opacity-50 animate-float" style={{ animationDelay: '0.7s' }}><Heart size={30} /></div>
              
              <h3 className="text-[#c98a8e] font-medium tracking-[0.3em] uppercase text-sm mb-6">Te invitamos a celebrar</h3>
              <h1 className="text-5xl md:text-7xl font-serif text-[#d8a1a4] mb-6 leading-tight">
                Una nueva historia <br/>está por comenzar...
              </h1>
              <p className="text-gray-600 max-w-xl mx-auto text-lg leading-relaxed mb-10">
                Con mucha ilusión esperamos la llegada de nuestra pequeña y queremos compartir este momento tan especial con las personas que queremos.
              </p>
              
              <button 
                onClick={() => setActiveTab('lista')}
                className="bg-[#d8a1a4] hover:bg-[#c98a8e] text-white px-8 py-4 rounded-full font-bold transition text-lg shadow-lg hover:shadow-xl hover:-translate-y-1 transform duration-200"
              >
                Ver Lista de Regalos 🎁
              </button>
            </div>

            {/* EVENT DETAILS */}
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-white p-8 rounded-3xl border border-[#ffe0e0] flex flex-col items-center text-center shadow-sm">
                <div className="w-16 h-16 bg-[#fff8f5] rounded-full flex items-center justify-center mb-4 text-[#d8a1a4]">
                  <Calendar size={28} />
                </div>
                <h3 className="font-serif font-bold text-xl text-gray-800 mb-2">Cuándo</h3>
                <p className="text-gray-600">17 de octubre</p>
              </div>
              
              <div className="bg-white p-8 rounded-3xl border border-[#ffe0e0] flex flex-col items-center text-center shadow-sm">
                <div className="w-16 h-16 bg-[#fff8f5] rounded-full flex items-center justify-center mb-4 text-[#d8a1a4]">
                  <Clock size={28} />
                </div>
                <h3 className="font-serif font-bold text-xl text-gray-800 mb-2">A qué hora</h3>
                <p className="text-gray-600">3:00 pm</p>
              </div>

              <div className="bg-white p-8 rounded-3xl border border-[#ffe0e0] flex flex-col items-center text-center shadow-sm">
                <div className="w-16 h-16 bg-[#fff8f5] rounded-full flex items-center justify-center mb-4 text-[#d8a1a4]">
                  <MapPin size={28} />
                </div>
                <h3 className="font-serif font-bold text-xl text-gray-800 mb-2">Dónde</h3>
                <p className="text-gray-600">Calle 185 #55-55<br/>Salón conjunto Villanova 3</p>
              </div>
            </div>
            
            <div className="mt-12 text-center text-gray-500 italic font-serif text-lg">
              Será un gusto compartir contigo este momento tan especial.<br/>Tu presencia lo hará aún más significativo y lleno de lindos recuerdos.
            </div>
          </div>
        )}

        {/* LISTA TAB */}
        {activeTab === 'lista' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="text-center mb-10">
              <h2 className="text-4xl font-serif text-[#d8a1a4] mb-4">Mesa de Regalos</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Elige el regalo que quieras compartir con nuestra bebé y resérvalo para ayudarnos a evitar regalos repetidos.
              </p>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-3 mb-10 justify-center">
              {categories.map(cat => (
                <button 
                  key={cat} 
                  onClick={() => setCategoryFilter(cat)}
                  className={`px-5 py-2 rounded-full text-sm font-medium transition ${categoryFilter === cat ? 'bg-[#d8a1a4] text-white shadow-md' : 'bg-white text-gray-600 border border-[#ffe0e0] hover:border-[#d8a1a4] hover:text-[#d8a1a4]'}`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map(renderProductCard)}
            </div>
            
            <div className="mt-16 text-center bg-white p-10 rounded-[3rem] border border-[#ffe0e0] shadow-sm relative overflow-hidden">
               <div className="absolute -left-6 -top-6 text-[#ffd1d1] opacity-30"><Heart size={100} /></div>
               <h3 className="text-2xl font-serif text-[#d8a1a4] mb-3 relative z-10">¿Tienes otro regalo en mente? 💗</h3>
               <p className="text-gray-600 relative z-10">¡También será bienvenido! La lista es únicamente una guía para ayudarnos a organizar las cositas que nuestra bebé necesitará.</p>
            </div>
          </div>
        )}

        {/* CART TAB */}
        {activeTab === 'cart' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-3xl mx-auto">
            <div className="bg-white rounded-[2.5rem] shadow-sm border border-[#ffe0e0] p-8 md:p-12">
              <h2 className="text-3xl font-serif text-[#d8a1a4] mb-8 flex items-center justify-center gap-3">
                <ShoppingCart className="text-[#e6d1f2]" /> Tus regalos seleccionados
              </h2>
              
              {success ? (
                <div className="text-center py-12">
                  <div className="w-24 h-24 bg-[#fff8f5] text-[#d8a1a4] rounded-full flex items-center justify-center mx-auto mb-6 border-4 border-[#ffe0e0]">
                    <Heart size={48} fill="currentColor" />
                  </div>
                  <h3 className="text-3xl font-serif text-[#d8a1a4] mb-3">¡Gracias por tu regalo! 🎀</h3>
                  <p className="text-gray-600 text-lg">Tus regalos han sido reservados con éxito para nuestra bebé.</p>
                  <button onClick={() => {setSuccess(false); setActiveTab('lista');}} className="mt-8 bg-[#fff8f5] text-[#d8a1a4] border border-[#d8a1a4] px-6 py-2 rounded-full font-medium hover:bg-[#d8a1a4] hover:text-white transition">Volver a la lista</button>
                </div>
              ) : cart.length === 0 ? (
                <div className="text-center py-16 text-gray-500">
                  <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-300">
                    <Gift size={40} />
                  </div>
                  <p className="text-lg">Aún no has seleccionado ningún regalo.</p>
                  <button onClick={() => setActiveTab('lista')} className="mt-6 bg-[#d8a1a4] text-white px-8 py-3 rounded-full font-medium shadow-sm hover:shadow-md transition">Ir a la lista de regalos</button>
                </div>
              ) : (
                <div className="space-y-8">
                  {/* Cart Items */}
                  <div className="bg-[#fff8f5] p-6 rounded-3xl border border-[#ffe0e0]">
                    <ul className="space-y-4">
                      {cart.map(item => (
                        <li key={item.id} className="flex justify-between items-center p-4 bg-white rounded-2xl shadow-sm">
                          <div>
                            <p className="font-bold text-[#b77b7f] text-lg">{item.name}</p>
                            <p className="text-sm text-gray-500 bg-gray-50 inline-block px-2 py-0.5 rounded-md mt-1">Cantidad: {item.cartQuantity}</p>
                          </div>
                          <button onClick={() => removeFromCart(item.id)} className="text-[#d8a1a4] hover:text-red-500 hover:bg-red-50 transition p-3 rounded-full" title="Eliminar">
                            <Trash2 size={20} />
                          </button>
                        </li>
                      ))}
                    </ul>
                    <div className="mt-6 text-center">
                      <button onClick={() => setActiveTab('lista')} className="text-sm text-[#d8a1a4] font-medium border-b border-[#d8a1a4] pb-0.5 hover:text-[#b77b7f]">+ Agregar otro regalo</button>
                    </div>
                  </div>
                  
                  {/* Form */}
                  <div>
                    <h3 className="font-serif text-xl text-gray-800 mb-6 text-center">Confirma tu reserva</h3>
                    <form onSubmit={handleReserve} className="space-y-5">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Tu nombre completo *</label>
                        <input 
                          type="text" 
                          required
                          value={guestName}
                          onChange={(e) => setGuestName(e.target.value)}
                          className="w-full px-5 py-3 rounded-2xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#d8a1a4] bg-gray-50 focus:bg-white transition"
                          placeholder="Ej. Natalia Gómez"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">WhatsApp (opcional)</label>
                        <input 
                          type="tel" 
                          value={whatsapp}
                          onChange={(e) => setWhatsapp(e.target.value)}
                          className="w-full px-5 py-3 rounded-2xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#d8a1a4] bg-gray-50 focus:bg-white transition"
                          placeholder="Para confirmarte detalles"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Mensaje para la bebé (opcional)</label>
                        <textarea 
                          value={message}
                          onChange={(e) => setMessage(e.target.value)}
                          className="w-full px-5 py-3 rounded-2xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#d8a1a4] bg-gray-50 focus:bg-white transition resize-none"
                          rows={3}
                          placeholder="Escribe unas lindas palabras..."
                        ></textarea>
                      </div>
                      <button 
                        type="submit" 
                        disabled={isSubmitting}
                        className="w-full bg-[#d8a1a4] hover:bg-[#c98a8e] text-white py-4 rounded-full font-bold text-lg transition shadow-md hover:shadow-lg flex justify-center items-center gap-2 mt-4"
                      >
                        {isSubmitting ? "Procesando..." : "Confirmar Reserva"}
                      </button>
                    </form>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
