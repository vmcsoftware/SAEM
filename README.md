# SAEM - Sistema de Agendamento de Ensaios Musicais

O SAEM é um sistema web para agendamento de ensaios musicais, onde músicos cadastrados recebem mensagens sobre ensaios e eventos para os quais foram escalados. O sistema envia mensagens automaticamente via WhatsApp nos dias da semana em que os músicos estão cadastrados.

## Funcionalidades

- Cadastro de músicos e organistas
- Agendamento de ensaios e eventos
- Escalação de músicos para ensaios e eventos
- Envio automático de mensagens via WhatsApp
- Interface administrativa para gerenciamento

## Tecnologias

- Frontend: HTML, CSS, JavaScript
- Backend: Node.js, Express
- Banco de Dados: Firebase Firestore
- API WhatsApp: WhatsApp Business API

## Instalação

1. Clone o repositório
2. Instale as dependências com `npm install`
3. Copie o arquivo `.env.example` para `.env` e configure as variáveis de ambiente do Firebase
4. Siga as instruções em `FIREBASE_CONFIG.md` para configurar seu projeto Firebase
5. Execute `node test-firebase-connection.js` para verificar a conexão com o Firebase
6. Inicie o servidor com `npm start` ou `npm run dev` para desenvolvimento

## Configuração do WhatsApp

1. Ao iniciar o servidor pela primeira vez, um QR code será exibido no terminal
2. Escaneie o QR code com seu WhatsApp para autenticar o sistema
3. A sessão será salva no diretório configurado em `WHATSAPP_SESSION_DATA_PATH`
4. Para reconectar o WhatsApp, acesse a página de notificações no painel administrativo

## Estrutura do Projeto

- `/public` - Arquivos estáticos (HTML, CSS, JavaScript)
- `/src` - Código fonte do backend
- `/src/config` - Configurações da aplicação (Firebase, etc.)
- `/src/models/firebase` - Modelos do banco de dados para o Firebase
- `/src/controllers` - Controladores da aplicação
- `/src/routes` - Rotas da API
- `/src/services` - Serviços da aplicação (envio de mensagens, etc.)
- `/src/middlewares` - Middlewares da aplicação (autenticação, etc.)

## Uso do Sistema

### Usuários e Permissões

- **Administrador**: Acesso completo ao sistema
- **Coordenador**: Gerencia músicos, ensaios e eventos
- **Usuário**: Visualiza agenda e confirma presença

## Documentação do Firebase

O projeto utiliza o Firebase Firestore como banco de dados. A seguinte documentação está disponível:

- `FIREBASE_CONFIG.md` - Guia detalhado de configuração do Firebase
- `GUIA_VISUAL_FIREBASE.md` - Exemplos visuais do processo de configuração
- `PASSOS_RAPIDOS_FIREBASE.md` - Guia rápido para configuração do Firebase
- `test-firebase-connection.js` - Script para testar a conexão com o Firebase

### Fluxo de Trabalho

1. **Cadastro de Músicos**: Adicione músicos e seus dias disponíveis
2. **Agendamento**: Crie ensaios e eventos
3. **Escalação**: Adicione músicos aos ensaios e eventos
4. **Notificações**: O sistema enviará mensagens automaticamente
   - Às 6h da manhã nos dias de ensaio/evento
   - Manualmente através do painel administrativo
5. **Confirmação**: Os músicos podem confirmar presença respondendo às mensagens

### Dicas

- Mantenha o WhatsApp conectado para garantir o envio de mensagens
- Verifique regularmente o status da conexão na página de notificações
- Configure corretamente os dias disponíveis dos músicos para facilitar a escalação