// src/app/page.tsx

'use client';

import Link from 'next/link';
import { Button } from '@heroui/react';
import { FiArrowRight, FiCheckCircle } from 'react-icons/fi'; 

import { BoxIcon } from 'lucide-react'; 
export default function HomePage() {
  return (
    // Container Principal: Aplicando a cor de fundo (definida globalmente como Slate 950)
    <main className="relative flex min-h-[calc(100vh-80px)] items-center justify-center overflow-hidden p-6">
      
      {/* 1. Elementos Gráficos de Fundo (Círculos) */}
      <div className="absolute inset-0 z-0">
        {/* Círculo 1 (Topo Esquerdo) */}
        <div className="absolute top-[-100px] left-[-100px] w-[350px] h-[350px] bg-emerald-600/20 rounded-full blur-3xl opacity-30 animate-pulse" />
        {/* Círculo 2 (Meio Direito) */}
        <div className="absolute bottom-[-100px] right-[-150px] w-[400px] h-[400px] bg-slate-700/30 rounded-full blur-3xl opacity-20 animate-pulse delay-1000" />
        {/* Círculo 3 (Canto Superior Direito) */}
        <div className="absolute top-[-50px] right-[-50px] w-[200px] h-[200px] bg-teal-500/10 rounded-full blur-3xl opacity-20" />
      </div>

      {/* 2. Conteúdo Central (Headline e Botões) */}
      <div className="z-10 max-w-4xl text-center">
        
        {/* 2.1. HEADLINE PRINCIPAL */}
        <h1 className="text-6xl md:text-8xl font-extrabold tracking-tighter mb-4 leading-tight">
          <span className="text-white">Controle seu estoque,</span>
          <br />
          <span className="text-emerald-500">não o caos..</span>
        </h1>

        {/* 2.2. SUB-HEADLINE */}
        <p className="text-md md:text-lg text-gray-400 max-w-2xl mx-auto mb-10 font-medium">
          Gerencie produtos, preços e depósitos em um único lugar. A organização essencial para o seu inventário.
        </p>

        {/* 2.3. BOTÕES DE CALL-TO-ACTION */}
        <div className="flex justify-center space-x-4">
          
          {/* BOTÃO PRINCIPAL: Começar Grátis (Cor Emerald) */}
          <Button
            as={Link}
            href="/register"
            size="lg"
            className="bg-emerald-500 text-slate-900 font-extrabold text-md h-12 px-8 rounded-lg 
                       shadow-xl shadow-emerald-500/30 hover:bg-emerald-600 transition-all active:scale-95"
            startContent={<FiCheckCircle className="w-5 h-5" />}
          >
            Começar Grátis
          </Button>

          {/* BOTÃO SECUNDÁRIO: Já sou cliente (Contraste) */}
          <Button
            as={Link}
            href="/login"
            size="lg"
            variant="bordered"
            className="text-white border-slate-700 hover:border-emerald-500/50 font-bold text-md h-12 px-8 rounded-lg 
                       bg-slate-800/50 backdrop-blur-sm hover:bg-slate-700/50 transition-colors"
          >
            Já sou cliente
          </Button>
        </div>
      </div>
    </main>
  );
}