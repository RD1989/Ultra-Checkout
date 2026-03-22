# Ultra Checkout - Guia de Início Rápido

Parabéns! O código completo do **Ultra Checkout** já está nesta pasta. Siga os passos abaixo para rodar o sistema:

## 1. Instalar Dependências
Abra o terminal nesta pasta e execute:
```bash
npm install
```

## 2. Configurar o Banco de Dados
Certifique-se de ter um PostgreSQL rodando e configure a URL no arquivo `.env`:
```bash
# Crie um arquivo .env se não existir e adicione:
DATABASE_URL="postgresql://user:password@localhost:5432/ultra_checkout"
EFI_PIX_KEY="sua_chave_pix"
NEXTAUTH_SECRET="seu_segredo_aleatorio"
```

## 3. Preparar o Prisma
Execute as migrações para criar as tabelas:
```bash
npx prisma migrate dev --name init
```

## 4. Popular com Dados de Exemplo (Seed)
Execute o script de seed para criar seu primeiro produto e lojista:
```bash
npx ts-node seed.ts
```

## 5. Rodar o Projeto
Inicie o servidor de desenvolvimento:
```bash
npm run dev
```

Acesse o checkout em: `http://localhost:3000/ultra/pay/masterclass`
Acesse o admin em: `http://localhost:3000/login`

---
**Powered by Ultra Checkout | Built with Antigravity**
