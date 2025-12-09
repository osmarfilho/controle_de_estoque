'use client';

import {
  Button,
  Input,
  Textarea,
  Tab,
  Tabs
} from "@heroui/react";
import { useState, useEffect } from "react";
import { FiPackage, FiAlignLeft, FiSave, FiDollarSign, FiHash } from "react-icons/fi";
import { Product } from "@/types/product";

interface ProductFormProps {
  onSave: (product: Product) => void;
  onCancel: () => void;
  initialData?: Product | null;
  loading?: boolean;
}

export default function ProductForm({ onSave, onCancel, initialData, loading = false }: ProductFormProps) {
  // Estados
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [category, setCategory] = useState("outros");

  // Carregar dados na edição
  useEffect(() => {
    if (initialData) {
      setName(initialData.name);
      setDescription(initialData.description);
      setPrice(initialData.price.toString());
      setQuantity(initialData.quantity.toString());
      setCategory(initialData.category);
    }
  }, [initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const numericPrice = parseFloat(price) || 0;
    const numericQty = parseInt(quantity) || 0;

    onSave({
      _id: initialData?._id,
      name,
      description,
      price: numericPrice,
      quantity: numericQty,
      category
    });
  };

  return (
    <form className="flex flex-col gap-5 w-full p-6" onSubmit={handleSubmit}>
      {/* Cabeçalho */}
      <header className="flex flex-col items-center gap-1 border-b border-slate-800 pb-4">
        <h3 className="text-xl font-bold text-slate-100 tracking-tight">
          {initialData ? "Editar Produto" : "Novo Produto"}
        </h3>
        <p className="text-xs text-slate-400 font-medium">Preencha os detalhes do item de estoque</p>
      </header>

      <div className="space-y-5">
        
        {/* Input: Nome */}
        <div className="flex flex-col gap-2">
          <label className="text-[10px] font-extrabold text-slate-500 ml-4 uppercase tracking-widest">Nome do Item</label>
          <Input
            placeholder="Ex: Teclado Mecânico RGB"
            value={name}
            onChange={(e) => setName(e.target.value)}
            variant="flat"
            radius="full"
            size="md"
            startContent={<div className="pointer-events-none flex items-center"><FiPackage className="text-slate-400 mr-2" /></div>}
            classNames={{
              inputWrapper: "bg-slate-900/50 hover:bg-slate-800 focus-within:bg-slate-900 shadow-none h-11 transition-all duration-300 data-[hover=true]:bg-slate-800 group-data-[focus=true]:bg-slate-900 !border-none !ring-0 !outline-none px-6",
              input: "text-slate-100 font-semibold placeholder:text-slate-600 !border-none !ring-0 !outline-none",
            }}
            required
          />
        </div>

        {/* Grid: Preço e Quantidade */}
        <div className="flex gap-4">
          <div className="flex flex-col gap-2 w-1/2">
            <label className="text-[10px] font-extrabold text-slate-500 ml-4 uppercase tracking-widest">Preço</label>
            <Input
              type="number"
              placeholder="0.00"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              variant="flat"
              radius="full"
              startContent={<div className="pointer-events-none flex items-center"><FiDollarSign className="text-slate-400 mr-1" /></div>}
              classNames={{
                inputWrapper: "bg-slate-900/50 hover:bg-slate-800 focus-within:bg-slate-900 shadow-none h-11 px-6",
                input: "text-slate-100 font-semibold placeholder:text-slate-600",
              }}
            />
          </div>
          <div className="flex flex-col gap-2 w-1/2">
            <label className="text-[10px] font-extrabold text-slate-500 ml-4 uppercase tracking-widest">Qtd.</label>
            <Input
              type="number"
              placeholder="0"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              variant="flat"
              radius="full"
              startContent={<div className="pointer-events-none flex items-center"><FiHash className="text-slate-400 mr-1" /></div>}
              classNames={{
                inputWrapper: "bg-slate-900/50 hover:bg-slate-800 focus-within:bg-slate-900 shadow-none h-11 px-6",
                input: "text-slate-100 font-semibold placeholder:text-slate-600",
              }}
            />
          </div>
        </div>

        {/* Tabs: Categoria (Substituindo o Select antigo por Tabs visuais) */}
        <div className="flex flex-col gap-2">
          <label className="text-[10px] font-extrabold text-slate-500 ml-1 uppercase tracking-widest">Categoria</label>
          <Tabs
            aria-label="Categoria do Produto"
            selectedKey={category}
            onSelectionChange={(key) => setCategory(key as string)}
            fullWidth
            size="md"
            radius="full"
            classNames={{
              cursor: "w-full bg-indigo-600 shadow-lg shadow-indigo-500/20 rounded-full",
              tabList: "bg-slate-900 p-1 rounded-full gap-2 border border-slate-800",
              tab: "h-8 rounded-full",
              tabContent: "group-data-[selected=true]:text-white text-slate-500 font-bold text-xs transition-colors",
            }}
          >
            <Tab key="eletronicos" title="Eletrônicos" />
            <Tab key="perifericos" title="Periféricos" />
            <Tab key="escritorio" title="Escritório" />
            <Tab key="outros" title="Outros" />
          </Tabs>
        </div>

        {/* Textarea: Descrição */}
        <div className="flex flex-col gap-2">
          <label className="text-[10px] font-extrabold text-slate-500 ml-4 uppercase tracking-widest">Descrição</label>
          <Textarea
            placeholder="Detalhes técnicos, fornecedor ou observações..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            variant="flat"
            minRows={2}
            radius="lg"
            size="md"
            startContent={<div className="h-full py-3"><FiAlignLeft className="text-slate-400 mr-4" /></div>}
            classNames={{
              inputWrapper: "bg-slate-900/50 hover:bg-slate-800 focus-within:bg-slate-900 shadow-none py-2 px-6 rounded-[24px]",
              input: "text-slate-300 font-medium placeholder:text-slate-600 text-sm"
            }}
          />
        </div>
      </div>

      {/* Botões */}
      <div className="flex gap-3 mt-4 pt-4 border-t border-slate-800">
        <Button
          fullWidth
          variant="flat"
          onPress={onCancel}
          className="h-11 font-bold text-slate-400 hover:text-slate-200 bg-slate-900 hover:bg-slate-800 rounded-2xl"
        >
          Cancelar
        </Button>
        <Button
          fullWidth
          type="submit"
          className="h-11 bg-indigo-600 text-white font-bold text-sm rounded-2xl shadow-xl shadow-indigo-500/20 hover:shadow-indigo-500/40 active:scale-[0.98] transition-all"
          isLoading={loading}
          startContent={!loading && <FiSave className="mt-0.5" />}
        >
          {initialData ? "Salvar Alterações" : "Cadastrar Item"}
        </Button>
      </div>
    </form>
  );
}