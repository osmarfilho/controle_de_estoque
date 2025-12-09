// src/middleware.ts

export { default } from "next-auth/middleware";

export const config = { 
    matcher: ["/dashboard/:path*", "/workspaces/:path*", "/api/products/:path*"] 
};