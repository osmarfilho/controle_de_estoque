import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import connectDB from "@/lib/db";
import User from "@/models/user";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return NextResponse.json({ message: "Não autorizado" }, { status: 401 });
  }

  try {
    await connectDB();

    const user = await User.findById(session.user.id)
      .select("locations activeLocation");

    if (!user) {
      return NextResponse.json({ message: "Usuário não encontrado" }, { status: 404 });
    }

    return NextResponse.json({
      locations: user.locations,
      activeLocation: user.activeLocation
    });

  } catch (error) {
    console.error("Erro ao buscar locais:", error);
    return NextResponse.json({ message: "Erro interno do servidor" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return NextResponse.json({ message: "Não autorizado" }, { status: 401 });
  }

  try {
    const { name, description, icon } = await req.json();

    if (!name) {
      return NextResponse.json({ message: "O nome do local é obrigatório." }, { status: 400 });
    }

    await connectDB();

    const user = await User.findById(session.user.id);

    if (!user) {
      return NextResponse.json({ message: "Usuário não encontrado" }, { status: 404 });
    }

    user.locations.push({
      name,
      description: description || "",
      icon: icon || "warehouse",
    });

    await user.save();

    return NextResponse.json(user.locations, { status: 201 });

  } catch (error) {
    console.error("Erro ao criar novo local:", error);
    return NextResponse.json({ message: "Erro ao criar novo local" }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return NextResponse.json({ message: "Não autorizado" }, { status: 401 });
  }

  try {
    const { activeLocation } = await req.json();

    if (!activeLocation) {
      return NextResponse.json(
        { message: "O nome do local ativo é obrigatório." },
        { status: 400 }
      );
    }

    await connectDB();

    const user = await User.findById(session.user.id);

    if (!user) {
      return NextResponse.json({ message: "Usuário não encontrado" }, { status: 404 });
    }

    const exists = user.locations.some(
      (location: { name: string }) => location.name === activeLocation
    );

    if (!exists) {
      return NextResponse.json(
        { message: "Localização de estoque não encontrada." },
        { status: 404 }
      );
    }

    user.activeLocation = activeLocation;
    await user.save();

    return NextResponse.json(
      { message: "Local ativo atualizado com sucesso", activeLocation },
      { status: 200 }
    );

  } catch (error) {
    console.error("Erro ao atualizar local ativo:", error);
    return NextResponse.json(
      { message: "Erro ao atualizar local ativo" },
      { status: 500 }
    );
  }
}
