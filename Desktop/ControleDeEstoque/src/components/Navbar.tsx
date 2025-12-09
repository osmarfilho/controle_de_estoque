'use client';

import {
  Navbar as HeroNavbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Link,
  Button,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Avatar
} from "@heroui/react";
import { useSession, signOut } from "next-auth/react";
import { usePathname } from "next/navigation";
import { FiLogOut, FiBox, FiUser, FiChevronDown, FiHelpCircle, FiSettings, FiPackage } from "react-icons/fi";

export default function Navbar() {
  const { data: session } = useSession();
  const pathname = usePathname();
  const isAuthPage = pathname === "/login" || pathname === "/register";

  return (
    <HeroNavbar
      maxWidth="xl"
      position="sticky"
      // Aplica o tema escuro (bg-surface) e a cor da borda primária (emerald)
      className="sticky top-0 z-50 bg-surface/90 backdrop-blur-md border-b border-emerald-500/10 shadow-lg shadow-black/10 h-20 transition-all duration-300"
      classNames={{
        wrapper: "px-4 md:px-6",
        item: [
          // Cor do indicador de item ativo (Emerald)
          "data-[active=true]:after:bg-emerald-500",
          "data-[active=true]:after:transition-all"
        ]
      }}
    >
      <NavbarBrand className="gap-3">
        <Link href="/dashboard" className="flex items-center gap-3 group">
          {/* LOGO: Ícone de Caixa (Estoque) com novo estilo Emerald */}
          <div className="w-10 h-10 bg-gradient-to-br from-emerald-600 to-emerald-400 rounded-lg shadow-lg shadow-emerald-600/20 flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
            <FiBox className="text-white w-5 h-5" strokeWidth={2.5} />
          </div>
          
          <div className="flex flex-col">
            {/* NOVO NOME DA LOGO: StockFlow */}
            <p className="font-bold text-xl tracking-tight text-foreground leading-none">
              <span className="text-emerald-500">Stock</span>Flow
            </p>
            {/* Novo Subtítulo */}
            <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest">Inventário</span>
          </div>
        </Link>
      </NavbarBrand>

      <NavbarContent justify="end" className="gap-6">
        {session ? (
          <Dropdown
            placement="bottom-end"
            showArrow
            offset={16}
            classNames={{
              // Fundo do Dropdown ajustado para o tema escuro/surface
              base: "before:bg-surface before:shadow-none",
              content: "p-2 border border-emerald-500/10 shadow-xl shadow-black/30 bg-surface rounded-xl w-64 ring-0"
            }}
          >
            <DropdownTrigger>
              <div className="flex items-center gap-3 cursor-pointer p-1.5 pr-3 rounded-full hover:bg-slate-800 transition-colors border border-transparent hover:border-emerald-500/20">
                <Avatar
                  isBordered
                  color="success" // Cor da borda do Avatar para Emerald
                  src={session.user?.image || undefined}
                  name={session.user?.name?.[0]?.toUpperCase()}
                  className="w-9 h-9 text-sm font-bold ring-2 ring-surface shadow-md"
                />
                <div className="hidden sm:flex flex-col items-start">
                  <span className="text-sm font-bold text-foreground leading-none">{session.user?.name?.split(' ')[0]}</span>
                  <span className="text-[10px] text-gray-500 font-medium">Plano Padrão</span>
                </div>
                <FiChevronDown className="text-gray-500 ml-1" />
              </div>
            </DropdownTrigger>
            <DropdownMenu
              aria-label="User Actions"
              variant="flat"
            >
              <DropdownItem key="profile-info" className="h-16 gap-2 opacity-100 cursor-default mb-2 bg-slate-800 rounded-lg" textValue="Perfil">
                <div className="flex flex-col px-1">
                  <p className="font-bold text-foreground leading-tight">{session.user?.name}</p>
                  <p className="font-medium text-xs text-gray-500 truncate w-full">{session.user?.email}</p>
                </div>
              </DropdownItem>

              <DropdownItem
                key="dashboard"
                href="/dashboard"
                startContent={<FiPackage className="text-emerald-500" size={18} />} // Ícone de Pacote
                className="rounded-lg h-10 data-[hover=true]:bg-emerald-500/10 font-medium text-foreground data-[hover=true]:text-emerald-300"
              >
                Inventário
              </DropdownItem>
              <DropdownItem
                key="settings"
                href="/settings"
                startContent={<FiSettings className="text-emerald-500" size={18} />}
                className="rounded-lg h-10 data-[hover=true]:bg-emerald-500/10 font-medium text-foreground data-[hover=true]:text-emerald-300"
              >
                Configurações (Loading)
              </DropdownItem>
              <DropdownItem
                key="help"
                href="/ajuda"
                startContent={<FiHelpCircle className="text-emerald-500" size={18} />}
                className="rounded-lg h-10 data-[hover=true]:bg-emerald-500/10 font-medium text-foreground data-[hover=true]:text-emerald-300"
              >
                Ajuda & Suporte (404)
              </DropdownItem>

              <DropdownItem
                key="logout"
                color="danger"
                onPress={() => signOut()}
                startContent={<FiLogOut size={18} />}
                className="text-red-500 rounded-lg h-10 mt-2 data-[hover=true]:bg-red-500/10 font-medium"
              >
                Sair
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        ) : (
          !isAuthPage && (
            <>
              <NavbarItem>
                <Link href="/login" className="text-sm font-semibold text-gray-500 hover:text-emerald-500 transition-colors">
                  Entrar
                </Link>
              </NavbarItem>
              <NavbarItem>
                <Button
                  as={Link}
                  href="/register"
                  // Botão primário com a nova cor Emerald
                  className="bg-emerald-500 text-white font-bold text-sm h-10 px-6 rounded-lg shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/30 hover:-translate-y-0.5 transition-all active:scale-95"
                  variant="flat"
                >
                  Começar Grátis
                </Button>
              </NavbarItem>
            </>
          )
        )}
      </NavbarContent>
    </HeroNavbar>
  );
}