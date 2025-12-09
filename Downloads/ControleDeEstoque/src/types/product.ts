// src/types/Product.ts

export interface Product {
  _id?: string;
  name: string;        // Substitui 'title'
  description: string; // Mantém
  price: number;       // Novo
  quantity: number;    // Novo
  category: string;    // Substitui 'status'
  createdAt?: string;
  updatedAt?: string;
}