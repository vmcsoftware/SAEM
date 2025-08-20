# Passos Rápidos para Configurar o Firebase

Siga estes passos para configurar rapidamente o Firebase para o SAEM:

## 1. Criar projeto no Firebase

1. Acesse o [Console do Firebase](https://console.firebase.google.com/) e faça login com sua conta Google
2. Clique em "Adicionar projeto" e dê um nome (ex: "SAEM")
3. Siga as instruções para criar o projeto

## 2. Configurar o Firestore Database

1. No menu lateral, clique em "Firestore Database"
2. Clique em "Criar banco de dados"
3. Escolha o modo de segurança (recomendado: modo de teste para desenvolvimento)
4. Selecione a região mais próxima

## 3. Configurar autenticação

1. No menu lateral, clique em "Authentication"
2. Clique em "Começar"
3. Ative o provedor "E-mail/senha"

## 4. Obter credenciais do Firebase

1. Na página inicial do projeto, clique no ícone da Web (</>) para adicionar um aplicativo
2. Registre o aplicativo com um nome (ex: "SAEM Web")
3. Copie o objeto `firebaseConfig` que contém suas credenciais

## 5. Configurar variáveis de ambiente

1. Copie o arquivo `.env.example` para `.env`
2. Preencha as variáveis do Firebase com as credenciais obtidas:

```
FIREBASE_API_KEY=AIzaSyBxLZ_JOlUbAiIUbq-zK015aP2D6av2mLw
FIREBASE_AUTH_DOMAIN=saem-d58b3.firebaseapp.com
FIREBASE_PROJECT_ID=saem-d58b3
FIREBASE_STORAGE_BUCKET=saem-d58b3.firebasestorage.app
FIREBASE_MESSAGING_SENDER_ID=1070231724858
FIREBASE_APP_ID=1:1070231724858:web:de8c28e3bd2a565e11e603
```

Este projeto já possui as credenciais configuradas conforme mostrado acima.

## 6. Instalar dependências do Firebase

```bash
npm install firebase firebase-admin
```

## 7. Iniciar o aplicativo

```bash
npm start
```

Pronto! Seu aplicativo SAEM agora está configurado para usar o Firebase como banco de dados.