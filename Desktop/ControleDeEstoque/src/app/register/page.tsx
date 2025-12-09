// src/app/register/page.tsx

'use client';

import Link from 'next/link';
import { Card, CardBody, Input, Button } from "@heroui/react";
import { FiUser, FiMail, FiLock } from "react-icons/fi"; 

export default function RegisterPage() {
  
  // Função de handleRegister (simulada)
  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Tentando registro...");
    // Adicione aqui a lógica de registro
  };

  return (
    <div className="flex min-h-[calc(100vh-80px)] items-center justify-center p-6 bg-background">
      
      <Card className="w-full max-w-md p-8 card-surface shadow-2xl shadow-black/50 border border-emerald-500/10 transition-all duration-500">
        <CardBody className="p-0">
          
          <h2 className="text-3xl font-extrabold text-foreground mb-6 text-center">
            Crie sua conta
          </h2>
          <p className="text-center text-gray-400 mb-8">
            Comece a gerenciar seu inventário agora.
          </p>
          
          <form onSubmit={handleRegister} className="space-y-6">
            
            {/* Campo NOME */}
            <Input
              label="NOME"
              type="text"
              placeholder="Seu Nome Completo"
              labelPlacement="outside"
              startContent={<FiUser className="text-slate-500" />}
              variant="bordered"
              className="text-foreground"
              classNames={{
                inputWrapper: "bg-slate-800/50 border-slate-700 hover:border-emerald-500/50 focus-within:border-emerald-500/50",
                label: "text-gray-400 font-bold mb-2 text-xs uppercase"
              }}
            />

            {/* Campo E-MAIL */}
            <Input
              label="EMAIL"
              type="email"
              placeholder="seu@email.com"
              labelPlacement="outside"
              startContent={<FiMail className="text-slate-500" />}
              variant="bordered"
              className="text-foreground"
              classNames={{
                inputWrapper: "bg-slate-800/50 border-slate-700 hover:border-emerald-500/50 focus-within:border-emerald-500/50",
                label: "text-gray-400 font-bold mb-2 text-xs uppercase"
              }}
            />

            {/* Campo SENHA */}
            <Input
              label="SENHA"
              type="password"
              placeholder="**********"
              labelPlacement="outside"
              startContent={<FiLock className="text-slate-500" />}
              variant="bordered"
              className="text-foreground"
              classNames={{
                inputWrapper: "bg-slate-800/50 border-slate-700 hover:border-emerald-500/50 focus-within:border-emerald-500/50",
                label: "text-gray-400 font-bold mb-2 text-xs uppercase"
              }}
            />

            {/* BOTÃO CADASTRAR (Cor Verde Emerald) */}
            <Button
              type="submit"
              size="lg"
              // Aplicação da classe 'btn-primary' para cor Emerald
              className="btn-primary w-full font-extrabold text-md h-12 rounded-lg 
                         shadow-xl shadow-emerald-500/30 hover:bg-emerald-600 transition-all active:scale-[0.98]"
            >
              Cadastrar
            </Button>
            
          </form>

          {/* Link Já tenho conta */}
          <div className="text-center mt-6">
            <p className="text-sm text-gray-400">
              Já tem uma conta?
              <Link href="/login">
                <span className="font-bold text-emerald-500 hover:text-emerald-400 ml-1 transition-colors cursor-pointer">
                  Entrar
                </span>
              </Link>
            </p>
          </div>
        </CardBody>
      </Card>
      
    </div>
  );
}