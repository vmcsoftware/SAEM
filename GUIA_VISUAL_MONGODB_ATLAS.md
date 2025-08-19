# Guia Visual: Configurando MongoDB Atlas para o SAEM

Este guia visual complementa as instruções detalhadas no arquivo `MONGODB_ATLAS.md`, fornecendo exemplos visuais do processo de configuração.

## 1. Criando uma conta e um cluster

```
+-----------------------------------------------+
|                                               |
|  1. Acesse mongodb.com/cloud/atlas           |
|  2. Clique em "Try Free"                     |
|                                               |
|  +---------------------------------------+    |
|  |                                       |    |
|  |       [Formulário de Registro]        |    |
|  |                                       |    |
|  |  Email: seu@email.com                 |    |
|  |  Senha: **********                    |    |
|  |                                       |    |
|  |         [Criar Conta]                 |    |
|  +---------------------------------------+    |
|                                               |
+-----------------------------------------------+
```

## 2. Configurando o primeiro cluster

```
+-----------------------------------------------+
|                                               |
|  [Tela de Criação de Cluster]                 |
|                                               |
|  Selecione: Shared (Gratuito)                 |
|                                               |
|  Provedor de Nuvem:                           |
|  [x] AWS  [ ] Google Cloud  [ ] Azure         |
|                                               |
|  Região: São Paulo (sa-east-1)                |
|                                               |
|  Nome do Cluster: Cluster0                    |
|                                               |
|           [Criar Cluster]                     |
|                                               |
+-----------------------------------------------+
```

## 3. Configurando usuário do banco de dados

```
+-----------------------------------------------+
|                                               |
|  [Security Quickstart]                        |
|                                               |
|  Método de Autenticação:                      |
|  [x] Username and Password                    |
|                                               |
|  Username: saem_admin                         |
|  Password: SuaSenhaSegura123                  |
|                                               |
|  Database User Privileges:                    |
|  [x] Read and write to any database           |
|                                               |
|           [Create User]                       |
|                                               |
+-----------------------------------------------+
```

## 4. Configurando acesso à rede

```
+-----------------------------------------------+
|                                               |
|  [Network Access]                             |
|                                               |
|  IP Access List:                              |
|                                               |
|  [ ] IP Address                               |
|  [x] Allow Access from Anywhere               |
|      (0.0.0.0/0)                             |
|                                               |
|  Comentário: Desenvolvimento                  |
|                                               |
|           [Confirm]                          |
|                                               |
+-----------------------------------------------+
```

## 5. Obtendo a string de conexão

```
+-----------------------------------------------+
|                                               |
|  [Database Deployments]                       |
|                                               |
|  Cluster0                                     |
|  Status: Active                               |
|                                               |
|           [Connect]                           |
|                                               |
|  [Connect to Cluster0]                        |
|                                               |
|  [x] Connect your application                 |
|                                               |
|  Driver: Node.js                              |
|  Version: 4.0 or later                        |
|                                               |
|  Connection String:                           |
|  mongodb+srv://<username>:<password>          |
|  @cluster0.abcde.mongodb.net/?retryWrites=   |
|  true&w=majority                             |
|                                               |
+-----------------------------------------------+
```

## 6. Configurando o arquivo .env

```
+-----------------------------------------------+
|                                               |
|  # Arquivo .env                               |
|                                               |
|  # Configurações do MongoDB                   |
|  MONGODB_URI=mongodb+srv://saem_admin:        |
|  SuaSenhaSegura123@cluster0.abcde.mongodb.net/|
|  saem?retryWrites=true&w=majority             |
|                                               |
+-----------------------------------------------+
```

## 7. Verificando a conexão bem-sucedida

```
+-----------------------------------------------+
|                                               |
|  [Terminal]                                   |
|                                               |
|  $ npm run dev                                |
|                                               |
|  > saem@1.0.0 dev                             |
|  > nodemon src/index.js                       |
|                                               |
|  [nodemon] starting `node src/index.js`       |
|  Conectado ao MongoDB                         |
|  Servidor rodando na porta 3000               |
|  Serviço WhatsApp iniciado                    |
|                                               |
+-----------------------------------------------+
```

## 8. Verificando o banco de dados no MongoDB Atlas

```
+-----------------------------------------------+
|                                               |
|  [MongoDB Atlas - Collections]                |
|                                               |
|  Database: saem                               |
|                                               |
|  Collections:                                 |
|  - users                                      |
|  - musicians                                  |
|  - rehearsals                                 |
|  - events                                     |
|                                               |
+-----------------------------------------------+
```

## Dicas importantes

1. **Salve suas credenciais** em um local seguro
2. **Não compartilhe** sua string de conexão ou senha
3. Para **ambiente de produção**, restrinja o acesso IP
4. Verifique a **região** do cluster para minimizar latência
5. O plano **gratuito** do MongoDB Atlas é suficiente para começar com o SAEM

## Próximos passos

Após configurar o MongoDB Atlas com sucesso:

1. Inicie o servidor com `npm run dev`
2. Acesse o sistema em `http://localhost:3000`
3. Crie um usuário administrador
4. Configure o WhatsApp escaneando o QR code
5. Comece a cadastrar músicos e agendar ensaios