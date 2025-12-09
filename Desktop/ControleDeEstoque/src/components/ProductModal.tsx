'use client';

import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  Textarea,
  Select,
  SelectItem
} from "@heroui/react";
import { useState, useEffect } from "react";
// Certifique-se de que o arquivo src/types/Product.ts existe
import { Product } from "@/types/product";

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (product: Product) => Promise<void>;
  onDelete?: (id: string) => Promise<void>;
  initialData?: Product | null;
  loading: boolean;
}

export default function ProductModal({ isOpen, onClose, onSave, onDelete, initialData, loading }: ProductModalProps) {
  // Estados dos campos
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [category, setCategory] = useState("");

  // Lista de Categorias
  const categories = [
    { key: "eletronicos", label: "Eletrônicos" },
    { key: "perifericos", label: "Periféricos" },
    { key: "escritorio", label: "Escritório" },
    { key: "hardware", label: "Hardware" },
    { key: "outros", label: "Outros" },
  ];

  // Carrega os dados se for edição
  useEffect(() => {
    if (initialData) {
      setName(initialData.name);
      setDescription(initialData.description);
      setPrice(initialData.price.toString());
      setQuantity(initialData.quantity.toString());
      setCategory(initialData.category);
    } else {
      // Limpa os campos se for novo cadastro
      setName("");
      setDescription("");
      setPrice("");
      setQuantity("");
      setCategory("");
    }
  }, [initialData, isOpen]);

  const handleSubmit = () => {
    // Converte inputs para números antes de salvar
    const numericPrice = parseFloat(price) || 0;
    const numericQty = parseInt(quantity) || 0;

    onSave({
      _id: initialData?._id,
      name,
      description,
      price: numericPrice,
      quantity: numericQty,
      category: category || "outros"
    });
  };

  const handleDelete = () => {
    if (initialData?._id && onDelete) {
      onDelete(initialData._id);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      placement="center"
      backdrop="blur"
      radius="md"
      classNames={{
        base: "border border-slate-800 bg-slate-950 text-slate-100 shadow-2xl sm:m-0 m-4",
        header: "border-b border-slate-800 pb-4",
        footer: "border-t border-slate-800 pt-4 flex justify-between",
        closeButton: "hover:bg-slate-800 active:bg-slate-700 text-slate-400 top-4 right-4",
      }}
    >
      <ModalContent className="p-2 sm:p-6">
        <ModalHeader className="flex flex-col gap-1 pr-8">
          <h2 className="text-xl font-bold text-slate-100">
            {initialData ? "Editar Produto" : "Cadastrar Produto"}
          </h2>
          <p className="text-sm font-normal text-slate-400">
            Gerencie as informações do item no estoque.
          </p>
        </ModalHeader>
        
        <ModalBody className="py-6 flex flex-col gap-5">
          {/* Campo Nome */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-slate-300 ml-1">Nome do Item</label>
            <Input
              autoFocus
              aria-label="Nome do Produto"
              placeholder="Ex: Monitor 24pol"
              value={name}
              onChange={(e) => setName(e.target.value)}
              variant="bordered"
              classNames={{
                inputWrapper: "border-slate-700 hover:border-slate-500 focus-within:!border-indigo-500 bg-slate-900/50"
              }}
            />
          </div>

          {/* Grid Preço e Estoque */}
          <div className="flex gap-4">
            <div className="flex flex-col gap-2 flex-1">
              <label className="text-sm font-semibold text-slate-300 ml-1">Preço (R$)</label>
              <Input
                type="number"
                placeholder="0.00"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                variant="bordered"
                startContent={
                  <div className="pointer-events-none flex items-center">
                    <span className="text-slate-400 text-small">R$</span>
                  </div>
                }
                classNames={{
                  inputWrapper: "border-slate-700 hover:border-slate-500 focus-within:!border-indigo-500 bg-slate-900/50"
                }}
              />
            </div>
            
            <div className="flex flex-col gap-2 flex-1">
              <label className="text-sm font-semibold text-slate-300 ml-1">Qtd. Estoque</label>
              <Input
                type="number"
                placeholder="0"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                variant="bordered"
                classNames={{
                  inputWrapper: "border-slate-700 hover:border-slate-500 focus-within:!border-indigo-500 bg-slate-900/50"
                }}
              />
            </div>
          </div>

          {/* Campo Categoria (CORRIGIDO: sem a prop value) */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-slate-300 ml-1">Categoria</label>
            <Select
              aria-label="Categoria"
              placeholder="Selecione a categoria"
              selectedKeys={category ? [category] : []}
              onChange={(e) => setCategory(e.target.value)}
              variant="bordered"
              classNames={{
                trigger: "border-slate-700 hover:border-slate-500 focus-within:!border-indigo-500 bg-slate-900/50",
                value: "text-slate-200",
                popoverContent: "bg-slate-900 border border-slate-800 text-slate-200"
              }}
            >
              {categories.map((cat) => (
                <SelectItem key={cat.key} className="text-slate-200 hover:bg-slate-800">
                  {cat.label}
                </SelectItem>
              ))}
            </Select>
          </div>

          {/* Campo Descrição */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-slate-300 ml-1">Descrição</label>
            <Textarea
              aria-label="Descrição"
              placeholder="Detalhes técnicos, fornecedor..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              variant="bordered"
              minRows={3}
              classNames={{
                inputWrapper: "border-slate-700 hover:border-slate-500 focus-within:!border-indigo-500 bg-slate-900/50"
              }}
            />
          </div>
        </ModalBody>

        <ModalFooter className="flex-col-reverse sm:flex-row gap-3">
          {initialData && onDelete ? (
            <Button
              color="danger"
              variant="flat"
              onPress={handleDelete}
              className="font-semibold w-full sm:w-auto"
            >
              Excluir Item
            </Button>
          ) : <div className="hidden sm:block"></div>}

          <div className="flex gap-3 w-full sm:w-auto">
            <Button
              variant="light"
              onPress={onClose}
              className="font-medium text-slate-400 hover:text-slate-200 flex-1 sm:flex-none"
            >
              Cancelar
            </Button>
            <Button
              className="bg-indigo-600 text-white font-semibold shadow-lg shadow-indigo-500/20 hover:bg-indigo-500 flex-1 sm:flex-none"
              onPress={handleSubmit}
              isLoading={loading}
            >
              Salvar Produto
            </Button>
          </div>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}