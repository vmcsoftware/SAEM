/**
 * Script para testar a conexão com o MongoDB Atlas
 * 
 * Execute este script com o comando:
 * node test-mongodb-connection.js
 */

require('dotenv').config();
const mongoose = require('mongoose');

// Obtém a URI de conexão do MongoDB das variáveis de ambiente
const mongoURI = process.env.MONGODB_URI;

if (!mongoURI) {
  console.error('Erro: A variável de ambiente MONGODB_URI não está definida.');
  console.error('Verifique se o arquivo .env existe e contém a configuração correta.');
  process.exit(1);
}

console.log('Tentando conectar ao MongoDB...');
console.log(`URI: ${mongoURI.replace(/\x2F\x2F([^:]+):([^@]+)@/, '\x2F\x2F\x5C1:****@')}`);

// Opções de conexão
const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

// Tenta conectar ao MongoDB
mongoose.connect(mongoURI, options)
  .then(() => {
    console.log('✅ Conexão com o MongoDB estabelecida com sucesso!');
    console.log('✅ Banco de dados está acessível e funcionando corretamente.');
    
    // Lista as coleções disponíveis
    mongoose.connection.db.listCollections().toArray()
      .then(collections => {
        if (collections.length === 0) {
          console.log('ℹ️ O banco de dados está vazio. Nenhuma coleção encontrada.');
          console.log('ℹ️ Isso é normal se você acabou de configurar o banco de dados.');
          console.log('ℹ️ As coleções serão criadas automaticamente quando você usar o sistema.');
        } else {
          console.log('\nColeções disponíveis no banco de dados:');
          collections.forEach(collection => {
            console.log(`- ${collection.name}`);
          });
        }
        
        // Fecha a conexão após o teste
        mongoose.connection.close()
          .then(() => {
            console.log('\nConexão fechada.');
            process.exit(0);
          });
      })
      .catch(err => {
        console.error('Erro ao listar coleções:', err);
        mongoose.connection.close();
        process.exit(1);
      });
  })
  .catch(err => {
    console.error('❌ Erro ao conectar ao MongoDB:');
    console.error(err);
    
    // Fornece dicas com base no tipo de erro
    if (err.name === 'MongoServerSelectionError') {
      console.log('\nDicas para resolver o problema:');
      console.log('1. Verifique se a string de conexão está correta no arquivo .env');
      console.log('2. Verifique se você substituiu <username>, <password> e adicionou /saem na URI');
      console.log('3. Verifique se o seu IP foi adicionado à lista de IPs permitidos no MongoDB Atlas');
      console.log('4. Verifique se você tem conexão com a internet');
    } else if (err.name === 'MongoError' && err.code === 18) {
      console.log('\nErro de autenticação:');
      console.log('1. Verifique se o nome de usuário e senha estão corretos');
      console.log('2. Verifique se o usuário tem permissões para acessar o banco de dados');
    }
    
    console.log('\nConsulte o arquivo MONGODB_ATLAS.md para mais informações sobre como configurar o MongoDB Atlas.');
    process.exit(1);
  });