"use client";
import { useState, useEffect } from "react";
import { ShoppingCart, Trash2, MapPin, Calendar, CheckCircle2 } from "lucide-react";

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
      <div className="w-6 h-8 bg-[#e3d5ca] rounded-t-full border-2 border-[#c86b72] z-10 -mb-1"></div>
      <div className="w-12 h-6 bg-[#c86b72] rounded-full z-10 border-2 border-white -mb-2"></div>
      
      <div className="relative w-16 h-32 border-4 border-[#c86b72] rounded-3xl overflow-hidden bg-white shadow-inner">
        <div className="absolute top-4 left-0 w-3 h-0.5 bg-[#c86b72] opacity-50 z-20"></div>
        <div className="absolute top-10 left-0 w-4 h-0.5 bg-[#c86b72] opacity-50 z-20"></div>
        <div className="absolute top-16 left-0 w-3 h-0.5 bg-[#c86b72] opacity-50 z-20"></div>
        <div className="absolute top-22 left-0 w-4 h-0.5 bg-[#c86b72] opacity-50 z-20"></div>
        
        <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-[#ff9aa2] to-[#ffb3ba] animate-fill-bottle"></div>
      </div>
    </div>
    <p className="mt-8 text-[#c86b72] font-serif text-lg tracking-widest animate-pulse">CARGANDO...</p>
  </div>
);

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("inicio");
  const [categoryFilter, setCategoryFilter] = useState("Todos");
  
  const [guestName, setGuestName] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
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
          <div className="absolute top-0 right-0 bg-[#d3b3f2] text-[#6b3e80] text-xs font-bold px-4 py-1.5 rounded-bl-2xl">
            Lo necesitamos mucho
          </div>
        ) : null}
        
        <div className="flex-grow mt-4">
          <h3 className="font-serif font-bold text-xl text-[#c86b72] mb-1">{product.name}</h3>
          <span className="inline-block px-3 py-1 bg-[#fff8f5] text-[#c86b72] rounded-full text-xs font-medium mb-3 border border-[#ffe0e0]">
            {product.category}
          </span>
          <p className="text-sm text-gray-600 mb-4">{product.description}</p>
        </div>
        
        <div className="flex justify-between items-end mt-4 pt-4 border-t border-[#fff8f5]">
          <div>
            {product.availableQuantity === 0 ? (
              <span className="text-gray-400 font-medium text-sm flex items-center bg-gray-50 px-3 py-1 rounded-full">
                Reservado
              </span>
            ) : (
              <span className="text-[#c86b72] font-medium text-sm">
                {product.availableQuantity} disponible{product.availableQuantity > 1 ? 's' : ''}
              </span>
            )}
          </div>
          
          {product.availableQuantity > 0 && available > 0 ? (
            <button 
              onClick={() => addToCart(product)}
              className="bg-[#c86b72] hover:bg-[#b85860] text-white px-5 py-2.5 rounded-full text-sm transition font-medium flex items-center gap-2 shadow-sm hover:shadow-md"
            >
              Reservar
            </button>
          ) : product.availableQuantity > 0 && available === 0 ? (
             <span className="text-[#b85860] font-medium text-sm bg-pink-50 px-3 py-1 rounded-full">En carrito</span>
          ) : null}
        </div>
      </div>
    );
  };

  const handleTabClick = (e: React.MouseEvent, tab: string) => {
    setActiveTab(tab);
    // Spawn butterfly
    const el = document.createElement("div");
    el.className = "butterfly-particle";
    el.style.left = `${e.clientX - 16}px`;
    el.style.top = `${e.clientY - 16}px`;
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 1500);
  };

  if (loading) {
    return <BottleLoader />;
  }

  return (
    <div className="min-h-screen bg-white font-sans selection:bg-[#ff9aa2] selection:text-[#c86b72] overflow-x-hidden">
      
      {/* HEADER NAV */}
      <nav className="fixed top-0 w-full bg-white/90 backdrop-blur-md z-40 border-b border-[#ffe0e0] shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-3 md:py-4 flex flex-col md:flex-row justify-between items-center gap-3 md:gap-0">
          <span className="font-serif text-[#c86b72] font-bold text-2xl tracking-wide flex-shrink-0">Baby Shower</span>
          <div className="flex gap-2 sm:gap-4 justify-center w-full md:w-auto">
            <button onClick={(e) => handleTabClick(e, 'inicio')} className={`px-4 sm:px-5 py-2 rounded-full transition font-medium text-xs sm:text-sm whitespace-nowrap ${activeTab === 'inicio' ? 'bg-[#c86b72] text-white' : 'text-gray-500 hover:bg-[#fff8f5]'}`}>Inicio</button>
            <button onClick={(e) => handleTabClick(e, 'lista')} className={`px-4 sm:px-5 py-2 rounded-full transition font-medium text-xs sm:text-sm whitespace-nowrap ${activeTab === 'lista' ? 'bg-[#c86b72] text-white' : 'text-gray-500 hover:bg-[#fff8f5]'}`}>Regalos</button>
            <button onClick={(e) => handleTabClick(e, 'cart')} className={`px-4 sm:px-5 py-2 rounded-full transition font-medium text-xs sm:text-sm whitespace-nowrap relative flex items-center gap-2 ${activeTab === 'cart' ? 'bg-[#c86b72] text-white' : 'text-gray-500 hover:bg-[#fff8f5]'}`}>
              Carrito <ShoppingCart size={14} className="sm:w-4 sm:h-4" />
              {cart.length > 0 && <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#ff9aa2] text-white text-[10px] flex items-center justify-center font-bold border-2 border-white rounded-full">{cart.length}</span>}
            </button>
          </div>
        </div>
      </nav>

      {/* TABS CONTENT */}
      <main className="pt-32 md:pt-24 pb-0">
        
        {/* INICIO TAB */}
        {activeTab === 'inicio' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
            
            {/* HERO SECTION */}
            <div className="max-w-7xl mx-auto px-4 pt-12 pb-8 text-center relative">
              <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-gradient-to-tr from-[#ffe0e0] to-[#fce8d5] rounded-full blur-3xl opacity-30 -z-10 animate-float"></div>

              <h3 className="text-[#c86b72] font-medium tracking-[0.2em] uppercase text-sm mb-4 animate-fade-in-up">TE INVITAMOS A CELEBRAR</h3>
              <h1 className="text-5xl md:text-7xl font-serif text-[#c86b72] mb-6 leading-tight animate-fade-in-up animation-delay-100">
                Una nueva historia <br/>está por comenzar...
              </h1>
              <p className="text-gray-600 max-w-2xl mx-auto text-lg md:text-xl leading-relaxed mb-12 animate-fade-in-up animation-delay-200">
                Con mucha ilusión esperamos la llegada de nuestra pequeña y queremos compartir este momento tan especial con las personas que queremos.
              </p>
              
              <div className="relative animate-fade-in-up animation-delay-300 w-full flex justify-center mb-6 md:mb-12">
                <img 
                  src="/parents.png" 
                  alt="Padres y Bebé" 
                  className="w-full max-w-[1200px] mx-auto hover:scale-105 transition-transform duration-1000 ease-out" 
                  style={{ 
                    filter: 'contrast(1.02)',
                    clipPath: 'inset(0 0 5% 0)',
                    WebkitMaskImage: 'radial-gradient(ellipse 90% 70% at 50% 50%, black 40%, transparent 100%)',
                    maskImage: 'radial-gradient(ellipse 90% 70% at 50% 50%, black 40%, transparent 100%)'
                  }}
                />
              </div>

              <div className="animate-fade-in-up animation-delay-400">
                <button 
                  onClick={(e) => handleTabClick(e, 'lista')}
                  className="bg-[#c86b72] hover:bg-[#b85860] text-white px-12 py-5 rounded-full font-bold transition text-xl shadow-xl hover:shadow-2xl hover:-translate-y-2 transform duration-300 mb-20 relative overflow-hidden group"
                >
                  <span className="relative z-10">Ver Lista de Regalos</span>
                  <div className="absolute inset-0 h-full w-full bg-white/20 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300"></div>
                </button>
              </div>
            </div>

            {/* INFO SECTION (50/50 SPLIT) */}
            <div className="flex flex-col md:flex-row w-full mt-10">
              <div className="w-full md:w-1/2 bg-[#fff8f5] py-24 px-8 flex flex-col items-center justify-center text-center">
                <div className="w-16 h-16 rounded-full bg-[#fce8d5] flex items-center justify-center mb-6 text-[#c86b72]">
                   <CheckCircle2 size={32} className="opacity-50" />
                </div>
                <h2 className="text-5xl font-serif text-[#5d4a46] mb-4">¿Cuándo?</h2>
                <p className="text-[#8c746e] text-lg tracking-wide">
                  17 de octubre<br/>a las 3:00 pm
                </p>
              </div>
              
              <div className="w-full md:w-1/2 bg-[#fce8d5] py-24 px-8 flex flex-col items-center justify-center text-center">
                <div className="w-16 h-16 rounded-full bg-white/50 flex items-center justify-center mb-6 text-[#c86b72]">
                   <MapPin size={32} className="opacity-50" />
                </div>
                <h2 className="text-5xl font-serif text-[#5d4a46] mb-4">¿Dónde?</h2>
                <p className="text-[#8c746e] text-lg tracking-wide">
                  Calle 185 #55-55<br/>Salón conjunto Villanova 3
                </p>
              </div>
            </div>
          </div>
        )}

        {/* LISTA DE REGALOS TAB */}
        {activeTab === 'lista' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
            
            {/* HEADER REGALOS CON IMAGEN */}
            <div className="max-w-7xl mx-auto px-4 mb-12 text-center relative">
              <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-gradient-to-tr from-[#ffe0e0] to-[#fce8d5] rounded-full blur-3xl opacity-40 -z-10 animate-float"></div>
              
              <div className="relative animate-fade-in-up w-full flex justify-center mb-6">
                <img 
                  src="/toys.png" 
                  alt="Juguetes y regalos" 
                  className="w-full max-w-4xl mx-auto hover:scale-105 transition-transform duration-1000 ease-out"
                  style={{ 
                    filter: 'contrast(1.05)',
                    clipPath: 'inset(0 0 5% 0)',
                    WebkitMaskImage: 'radial-gradient(ellipse 90% 70% at 50% 50%, black 50%, transparent 100%)',
                    maskImage: 'radial-gradient(ellipse 90% 70% at 50% 50%, black 50%, transparent 100%)'
                  }}
                />
              </div>

              <h2 className="text-4xl md:text-5xl font-serif text-[#c86b72] mb-4 animate-fade-in-up animation-delay-100">Mesa de Regalos</h2>
              <p className="text-gray-500 max-w-xl mx-auto text-lg animate-fade-in-up animation-delay-200">Selecciona los detallitos con los que te gustaría consentir a nuestra bebé.</p>
            </div>

            <div className="max-w-6xl mx-auto px-6">
              {/* Filters */}
              <div className="flex flex-wrap gap-3 mb-12 justify-center">
                {categories.map(cat => (
                  <button 
                    key={cat} 
                    onClick={() => setCategoryFilter(cat)}
                    className={`px-6 py-2.5 rounded-full text-sm font-medium transition ${categoryFilter === cat ? 'bg-[#c86b72] text-white shadow-md' : 'bg-white text-gray-600 border border-[#ffe0e0] hover:border-[#c86b72] hover:text-[#c86b72]'}`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              <div 
                key={categoryFilter} 
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-in fade-in zoom-in-95 duration-500"
              >
                {filteredProducts.map(renderProductCard)}
              </div>
            </div>
          </div>
        )}

        {/* CART TAB */}
        {activeTab === 'cart' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 min-h-screen bg-[#fff8f5] py-16 px-4 md:px-8">
            <div className="max-w-4xl mx-auto">
              <div className="bg-white rounded-[3rem] shadow-sm border border-[#ffe0e0] p-8 md:p-14">
                <h2 className="text-3xl font-serif text-[#c86b72] mb-10 flex items-center justify-center gap-3">
                  <ShoppingCart className="text-[#c86b72]" size={32} /> Tus regalos seleccionados
                </h2>
                
                {success ? (
                  <div className="text-center py-12">
                    <div className="w-24 h-24 bg-[#fff8f5] text-[#c86b72] rounded-full flex items-center justify-center mx-auto mb-6 border-4 border-[#ffe0e0]">
                      <CheckCircle2 size={48} />
                    </div>
                    <h3 className="text-3xl font-serif text-[#c86b72] mb-4">¡Gracias por tu regalo!</h3>
                    <p className="text-gray-600 text-lg mb-8">Tus regalos han sido reservados con éxito para nuestra bebé.</p>
                    <button onClick={() => {setSuccess(false); setActiveTab('lista');}} className="bg-[#fff8f5] text-[#c86b72] border border-[#c86b72] px-8 py-3 rounded-full font-medium hover:bg-[#c86b72] hover:text-white transition">Volver a la lista</button>
                  </div>
                ) : cart.length === 0 ? (
                  <div className="text-center py-16 text-gray-500">
                    <div className="w-24 h-24 bg-[#fff8f5] rounded-full flex items-center justify-center mx-auto mb-6 text-[#c86b72] opacity-50">
                      <ShoppingCart size={40} />
                    </div>
                    <p className="text-xl mb-8">Aún no has seleccionado ningún regalo.</p>
                    <button onClick={() => setActiveTab('lista')} className="bg-[#c86b72] text-white px-10 py-4 rounded-full font-bold shadow-md hover:shadow-lg transition">Ir a la lista de regalos</button>
                  </div>
                ) : (
                  <div className="grid lg:grid-cols-2 gap-12">
                    {/* Cart Items */}
                    <div className="bg-[#fff8f5] p-8 rounded-3xl border border-[#ffe0e0]">
                      <ul className="space-y-4">
                        {cart.map(item => (
                          <li key={item.id} className="flex justify-between items-center p-5 bg-white rounded-2xl shadow-sm">
                            <div>
                              <p className="font-bold text-[#c86b72] text-lg">{item.name}</p>
                              <p className="text-sm text-gray-500 mt-1">Cantidad: {item.cartQuantity}</p>
                            </div>
                            <button onClick={() => removeFromCart(item.id)} className="text-[#c86b72] hover:text-red-500 hover:bg-red-50 transition p-3 rounded-full" title="Eliminar">
                              <Trash2 size={20} />
                            </button>
                          </li>
                        ))}
                      </ul>
                      <div className="mt-8 text-center">
                        <button onClick={() => setActiveTab('lista')} className="text-sm text-[#c86b72] font-medium hover:underline">+ Agregar otro regalo</button>
                      </div>
                    </div>
                    
                    {/* Form */}
                    <div>
                      <h3 className="font-serif text-2xl text-[#5d4a46] mb-8 text-center">Confirma tu reserva</h3>
                      <form onSubmit={handleReserve} className="space-y-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Tu nombre completo *</label>
                          <input 
                            type="text" 
                            required
                            value={guestName}
                            onChange={(e) => setGuestName(e.target.value)}
                            className="w-full px-5 py-4 rounded-2xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#c86b72] bg-gray-50 focus:bg-white transition"
                            placeholder="Ej. Natalia Gómez"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">WhatsApp (opcional)</label>
                          <input 
                            type="tel" 
                            value={whatsapp}
                            onChange={(e) => setWhatsapp(e.target.value)}
                            className="w-full px-5 py-4 rounded-2xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#c86b72] bg-gray-50 focus:bg-white transition"
                            placeholder="Para confirmarte detalles"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Mensaje para la bebé (opcional)</label>
                          <textarea 
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            className="w-full px-5 py-4 rounded-2xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#c86b72] bg-gray-50 focus:bg-white transition resize-none"
                            rows={3}
                            placeholder="Escribe unas lindas palabras..."
                          ></textarea>
                        </div>
                        <button 
                          type="submit" 
                          disabled={isSubmitting}
                          className="w-full bg-[#c86b72] hover:bg-[#b85860] text-white py-5 rounded-full font-bold text-lg transition shadow-md hover:shadow-lg flex justify-center items-center gap-2 mt-6"
                        >
                          {isSubmitting ? "Procesando..." : "Confirmar Reserva"}
                        </button>
                      </form>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
