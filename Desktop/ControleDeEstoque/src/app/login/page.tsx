// src/app/login/page.tsx

'use client';

import Link from 'next/link';
import { Card, CardBody, Input, Button } from "@heroui/react";
import { FiMail, FiLock } from "react-icons/fi"; 

export default function LoginPage() {
  
  // Função de handleLogin (simulada)
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Tentando login...");
    // Adicione aqui a lógica de login com NextAuth
  };

  return (
    <div className="flex min-h-[calc(100vh-80px)] items-center justify-center p-6 bg-background">
      
      <Card className="w-full max-w-md p-8 card-surface shadow-2xl shadow-black/50 border border-emerald-500/10 transition-all duration-500">
        <CardBody className="p-0">
          
          <h2 className="text-3xl font-extrabold text-foreground mb-6 text-center">
            Bem-vindo de volta
          </h2>
          <p className="text-center text-gray-400 mb-8">
            Acesse sua conta para continuar
          </p>
          
          <form onSubmit={handleLogin} className="space-y-6">
            
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

            {/* Link Esqueceu a Senha? */}
            <div className="flex justify-end">
              <Link href="/forgot-password">
                <p className="text-xs font-semibold text-gray-500 hover:text-emerald-500 transition-colors">
                  Esqueceu a senha?
                </p>
              </Link>
            </div>

            {/* BOTÃO ENTRAR (Cor Verde Emerald) */}
            <Button
              type="submit"
              size="lg"
              // AQUI ESTÁ A MUDANÇA: usando o verde da logo e a classe 'btn-primary'
              className="btn-primary w-full font-extrabold text-md h-12 rounded-lg 
                         shadow-xl shadow-emerald-500/30 hover:bg-emerald-600 transition-all active:scale-[0.98]"
            >
              Entrar
            </Button>
            
          </form>

          {/* Link Criar Conta */}
          <div className="text-center mt-6">
            <p className="text-sm text-gray-400">
              Não tem uma conta?
              <Link href="/register">
                <span className="font-bold text-emerald-500 hover:text-emerald-400 ml-1 transition-colors cursor-pointer">
                  Criar conta
                </span>
              </Link>
            </p>
          </div>
        </CardBody>
      </Card>
      
    </div>
  );
}