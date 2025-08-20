# Guia Visual: Configurando Firebase para o SAEM

Este guia visual complementa as instruções detalhadas no arquivo `FIREBASE_CONFIG.md`, fornecendo exemplos visuais do processo de configuração.

## 1. Criando um projeto no Firebase

```
+-----------------------------------------------+
|                                               |
|  1. Acesse console.firebase.google.com       |
|  2. Clique em "Adicionar projeto"             |
|                                               |
|    +-----------------------------------+      |
|    |                                   |      |
|    |      Adicionar projeto           |      |
|    |                                   |      |
|    +-----------------------------------+      |
|                                               |
+-----------------------------------------------+
```

## 2. Configurando o Firestore Database

```
+-----------------------------------------------+
|                                               |
|  1. No menu lateral, clique em               |
|     "Firestore Database"                      |
|                                               |
|    +-----------------------------------+      |
|    |                                   |      |
|    |      Criar banco de dados        |      |
|    |                                   |      |
|    +-----------------------------------+      |
|                                               |
|  2. Escolha o modo de segurança              |
|                                               |
|    [X] Modo de produção                      |
|    [ ] Modo de teste                         |
|                                               |
+-----------------------------------------------+
```

## 3. Configurando a autenticação

```
+-----------------------------------------------+
|                                               |
|  1. No menu lateral, clique em               |
|     "Authentication"                          |
|                                               |
|  2. Clique em "Começar"                       |
|                                               |
|  3. Selecione "E-mail/senha"                  |
|                                               |
|    +-----------------------------------+      |
|    |                                   |      |
|    |  [X] E-mail/senha    Ativado >   |      |
|    |                                   |      |
|    +-----------------------------------+      |
|                                               |
+-----------------------------------------------+
```

## 4. Criando um aplicativo Web

```
+-----------------------------------------------+
|                                               |
|  1. Na página inicial do projeto,             |
|     clique no ícone da Web                    |
|                                               |
|    +-----------------------------------+      |
|    |                                   |      |
|    |           </> Web                |      |
|    |                                   |      |
|    +-----------------------------------+      |
|                                               |
|  2. Registre seu aplicativo                   |
|                                               |
|     Nome do app: SAEM Web                     |
|     [ ] Configurar Firebase Hosting           |
|                                               |
|     [Registrar aplicativo]                    |
|                                               |
+-----------------------------------------------+
```

## 5. Obtendo as credenciais do Firebase

```
+-----------------------------------------------+
|                                               |
|  Após registrar o aplicativo, você verá       |
|  um código como este:                         |
|                                               |
|  const firebaseConfig = {                     |
|    apiKey: "AIzaSyA1b2C3d4e5F6g7H8i9J0k1L2", |
|    authDomain: "saem.firebaseapp.com",       |
|    projectId: "saem",                        |
|    storageBucket: "saem.appspot.com",        |
|    messagingSenderId: "1234567890",          |
|    appId: "1:1234567890:web:a1b2c3d4e5f6"    |
|  };                                           |
|                                               |
|  Copie estas informações para o arquivo .env  |
|                                               |
+-----------------------------------------------+
```

## 6. Configurando as regras de segurança

```
+-----------------------------------------------+
|                                               |
|  1. No menu lateral, clique em               |
|     "Firestore Database" e depois em "Regras" |
|                                               |
|  2. Configure as regras:                      |
|                                               |
|  rules_version = '2';                         |
|  service cloud.firestore {                    |
|    match /databases/{database}/documents {    |
|      match /{document=**} {                   |
|        allow read, write: if request.auth != null; |
|      }                                        |
|    }                                          |
|  }                                            |
|                                               |
|  [Publicar]                                   |
|                                               |
+-----------------------------------------------+
```

## 7. Estrutura de coleções no Firestore

```
+-----------------------------------------------+
|                                               |
|  Estrutura recomendada para o SAEM:           |
|                                               |
|  users/                                       |
|    └── userId1/                               |
|        ├── name: "Nome do Usuário"            |
|        ├── email: "email@exemplo.com"         |
|        └── role: "admin"                      |
|                                               |
|  musicians/                                   |
|    └── musicianId1/                           |
|        ├── name: "Nome do Músico"             |
|        ├── instrument: "Violino"              |
|        └── availableDays: ["segunda", "quarta"] |
|                                               |
|  events/                                      |
|    └── eventId1/                              |
|        ├── title: "Concerto de Natal"         |
|        ├── date: "2023-12-25"                 |
|        └── musicians: ["musicianId1", ...]    |
|                                               |
|  rehearsals/                                  |
|    └── rehearsalId1/                          |
|        ├── title: "Ensaio Geral"              |
|        ├── date: "2023-12-20"                 |
|        └── musicians: ["musicianId1", ...]    |
|                                               |
+-----------------------------------------------+
```

Este guia visual deve ajudar na configuração do Firebase para o SAEM. Para instruções mais detalhadas, consulte o arquivo `FIREBASE_CONFIG.md`.