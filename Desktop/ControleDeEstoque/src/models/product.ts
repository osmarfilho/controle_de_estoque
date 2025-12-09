// src/models/Product.ts
import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Por favor, informe o nome do produto."],
      trim: true, // Remove espaços extras
    },
    description: {
      type: String,
      required: false,
    },
    quantity: {
      type: Number,
      required: [true, "Informe a quantidade em estoque."],
      default: 0,
      min: 0,
    },
    price: {
      type: Number,
      required: [true, "Informe o preço de venda."],
      min: 0,
    },
    category: {
      type: String,
      default: "Geral",
    },
  },
  {
    timestamps: true, // Cria automaticamente createdAt e updatedAt
  }
);

// Se o modelo já existir, usa ele, senão cria um novo
export default mongoose.models.Product || mongoose.model("Product", ProductSchema);