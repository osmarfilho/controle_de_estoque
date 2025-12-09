// src/app/api/auth/[...nextauth]/route.ts
import NextAuth, { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import connectDB from "@/lib/db";
import User from "@/models/user";
import bcrypt from "bcryptjs";

// Verifica a variável de ambiente (NECESSÁRIO para produção)
if (!process.env.NEXTAUTH_SECRET) {
    console.error("ERRO FATAL: NEXTAUTH_SECRET não está definido.");
    // Em um ambiente de produção, você pode considerar interromper o processo ou usar um valor padrão seguro
}

export const authOptions: AuthOptions = {
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                // 1. Validar dados de entrada
                if (!credentials?.email || !credentials?.password) {
                    // Não lança erro, retorna null. Isso faz o NextAuth falhar o login silenciosamente.
                    return null; 
                }

                try {
                    await connectDB();
                } catch (dbError) {
                    console.error("Erro de conexão com o Banco de Dados:", dbError);
                    // Lançar erro aqui é aceitável, pois é um erro interno do servidor
                    throw new Error("Falha na conexão com o servidor de autenticação.");
                }

                // 2. Buscar o usuário e forçar a seleção da senha
                const user = await User.findOne({ email: credentials.email }).select("+password");

                if (!user) {
                    return null; // Usuário não encontrado
                }

                // 3. Comparar a senha (usando 'isMatch' ou 'isPasswordCorrect')
                const isMatch = await bcrypt.compare(credentials.password, user.password);

                if (!isMatch) {
                    return null; // Senha incorreta
                }

                // 4. Sucesso: Retornar um objeto de usuário (sem a senha)
                // Usar toObject() é uma boa prática com Mongoose
                const userObject = user.toObject();
                // Omitir a senha antes de retornar
                delete userObject.password; 
                
                return { id: userObject._id.toString(), name: userObject.name, email: userObject.email };
            }
        })
    ],
    // ... restante da configuração (session, callbacks, secret, pages)
    session: {
        strategy: "jwt",
    },
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
            }
            return token;
        },
        async session({ session, token }) {
            if (session.user) {
                session.user.id = token.id as string;
            }
            return session;
        },
    },
    secret: process.env.NEXTAUTH_SECRET,
    pages: {
        signIn: "/login",
    }
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };