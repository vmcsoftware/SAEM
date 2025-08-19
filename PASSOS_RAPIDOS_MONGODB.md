# Passos Rápidos para Configurar o MongoDB Atlas

Siga estes passos para configurar rapidamente o MongoDB Atlas para o SAEM:

## 1. Criar conta e cluster no MongoDB Atlas

1. Acesse [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register) e crie uma conta
2. Crie um cluster gratuito (Shared)
3. Escolha um provedor de nuvem e região (ex: AWS / São Paulo)

## 2. Configurar acesso

1. Crie um usuário de banco de dados (ex: `saem_admin` com uma senha forte)
2. Configure o acesso à rede (adicione seu IP ou permita acesso de qualquer lugar com 0.0.0.0/0)

## 3. Obter string de conexão

1. Clique em "Connect" no seu cluster
2. Selecione "Connect your application"
3. Copie a string de conexão fornecida

## 4. Atualizar o arquivo .env

Abra o arquivo `.env` e atualize a variável `MONGODB_URI` com sua string de conexão:

```
MONGODB_URI=mongodb+srv://seu_usuario_real:sua_senha_real@seu_cluster_real.mongodb.net/saem?retryWrites=true&w=majority
```

Substitua:
- `seu_usuario_real` pelo nome de usuário que você criou
- `sua_senha_real` pela senha que você definiu
- `seu_cluster_real` pelo nome do seu cluster (geralmente algo como `cluster0.abcde`)

## 5. Testar a conexão

Execute o script de teste:

```
node test-mongodb-connection.js
```

Se tudo estiver configurado corretamente, você verá a mensagem "Conexão com o MongoDB estabelecida com sucesso!"

## 6. Iniciar o servidor

Após confirmar que a conexão está funcionando, inicie o servidor:

```
npm run dev
```

---

Para instruções mais detalhadas, consulte os arquivos:
- `MONGODB_ATLAS.md` - Guia detalhado de configuração
- `GUIA_VISUAL_MONGODB_ATLAS.md` - Exemplos visuais do processo