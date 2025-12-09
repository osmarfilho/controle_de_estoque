import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import connectDB from '@/lib/db';
import User from '@/models/user';

// GET: Busca LOCATIONS (Antigos Workspaces) do usuário
export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user || !session.user.email) {
      return NextResponse.json({ message: 'Não autorizado' }, { status: 401 });
    }

    await connectDB();

    const user = await User.findOne({ email: session.user.email }).select('workspaces activeWorkspace'); // Mantém o nome do campo se o schema não mudou

    if (!user) {
      return NextResponse.json({ message: 'Usuário não encontrado' }, { status: 404 });
    }
    
    // Nomes de variáveis na resposta são alterados para o Frontend
    return NextResponse.json({
      locations: user.workspaces, 
      activeLocation: user.activeWorkspace || (user.workspaces[0]?.name || "Depósito Central") // Novo padrão
    });

  } catch (error) {
    console.error("Erro ao buscar locais de estoque:", error);
    return NextResponse.json({ message: 'Erro interno ao buscar locais de estoque' }, { status: 500 });
  }
}

// POST: Cria nova LOCATION (Unidade/Depósito)
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user || !session.user.email) {
      return NextResponse.json({ message: 'Não autorizado' }, { status: 401 });
    }

    await connectDB();
    // Parâmetros de criação de Location
    const { name, description, icon } = await request.json(); 

    if (!name || typeof name !== 'string') {
      return NextResponse.json({ message: 'Nome da Unidade inválido' }, { status: 400 });
    }

    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json({ message: 'Usuário não encontrado' }, { status: 404 });
    }

    // Verifica duplicação
    const exists = user.workspaces.some((w: any) => {
      if (typeof w === 'string') return w === name;
      return w.name === name;
    });

    if (!exists) {
      user.workspaces.push({ // Usa o campo do Schema
        name,
        description: description || "Unidade de Estoque",
        icon: icon || "warehouse" // Novo ícone padrão
      });
      await user.save();
    }

    // Retorna 'locations' em vez de 'workspaces'
    return NextResponse.json({ locations: user.workspaces }); 
  } catch (error) {
    console.error("Erro ao criar local de estoque:", error);
    return NextResponse.json({ message: 'Erro ao criar local de estoque' }, { status: 500 });
  }
}

// PATCH: Atualiza LOCATION ativa
export async function PATCH(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user || !session.user.email) return NextResponse.json({ message: 'Não autorizado' }, { status: 401 });

    await connectDB();
    // Renomeado a variável de entrada
    const { activeLocation } = await request.json(); 

    const user = await User.findOneAndUpdate(
      { email: session.user.email },
      { activeWorkspace: activeLocation }, // Atualiza o campo 'activeWorkspace' com o novo 'activeLocation'
      { new: true }
    );

    // Retorna 'activeLocation' em vez de 'activeWorkspace'
    return NextResponse.json({ activeLocation: user.activeWorkspace }); 
  } catch (error) {
    return NextResponse.json({ message: 'Erro ao atualizar local ativo' }, { status: 500 });
  }
}

// DELETE: Remove LOCATION
export async function DELETE(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user || !session.user.email) return NextResponse.json({ message: 'Não autorizado' }, { status: 401 });

    await connectDB();
    const { name } = await request.json(); // Nome da Location a ser excluída

    const user = await User.findOne({ email: session.user.email });
    if (!user) return NextResponse.json({ message: 'Usuário não encontrado' }, { status: 404 });

    // Filtra pelo nome
    user.workspaces = user.workspaces.filter((w: any) => w.name !== name);

    // Se apagou a ativa, reseta para a primeira (Nova Terminologia)
    if (user.activeWorkspace === name) {
      user.activeWorkspace = user.workspaces[0]?.name || 'Depósito Central';
    }

    await user.save();

    // Retorna com nova terminologia
    return NextResponse.json({ 
        locations: user.workspaces, 
        activeLocation: user.activeWorkspace 
    });
  } catch (error) {
    return NextResponse.json({ message: 'Erro ao deletar local de estoque' }, { status: 500 });
  }
}