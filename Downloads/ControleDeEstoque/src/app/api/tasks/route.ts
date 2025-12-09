import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/route";
import connectDB from "@/lib/db";
import Product from "@/models/product"; 


export async function GET(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return NextResponse.json({ message: "Não autorizado" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const location = searchParams.get('location'); 

  if (!location) {
    return NextResponse.json({ message: "Localização do Estoque (location) é obrigatória" }, { status: 400 });
  }
  
  await connectDB();
  try {
    const products = await Product.find({
      userId: session.user.id,
      location: location // FILTRO POR LOCALIZAÇÃO
    }).sort({ createdAt: -1 }); 
    
    return NextResponse.json(products);
  } catch (error) {
    console.error("Erro ao buscar produtos:", error);
    return NextResponse.json({ message: "Erro ao buscar produtos" }, { status: 500 });
  }
}


export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return NextResponse.json({ message: "Não autorizado" }, { status: 401 });
  }

  try {
    const { name, description, price, quantity, category, location } = await req.json();

    if (!name || !price || !quantity || !category || !location) {
      return NextResponse.json(
        { message: "Dados do produto incompletos: Nome, preço, quantidade, categoria e localização são obrigatórios." },
        { status: 400 }
      );
    }
    
    await connectDB();

    const newProduct = await Product.create({
      name,       
      description,
      price: Number(price),   
      quantity: Number(quantity), 
      category,     
      location,     
      userId: session.user.id,
    });

    return NextResponse.json(newProduct, { status: 201 });
  } catch (error) {
    console.error("Erro ao criar produto:", error);
    return NextResponse.json({ message: "Erro ao criar produto" }, { status: 500 });
  }
}