'use client';

import { Card, CardHeader, CardBody, CardFooter, Chip, Divider } from "@heroui/react";
import { Product } from "@/types/product"; // Importando o tipo correto
import { FiPackage, FiDollarSign, FiClock } from 'react-icons/fi'; // Ícones para dar cara de sistema pro

interface ProductCardProps {
  product: Product;
  onPress: (product: Product) => void;
}

export default function ProductCard({ product, onPress }: ProductCardProps) {

  // Formata moeda para Real Brasileiro
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  // Formata data
  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'short'
    });
  };

  // Lógica visual para o Estoque
  const isOutOfStock = product.quantity === 0;
  const isLowStock = product.quantity > 0 && product.quantity < 5;

  // Define a cor do Badge de Estoque
  const getStockColor = () => {
    if (isOutOfStock) return "danger"; // Vermelho
    if (isLowStock) return "warning";  // Amarelo
    return "success";                  // Verde
  };

  return (
    <Card
      isPressable
      onPress={() => onPress(product)}
      className="w-full border shadow-lg transition-all hover:-translate-y-1 group"
      // Estilização Dark Mode (Slate)
      classNames={{
        base: "bg-slate-900 border-slate-800 hover:border-indigo-500 hover:shadow-indigo-500/10 rounded-xl"
      }}
    >
      {/* Cabeçalho: Nome e Categoria */}
      <CardHeader className="flex justify-between items-start pt-4 px-4 pb-0">
        <div className="flex flex-col items-start gap-1">
          <Chip
            size="sm"
            variant="flat"
            className="capitalize text-[10px] font-bold h-6 px-2"
            classNames={{
              base: "bg-slate-800 text-slate-400 group-hover:bg-indigo-900/50 group-hover:text-indigo-300 transition-colors"
            }}
          >
            {product.category || "Geral"}
          </Chip>
          <h4 className="text-lg font-bold text-slate-100 line-clamp-1 group-hover:text-indigo-400 transition-colors">
            {product.name}
          </h4>
        </div>
        
        {/* Badge de Estoque (Canto superior direito) */}
        <Chip
          color={getStockColor()}
          variant="dot"
          size="sm"
          className="border-none bg-slate-800/50"
          classNames={{
             content: "font-semibold text-slate-300"
          }}
        >
          {isOutOfStock ? "Esgotado" : `${product.quantity} un.`}
        </Chip>
      </CardHeader>

      <Divider className="my-3 bg-slate-800/50" />

      {/* Corpo: Descrição e Preço */}
      <CardBody className="px-4 py-2 overflow-hidden">
        <p className="text-sm text-slate-500 line-clamp-2 min-h-[40px] mb-4">
          {product.description || "Sem descrição definida."}
        </p>

        {/* Grid de Informações Financeiras */}
        <div className="flex items-center justify-between bg-slate-950/50 p-3 rounded-lg border border-slate-800/50">
          <div className="flex flex-col">
            <span className="text-[10px] text-slate-500 uppercase tracking-wider font-bold">Valor Unitário</span>
            <div className="flex items-center text-emerald-400 font-bold text-lg">
              <span className="text-sm mr-1">R$</span>
              {product.price.toFixed(2).replace('.', ',')}
            </div>
          </div>
          
          <div className="h-8 w-[1px] bg-slate-800"></div>

          <div className="flex flex-col items-end">
            <span className="text-[10px] text-slate-500 uppercase tracking-wider font-bold">Cadastro</span>
            <div className="flex items-center gap-1 text-slate-400 text-xs mt-1">
              <FiClock className="w-3 h-3" />
              {formatDate(product.createdAt)}
            </div>
          </div>
        </div>
      </CardBody>
      
      {/* Barra decorativa inferior */}
      <div className={`h-1 w-full mt-2 ${isOutOfStock ? 'bg-red-500/20' : 'bg-indigo-500/20'}`} />
    </Card>
  );
}