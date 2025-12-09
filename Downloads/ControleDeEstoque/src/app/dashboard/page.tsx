'use client';

import { useState, useEffect, useMemo } from "react";
import {
  Button,
  Spinner,
  Tab,
  Tabs,
  Input,
  Chip
} from "@heroui/react";
import ProductCard from "@/components/ProductCard";
import ProductModal from "@/components/ProductModal";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Product } from "@/types/product";

// Ícones
import { FiPlus, FiSearch, FiPackage, FiAlertTriangle, FiDollarSign, FiFilter } from 'react-icons/fi';

export default function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentCategory, setCurrentCategory] = useState<string>("todos");
  const [currentLocation, setCurrentLocation] = useState("Depósito Central"); 

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    } else if (status === "authenticated") {
      const params = new URLSearchParams(window.location.search);
      const locationFromUrl = params.get('workspace') || "Depósito Central";
      setCurrentLocation(locationFromUrl);
      fetchProducts(locationFromUrl);
    }
  }, [status, router]);

  // --- CRUD Operations ---

  const fetchProducts = async (location: string) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/products?location=${encodeURIComponent(location)}`); 
      
      if(res.ok) {
        const data = await res.json();
        const sorted = Array.isArray(data) ? data.reverse() : [];
        setProducts(sorted);
      }
    } catch (error) {
      console.error("Erro ao buscar produtos:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (product: Product) => {
    setLoading(true);
    try {
      const isEditing = !!product._id;
      const url = isEditing ? `/api/products/${product._id}` : "/api/products"; 
      const method = isEditing ? "PUT" : "POST";
      
      const productWithLocation = { ...product, location: currentLocation };

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(productWithLocation),
      });

      if (res.ok) {
        await fetchProducts(currentLocation); 
        setIsModalOpen(false);
      } else {
        alert("Erro ao salvar. Verifique os dados.");
      }
    } catch (error) {
      console.error("Erro ao salvar:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Tem certeza que deseja remover este item do estoque?")) return;

    try {
      const res = await fetch(`/api/products/${id}`, { method: "DELETE" }); 
      if (res.ok) {
        setProducts(prev => prev.filter(p => p._id !== id));
        setIsModalOpen(false); 
      }
    } catch (error) {
      console.error("Erro ao excluir:", error);
    }
  };

  // --- Estatísticas em Tempo Real (O "Cérebro" do Dashboard) ---
  
  const stats = useMemo(() => {
    const totalItems = products.length;
    // Calcula valor total (Preço * Quantidade de cada item)
    const totalValue = products.reduce((acc, p) => acc + (p.price * p.quantity), 0);
    // Conta itens com menos de 5 unidades
    const lowStock = products.filter(p => p.quantity < 5).length;

    return { totalItems, totalValue, lowStock };
  }, [products]);

  // --- Lógica de Filtro ---
  
  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = currentCategory === "todos" || p.category === currentCategory;
      return matchesSearch && matchesCategory;
    });
  }, [products, searchQuery, currentCategory]);

  const categories = [
    { key: "todos", title: "Visão Geral" },
    { key: "eletronicos", title: "Eletrônicos" },
    { key: "perifericos", title: "Periféricos" },
    { key: "escritorio", title: "Escritório" },
    { key: "hardware", title: "Hardware" },
    { key: "outros", title: "Outros" },
  ];

  // --- UI Handlers ---

  const openCreateModal = () => {
    setSelectedProduct(null);
    setIsModalOpen(true);
  };

  const openEditModal = (product: Product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  // Carregamento inicial
  if (status === "loading" || (loading && !products.length && status === 'authenticated')) return (
    <div className="flex justify-center items-center h-screen bg-slate-950">
      <Spinner size="lg" color="white" />
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-950 p-4 md:p-8 font-sans text-slate-100 pb-20">
      
      {/* 1. Header e Estatísticas */}
      <div className="max-w-7xl mx-auto mb-10">
        
        {/* Cabeçalho */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4 border-b border-slate-800 pb-6">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-white flex items-center gap-3">
              <FiPackage className="text-indigo-500" /> Controle de Estoque
            </h1>
            <p className="text-slate-400 text-sm mt-1 ml-1">
              Gerenciando o estoque: <Chip size="sm" className="bg-slate-800 text-indigo-400 font-bold border border-indigo-500/20">{currentLocation}</Chip>
            </p>
          </div>
          
          <div className="flex gap-3">
             <div className="hidden md:flex items-center gap-2 px-3 py-1 bg-slate-900 rounded-full border border-slate-800 text-xs text-slate-400">
               <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
               Sistema Online
             </div>
             <Button 
              onPress={openCreateModal}
              className="bg-indigo-600 text-white font-bold shadow-lg shadow-indigo-500/20 hover:bg-indigo-500 transition-all"
              startContent={<FiPlus size={20} />}
             >
              Adicionar Item
             </Button>
          </div>
        </header>

        {/* Cards de KPIs (Indicadores) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-10">
          {/* Card 1: Valor Financeiro */}
          <div className="bg-slate-900/80 backdrop-blur-md border border-slate-800 p-6 rounded-2xl flex items-center justify-between shadow-xl hover:border-indigo-500/30 transition-colors group">
            <div>
              <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-1 group-hover:text-indigo-400">Patrimônio Total</p>
              <h3 className="text-3xl font-bold text-white tracking-tight">
                {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(stats.totalValue)}
              </h3>
            </div>
            <div className="p-4 bg-emerald-500/10 rounded-2xl text-emerald-400 group-hover:bg-emerald-500/20 transition-colors">
              <FiDollarSign size={28} />
            </div>
          </div>

          {/* Card 2: Total de Itens */}
          <div className="bg-slate-900/80 backdrop-blur-md border border-slate-800 p-6 rounded-2xl flex items-center justify-between shadow-xl hover:border-indigo-500/30 transition-colors group">
            <div>
              <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-1 group-hover:text-indigo-400">Itens Cadastrados</p>
              <h3 className="text-3xl font-bold text-white tracking-tight">
                {stats.totalItems} <span className="text-sm text-slate-600 font-normal">sku's</span>
              </h3>
            </div>
            <div className="p-4 bg-blue-500/10 rounded-2xl text-blue-400 group-hover:bg-blue-500/20 transition-colors">
              <FiPackage size={28} />
            </div>
          </div>

          {/* Card 3: Alertas */}
          <div className="bg-slate-900/80 backdrop-blur-md border border-slate-800 p-6 rounded-2xl flex items-center justify-between shadow-xl hover:border-red-500/30 transition-colors group">
            <div>
              <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-1 group-hover:text-red-400">Atenção Necessária</p>
              <h3 className="text-3xl font-bold text-white tracking-tight">
                {stats.lowStock} <span className="text-sm text-slate-600 font-normal">estoque baixo</span>
              </h3>
            </div>
            <div className={`p-4 rounded-2xl transition-colors ${stats.lowStock > 0 ? 'bg-red-500/10 text-red-500 animate-pulse' : 'bg-slate-800 text-slate-600'}`}>
              <FiAlertTriangle size={28} />
            </div>
          </div>
        </div>

        {/* 2. Barra de Ferramentas (Filtros e Busca) */}
        <div className="flex flex-col xl:flex-row gap-6 justify-between items-start xl:items-center mb-8 bg-slate-900/40 p-2 rounded-2xl border border-slate-800/50">
            {/* Tabs de Categoria */}
            <div className="w-full xl:w-auto overflow-x-auto pb-2 xl:pb-0 scrollbar-hide">
             <Tabs 
              aria-label="Categorias" 
              variant="light"
              selectedKey={currentCategory}
              onSelectionChange={(key) => setCurrentCategory(key as string)}
              classNames={{
                tabList: "gap-2",
                cursor: "w-full bg-indigo-600 rounded-full shadow-lg shadow-indigo-500/20",
                tab: "h-9 px-4 text-slate-400 data-[selected=true]:text-white font-medium hover:text-slate-200",
              }}
             >
               {categories.map((cat) => (
                 <Tab key={cat.key} title={cat.title} />
               ))}
             </Tabs>
            </div>

          {/* Campo de Busca */}
          <div className="w-full xl:w-auto px-2 xl:px-0">
            <Input
              className="w-full xl:w-80"
              placeholder="Buscar por nome..."
              startContent={<FiSearch className="text-slate-500" />}
              value={searchQuery}
              onValueChange={setSearchQuery}
              variant="flat"
              radius="lg"
              classNames={{
                inputWrapper: "bg-slate-900 border border-slate-800 hover:border-slate-600 focus-within:!border-indigo-500 text-slate-200 h-10 transition-colors",
                input: "placeholder:text-slate-600 font-medium"
              }}
            />
          </div>
        </div>

        {/* 3. Grid de Produtos */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-fade-in">
            {filteredProducts.map((product) => (
              <ProductCard 
                key={product._id} 
                product={product} 
                onPress={openEditModal} 
              />
            ))}
          </div>
        ) : (
          /* Estado Vazio (Empty State) */
          <div className="flex flex-col items-center justify-center py-24 border-2 border-dashed border-slate-800 rounded-3xl bg-slate-900/20">
            <div className="bg-slate-800 p-6 rounded-full mb-6 opacity-50 ring-4 ring-slate-900/50">
              <FiFilter size={48} className="text-slate-500" />
            </div>
            <h3 className="text-xl font-bold text-slate-300">Nenhum item encontrado</h3>
            <p className="text-slate-500 mt-2 max-w-sm text-center">
              Não encontramos produtos com os filtros atuais. Tente mudar a categoria ou limpar a busca.
            </p>
            {currentCategory !== 'todos' || searchQuery ? (
              <Button 
                variant="light" 
                className="mt-6 text-indigo-400 hover:text-indigo-300"
                onPress={() => { setCurrentCategory('todos'); setSearchQuery(''); }}
              >
                Limpar Filtros
              </Button>
            ) : (
              <Button 
                variant="flat" 
                className="mt-6 text-indigo-400 bg-indigo-500/10"
                onPress={openCreateModal}
              >
                Criar Primeiro Produto
              </Button>
            )}
          </div>
        )}

      </div>

      {/* Modal Principal (Gerencia Criação e Edição) */}
      <ProductModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
        onDelete={handleDelete}
        initialData={selectedProduct}
        loading={loading}
      />
    </div>
  );
}