import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]/route";
import connectDB from "@/lib/db";
import Product from "@/models/product"; 

type Props = {
  params: Promise<{
    id: string;
  }>;
};


export async function PUT(req: Request, props: Props) {
  const params = await props.params;
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return NextResponse.json({ message: "Não autorizado" }, { status: 401 });
  }

  try {
    // Novos campos de Produto/Estoque
    const { name, description, price, quantity, category } = await req.json();
    await connectDB();

    // Validação básica para garantir que o item está sendo atualizado como Produto
    if (!name || price === undefined || quantity === undefined || !category) {
       return NextResponse.json(
        { message: "Dados de atualização incompletos: Nome, preço, quantidade e categoria são necessários." },
        { status: 400 }
      );
    }

    const product = await Product.findOneAndUpdate(
      { _id: params.id, userId: session.user.id },
      // Campos de Atualização de Estoque
      { 
        name, 
        description, 
        price: Number(price), 
        quantity: Number(quantity),
        category 
      },
      { new: true } // Retorna o documento atualizado
    );

    if (!product) {
      return NextResponse.json({ message: "Produto não encontrado" }, { status: 404 });
    }

    return NextResponse.json(product);
  } catch (error) {
    console.error("Erro ao atualizar produto:", error);
    return NextResponse.json({ message: "Erro ao atualizar produto" }, { status: 500 });
  }
}

// --- Rota DELETE para Excluir Produto ---

export async function DELETE(req: Request, props: Props) {
  const params = await props.params;
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return NextResponse.json({ message: "Não autorizado" }, { status: 401 });
  }

  try {
    await connectDB();
    // Usa findOneAndDelete e renomeia a variável para 'product'
    const product = await Product.findOneAndDelete({ _id: params.id, userId: session.user.id });

    if (!product) {
      // Mensagem de erro referenciando Produto
      return NextResponse.json({ message: "Produto não encontrado" }, { status: 404 });
    }

    // Mensagem de sucesso referenciando Produto
    return NextResponse.json({ message: "Produto excluído com sucesso" });
  } catch (error) {
    console.error("Erro ao excluir produto:", error);
    return NextResponse.json({ message: "Erro ao excluir produto" }, { status: 500 });
  }
}