'use client';

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import {
  Spinner,
  Button,
  Card,
  CardBody,
  Input,
  Popover,
  PopoverTrigger,
  PopoverContent,
  useDisclosure,
  Textarea
} from "@heroui/react";
import {
  FiPlus,
  FiBox,
  FiTruck,
  FiMapPin,
  FiHome,
  FiSettings,
  FiGrid,
  FiMoreVertical,
  FiTrash2,
  FiArrowRight
} from "react-icons/fi";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem
} from "@heroui/react";

interface Workspace {
  name: string;
  description: string;
  icon: string;
}

// Ícones focados em Logística/Estoque
const ICONS = [
  { id: "warehouse", icon: FiHome, label: "Matriz" },
  { id: "branch", icon: FiMapPin, label: "Filial" },
  { id: "truck", icon: FiTruck, label: "Centro Dist." },
  { id: "storage", icon: FiBox, label: "Depósito" },
  { id: "office", icon: FiGrid, label: "Escritório" },
  { id: "factory", icon: FiSettings, label: "Fábrica" },
];

export default function LocationsPage() {
  const { status } = useSession();
  const router = useRouter();
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [loading, setLoading] = useState(true);
  const { isOpen, onOpenChange } = useDisclosure();

  // Estados do Formulário
  const [newName, setNewName] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [newIcon, setNewIcon] = useState("warehouse");
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    } else if (status === "authenticated") {
      fetchWorkspaces();
    }
  }, [status, router]);

  const fetchWorkspaces = async () => {
    try {
      const res = await fetch("/api/user/workspace");
      if (res.ok) {
        const data = await res.json();
        const formatted = (data.workspaces || []).map((w: any) =>
          typeof w === 'string'
            ? { name: w, description: '', icon: 'warehouse' }
            : w
        );
        setWorkspaces(formatted);
      }
    } catch (error) {
      console.error("Erro ao buscar unidades:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateWorkspace = async (closeFn: () => void) => {
    if (!newName.trim()) return;
    setCreating(true);
    try {
      const res = await fetch("/api/user/workspace", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newName,
          description: newDesc,
          icon: newIcon
        })
      });
      if (res.ok) {
        const data = await res.json();
        setWorkspaces(data.workspaces);
        setNewName("");
        setNewDesc("");
        setNewIcon("warehouse");
        closeFn();
      }
    } catch (error) {
      console.error("Erro ao criar unidade:", error);
    } finally {
      setCreating(false);
    }
  };

  const handleDeleteWorkspace = async (name: string) => {
    if(!confirm(`Tem certeza que deseja desativar a unidade "${name}"?`)) return;
    
    try {
       const res = await fetch("/api/user/workspace", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name })
      });
      if (res.ok) {
         fetchWorkspaces(); // Recarrega a lista
      }
    } catch (error) {
      console.error("Erro ao deletar:", error);
    }
  };

  const handleSelectWorkspace = async (name: string) => {
    router.push(`/?workspace=${encodeURIComponent(name)}`);
  };

  const renderIcon = (iconName: string, size = 28) => {
    const found = ICONS.find(i => i.id === iconName) || ICONS[0];
    const IconComp = found.icon;
    return <IconComp size={size} />;
  };

  if (status === "loading" || loading) return (
    <div className="flex justify-center items-center h-screen bg-slate-950">
      <Spinner size="lg" color="white" />
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans">
      <div className="max-w-[1200px] mx-auto px-6 py-12 md:py-20">

        {/* --- HERO SECTION (Dark Mode) --- */}
        <div className="flex flex-col md:flex-row justify-between items-end md:items-center mb-12 gap-8 border-b border-slate-800 pb-8">
          <div className="max-w-xl">
            <h5 className="text-xs font-bold uppercase tracking-[0.2em] text-indigo-400 mb-2">
              Gestão Multi-local
            </h5>
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white mb-4">
              Unidades de Estoque
            </h1>
            <p className="text-lg text-slate-400 font-medium leading-relaxed">
              Selecione o depósito ou filial que deseja gerenciar.
            </p>
          </div>

          <Popover
            isOpen={isOpen}
            onOpenChange={onOpenChange}
            placement="bottom-end"
            showArrow={false}
            offset={20}
            backdrop="blur"
            classNames={{
              content: "p-0 rounded-3xl w-[380px] border border-slate-800 bg-slate-900 shadow-2xl"
            }}
          >
            <PopoverTrigger>
              <Button
                className="h-12 px-6 rounded-xl bg-indigo-600 text-white font-bold text-sm shadow-lg shadow-indigo-500/20 hover:bg-indigo-500 transition-all"
                startContent={<FiPlus size={20} />}
              >
                Nova Unidade
              </Button>
            </PopoverTrigger>
            <PopoverContent>
              {(titleProps) => (
                <div className="flex flex-col w-full overflow-hidden">
                  <div className="p-6 pb-2 border-b border-slate-800">
                    <h3 className="text-lg font-bold text-white" {...titleProps}>Cadastrar Unidade</h3>
                    <p className="text-xs text-slate-400">Adicione um novo local de armazenamento.</p>
                  </div>

                  <div className="p-6 flex flex-col gap-5">
                    {/* Nome */}
                    <div className="flex flex-col gap-2">
                      <label className="text-[10px] font-bold text-slate-500 uppercase">Identificação</label>
                      <Input
                        autoFocus
                        placeholder="Ex: Depósito Central"
                        value={newName}
                        onValueChange={setNewName}
                        variant="bordered"
                        classNames={{
                          inputWrapper: "border-slate-700 hover:border-slate-500 focus-within:!border-indigo-500 bg-slate-950/50 text-white",
                          input: "placeholder:text-slate-600"
                        }}
                      />
                    </div>

                    {/* Descrição */}
                    <div className="flex flex-col gap-2">
                      <label className="text-[10px] font-bold text-slate-500 uppercase">Endereço / Detalhes</label>
                      <Textarea
                        placeholder="Rua, Número ou referência..."
                        minRows={2}
                        value={newDesc}
                        onChange={(e) => setNewDesc(e.target.value)}
                        variant="bordered"
                        classNames={{
                          inputWrapper: "border-slate-700 hover:border-slate-500 focus-within:!border-indigo-500 bg-slate-950/50 text-white",
                          input: "placeholder:text-slate-600"
                        }}
                      />
                    </div>

                    {/* Ícones */}
                    <div>
                      <span className="text-[10px] font-bold text-slate-500 uppercase mb-3 block">Tipo de Local</span>
                      <div className="grid grid-cols-4 gap-2">
                        {ICONS.map((item) => (
                          <button
                            key={item.id}
                            onClick={() => setNewIcon(item.id)}
                            className={`aspect-square rounded-xl flex flex-col gap-1 items-center justify-center transition-all duration-300 border ${newIcon === item.id
                              ? "bg-indigo-600 border-indigo-500 text-white shadow-lg"
                              : "bg-slate-800 border-slate-700 text-slate-400 hover:bg-slate-700 hover:text-slate-200"
                              }`}
                          >
                            {renderIcon(item.id, 18)}
                            <span className="text-[9px] font-bold">{item.label}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    <Button
                      className="w-full font-bold bg-white text-slate-900 rounded-xl h-12 mt-2 hover:bg-slate-200"
                      onPress={() => handleCreateWorkspace(onOpenChange)}
                      isLoading={creating}
                    >
                      Confirmar Cadastro
                    </Button>
                  </div>
                </div>
              )}
            </PopoverContent>
          </Popover>
        </div>

        {/* --- GRID DE DEPÓSITOS --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {workspaces.map((ws, i) => (
            <Card
              key={ws.name + i}
              isPressable
              onPress={() => handleSelectWorkspace(ws.name)}
              className="group border border-slate-800 bg-slate-900 hover:border-indigo-500/50 hover:bg-slate-800/80 transition-all duration-300"
              shadow="sm"
            >
              <CardBody className="p-6 h-60 flex flex-col justify-between relative overflow-hidden">
                
                {/* Header do Card */}
                <div className="flex justify-between items-start z-10">
                  <div className="w-12 h-12 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-indigo-400 group-hover:text-white group-hover:bg-indigo-600 transition-colors">
                    {renderIcon(ws.icon, 24)}
                  </div>

                  {/* Menu Dropdown (Dark Mode) */}
                  <Dropdown classNames={{ content: "bg-slate-900 border border-slate-800" }}>
                    <DropdownTrigger>
                      <Button isIconOnly variant="light" size="sm" className="text-slate-500 hover:text-white">
                        <FiMoreVertical size={18} />
                      </Button>
                    </DropdownTrigger>
                    <DropdownMenu 
                      aria-label="Ações"
                      itemClasses={{
                        base: "text-slate-300 data-[hover=true]:bg-slate-800 data-[hover=true]:text-white",
                      }}
                    >
                      <DropdownItem
                        key="delete"
                        className="text-red-400 data-[hover=true]:bg-red-900/20 data-[hover=true]:text-red-400"
                        startContent={<FiTrash2 />}
                        onPress={() => handleDeleteWorkspace(ws.name)}
                      >
                        Desativar Unidade
                      </DropdownItem>
                    </DropdownMenu>
                  </Dropdown>
                </div>

                {/* Info do Card */}
                <div className="z-10 mt-4">
                  <h3 className="text-xl font-bold text-white mb-2 group-hover:text-indigo-300 transition-colors">
                    {ws.name}
                  </h3>
                  <p className="text-slate-400 text-sm leading-relaxed line-clamp-2">
                    {ws.description || "Unidade de armazenamento padrão."}
                  </p>
                </div>

                {/* Footer / Ação */}
                <div className="mt-auto flex items-center gap-2 text-xs font-bold text-indigo-400 opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                  <span>GERENCIAR ESTOQUE</span>
                  <FiArrowRight />
                </div>

                {/* Efeito de Fundo (Glow) */}
                <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-indigo-600/10 rounded-full blur-2xl group-hover:bg-indigo-600/20 transition-all" />
              </CardBody>
            </Card>
          ))}

          {/* Empty State */}
          {workspaces.length === 0 && (
            <div className="col-span-full py-20 flex flex-col items-center justify-center text-center border-2 border-dashed border-slate-800 rounded-3xl bg-slate-900/30">
              <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mb-4 opacity-50">
                <FiBox size={30} className="text-slate-400" />
              </div>
              <h3 className="text-lg font-bold text-slate-200">Nenhuma unidade encontrada</h3>
              <p className="text-slate-500 max-w-xs mt-2 text-sm">
                Cadastre sua primeira filial ou depósito para começar a controlar o inventário.
              </p>
            </div>
          )}
        </div>

      </div >
    </div >
  );
}