import mongoose, { Schema, model, models } from 'mongoose';

const UserSchema = new Schema({
  name: {
    type: String,
    required: [true, 'O nome é obrigatório'],
  },
  email: {
    type: String,
    required: [true, 'O email é obrigatório'],
    unique: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Por favor, insira um email válido',
    ],
  },
  password: {
    type: String,
    required: [true, 'A senha é obrigatória'],
    select: false, // Não retornar a senha por padrão nas consultas
  },
  // RENOMEADO: 'workspaces' -> 'locations'
  locations: { 
    type: [{
      name: { type: String, required: true },
      description: { type: String, default: "" },
      icon: { type: String, default: "warehouse" } // Novo ícone e tema
    }],
    default: [
      // Valores padrões ajustados para o tema de estoque
      { name: "Depósito Central", description: "Estoque principal", icon: "warehouse" },
      { name: "Filial Norte", description: "Unidade de distribuição", icon: "truck" },
      { name: "Escritório", description: "Itens administrativos", icon: "briefcase" }
    ],
  },
  // RENOMEADO: 'activeWorkspace' -> 'activeLocation'
  activeLocation: { 
    type: String,
    default: "Depósito Central", // Novo valor padrão
  },
}, {
  timestamps: true,
});

const User = models.User || model('User', UserSchema);

export default User;