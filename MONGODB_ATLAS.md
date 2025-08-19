# Configuração do MongoDB Atlas para o SAEM

Este guia explica como configurar o MongoDB Atlas para o Sistema de Agendamento de Ensaios Musicais (SAEM).

## Passo 1: Criar uma conta no MongoDB Atlas

1. Acesse [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register)
2. Crie uma conta gratuita ou faça login se já tiver uma
3. Você pode se registrar com Google, GitHub ou criar uma conta com e-mail e senha

## Passo 2: Criar um cluster

1. Após fazer login, clique em "Build a Database"
2. Escolha a opção gratuita (Free Shared)
3. Selecione um provedor de nuvem (AWS, Google Cloud ou Azure) e uma região próxima à sua localização (por exemplo, AWS / São Paulo)
4. Deixe as configurações padrão para o cluster e clique em "Create"
5. A criação do cluster pode levar alguns minutos

## Passo 3: Configurar acesso ao banco de dados

1. Enquanto o cluster é criado, você será direcionado para configurar a segurança
2. Na seção "Security Quickstart", escolha "Username and Password" como método de autenticação
3. Crie um nome de usuário e senha para acessar o banco de dados
   - Exemplo: Username: `saem_admin`, Password: `SuaSenhaSegura123`
   - **IMPORTANTE**: Anote essas credenciais, você precisará delas para a string de conexão
4. Clique em "Create User"

## Passo 4: Configurar acesso à rede

1. Na mesma tela de "Security Quickstart", vá para a seção "Where would you like to connect from?"
2. Para desenvolvimento, selecione "My Local Environment"
3. Clique em "Add My Current IP Address" para adicionar seu IP atual
4. Alternativamente, você pode selecionar "Allow Access from Anywhere" (0.0.0.0/0) para desenvolvimento
   - **Nota**: Para ambientes de produção, é recomendável restringir o acesso apenas aos IPs necessários
5. Clique em "Finish and Close"

## Passo 5: Obter a string de conexão

1. Após a criação do cluster, clique em "Connect" no seu cluster
2. Selecione "Connect your application"
3. Certifique-se de que "Node.js" está selecionado como driver e a versão mais recente
4. Copie a string de conexão fornecida, que será semelhante a:
   ```
   mongodb+srv://<username>:<password>@cluster0.abcde.mongodb.net/?retryWrites=true&w=majority
   ```

## Passo 6: Configurar o arquivo .env

1. Abra o arquivo `.env` na raiz do projeto SAEM
2. Localize a variável `MONGODB_URI`
3. Substitua o valor atual pela string de conexão obtida no Passo 5
4. Faça as seguintes substituições na string:
   - Substitua `<username>` pelo nome de usuário que você criou (ex: `saem_admin`)
   - Substitua `<password>` pela senha que você criou
   - Adicione `/saem` após o domínio e antes dos parâmetros de consulta para especificar o nome do banco de dados

Exemplo de como deve ficar:
```
MONGODB_URI=mongodb+srv://saem_admin:SuaSenhaSegura123@cluster0.abcde.mongodb.net/saem?retryWrites=true&w=majority
```

## Passo 7: Testar a conexão

1. Abra um terminal na pasta raiz do projeto
2. Execute o comando para iniciar o servidor:
   ```
   npm run dev
   ```
3. Observe o console e verifique se aparece a mensagem "Conectado ao MongoDB"
4. Se a conexão for bem-sucedida, você verá mensagens indicando que o servidor está rodando e conectado ao banco de dados

## Passo 8: Verificar a criação do banco de dados

1. Volte ao MongoDB Atlas no navegador
2. No menu lateral, clique em "Database"
3. Clique no nome do seu cluster
4. Na seção "Collections", você deverá ver o banco de dados "saem" após a primeira execução do aplicativo
5. Inicialmente, o banco de dados estará vazio, mas as coleções serão criadas automaticamente conforme você utiliza o sistema

## Solução de problemas

### Erro de autenticação
- Mensagem: "MongoServerError: Authentication failed"
- Solução: Verifique se o nome de usuário e senha estão corretos na string de conexão
- Certifique-se de que não há caracteres especiais na senha que precisem ser codificados na URL

### Erro de conexão
- Mensagem: "MongoNetworkError: failed to connect to server"
- Solução: Verifique se o IP foi adicionado corretamente na lista de IPs permitidos
- Tente adicionar "0.0.0.0/0" temporariamente para verificar se é um problema de IP

### Erro de timeout
- Mensagem: "MongoTimeoutError: Server selection timed out"
- Solução: Verifique sua conexão com a internet
- Verifique se há firewalls ou proxies bloqueando a conexão

### Erro de nome de banco de dados
- Certifique-se de que a string de conexão inclui "/saem" para especificar o nome do banco de dados

## Recursos adicionais

- [Documentação do MongoDB Atlas](https://docs.atlas.mongodb.com/)
- [Documentação do Mongoose](https://mongoosejs.com/docs/)
- [Guia de solução de problemas do MongoDB](https://docs.mongodb.com/manual/reference/connection-string/)
- [Fórum da comunidade MongoDB](https://www.mongodb.com/community/forums/)