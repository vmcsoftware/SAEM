# Guia para Subir o Projeto SAEM para o GitHub

Este guia fornece instruções passo a passo para subir o projeto SAEM para o GitHub.

## Passo 1: Criar um arquivo .gitignore

Antes de inicializar o Git, vamos criar um arquivo `.gitignore` para evitar que arquivos desnecessários sejam enviados para o repositório:

1. Crie um arquivo chamado `.gitignore` na raiz do projeto
2. Adicione o seguinte conteúdo:

```
# Dependências
node_modules/

# Arquivos de ambiente
.env

# Logs
logs
*.log
npm-debug.log*

# Diretório de sessão do WhatsApp
whatsapp-session/

# Arquivos do sistema operacional
.DS_Store
Thumbs.db

# Arquivos de build
/dist
/build

# Outros
.vscode/
.idea/
*.swp
*.swo
```

## Passo 2: Inicializar o Git

1. Abra um terminal na pasta raiz do projeto
2. Execute os seguintes comandos:

```bash
# Inicializar o repositório Git
git init

# Adicionar todos os arquivos (exceto os ignorados pelo .gitignore)
git add .

# Fazer o primeiro commit
git commit -m "Versão inicial do SAEM - Sistema de Agendamento de Ensaios Musicais"
```

## Passo 3: Criar um repositório no GitHub

1. Acesse [GitHub](https://github.com/) e faça login na sua conta
2. Clique no botão "+" no canto superior direito e selecione "New repository"
3. Preencha as informações do repositório:
   - Nome do repositório: `saem` (ou outro nome de sua preferência)
   - Descrição: "Sistema de Agendamento de Ensaios Musicais com notificações via WhatsApp"
   - Visibilidade: Público ou Privado (conforme sua preferência)
4. Não inicialize o repositório com README, .gitignore ou licença, pois já temos esses arquivos
5. Clique em "Create repository"

## Passo 4: Conectar o repositório local ao GitHub

Após criar o repositório, o GitHub mostrará instruções. Siga as instruções para um repositório existente:

```bash
# Adicionar o repositório remoto (substitua 'seu-usuario' pelo seu nome de usuário do GitHub)
git remote add origin https://github.com/seu-usuario/saem.git

# Enviar o código para o GitHub (branch principal)
git branch -M main
git push -u origin main
```

## Passo 5: Verificar o repositório no GitHub

1. Acesse seu perfil no GitHub
2. Verifique se o repositório foi criado e se todos os arquivos foram enviados corretamente

## Dicas importantes

### Credenciais sensíveis

- O arquivo `.env` está no `.gitignore` para proteger suas credenciais
- Certifique-se de que o arquivo `.env.example` esteja atualizado com todas as variáveis necessárias (sem valores reais)

### Atualizações futuras

Para enviar atualizações futuras ao repositório:

```bash
# Adicionar alterações
git add .

# Fazer commit com mensagem descritiva
git commit -m "Descrição das alterações realizadas"

# Enviar para o GitHub
git push
```

### Colaboração

Se outras pessoas forem colaborar com o projeto:

1. Adicione-as como colaboradores no repositório do GitHub
2. Elas poderão clonar o repositório com:
   ```bash
   git clone https://github.com/seu-usuario/saem.git
   ```
3. Lembre-os de criar seu próprio arquivo `.env` com base no `.env.example`

## Solução de problemas

### Erro de autenticação no GitHub

Se você encontrar erros de autenticação ao fazer push:

1. Verifique se você está logado no GitHub
2. Considere usar um token de acesso pessoal ou SSH para autenticação
3. Consulte a [documentação do GitHub sobre autenticação](https://docs.github.com/en/authentication)

### Arquivos grandes

Se você tiver problemas com arquivos grandes:

1. Verifique se não há arquivos grandes que deveriam estar no `.gitignore`
2. Para arquivos grandes necessários, considere usar [Git LFS](https://git-lfs.github.com/)