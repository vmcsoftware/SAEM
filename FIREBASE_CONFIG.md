# Configuração do Firebase para o SAEM

Este guia explica como configurar o Firebase para o Sistema de Agendamento de Ensaios Musicais (SAEM).

## Passo 1: Criar um projeto no Firebase

1. Acesse o [Console do Firebase](https://console.firebase.google.com/)
2. Clique em "Adicionar projeto"
3. Digite um nome para o projeto (por exemplo, "SAEM")
4. Escolha se deseja ativar o Google Analytics (opcional)
5. Clique em "Criar projeto"

## Passo 2: Configurar o Firestore Database

1. No menu lateral do console do Firebase, clique em "Firestore Database"
2. Clique em "Criar banco de dados"
3. Selecione o modo "Iniciar no modo de produção" ou "Iniciar no modo de teste" (recomendado para desenvolvimento)
4. Escolha a região mais próxima da sua localização
5. Clique em "Ativar"

## Passo 3: Configurar a autenticação

1. No menu lateral, clique em "Authentication"
2. Clique em "Começar"
3. Ative o provedor de autenticação "E-mail/senha"
4. Clique em "Salvar"

## Passo 4: Criar um aplicativo Web

1. Na página inicial do projeto, clique no ícone da Web (</>) para adicionar um aplicativo da Web
2. Digite um nome para o aplicativo (por exemplo, "SAEM Web")
3. Marque a opção "Também configurar o Firebase Hosting" se desejar (opcional)
4. Clique em "Registrar aplicativo"
5. Você verá um código de configuração com suas credenciais do Firebase. Anote essas informações para usar no arquivo .env

## Passo 5: Configurar as variáveis de ambiente

1. Copie o arquivo `.env.example` para `.env`
2. Preencha as variáveis de ambiente do Firebase com as informações obtidas no passo anterior:

```
FIREBASE_API_KEY=AIzaSyBxLZ_JOlUbAiIUbq-zK015aP2D6av2mLw
FIREBASE_AUTH_DOMAIN=saem-d58b3.firebaseapp.com
FIREBASE_PROJECT_ID=saem-d58b3
FIREBASE_STORAGE_BUCKET=saem-d58b3.firebasestorage.app
FIREBASE_MESSAGING_SENDER_ID=1070231724858
FIREBASE_APP_ID=1:1070231724858:web:de8c28e3bd2a565e11e603
```

Este projeto já possui as credenciais configuradas conforme mostrado acima.

## Passo 6: Regras de segurança do Firestore

1. No menu lateral, clique em "Firestore Database" e depois na aba "Regras"
2. Configure as regras de segurança de acordo com as necessidades do seu aplicativo. Por exemplo:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

Esta regra permite que apenas usuários autenticados leiam e escrevam no banco de dados.

## Passo 7: Instalar o SDK do Firebase

Certifique-se de que as dependências do Firebase estão instaladas no projeto:

```bash
npm install firebase firebase-admin
```

Agora seu projeto SAEM está configurado para usar o Firebase como banco de dados!