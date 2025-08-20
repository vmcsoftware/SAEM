// Script para testar a conexão com o Firebase
require('dotenv').config();
const { initializeApp } = require('firebase/app');
const { getFirestore, collection, addDoc, getDocs, doc, deleteDoc } = require('firebase/firestore');

// Verificar se as variáveis de ambiente do Firebase estão configuradas
const requiredEnvVars = [
  'FIREBASE_API_KEY',
  'FIREBASE_AUTH_DOMAIN',
  'FIREBASE_PROJECT_ID',
  'FIREBASE_STORAGE_BUCKET',
  'FIREBASE_MESSAGING_SENDER_ID',
  'FIREBASE_APP_ID'
];

const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);

if (missingVars.length > 0) {
  console.error('❌ Erro: As seguintes variáveis de ambiente do Firebase estão faltando:');
  missingVars.forEach(varName => console.error(`   - ${varName}`));
  console.error('\nVerifique seu arquivo .env e tente novamente.');
  process.exit(1);
}

// Configuração do Firebase
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID
};

// Inicializar o Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Função para testar a conexão com o Firestore
async function testFirebaseConnection() {
  console.log('🔄 Testando conexão com o Firebase Firestore...');
  
  try {
    // Tentar escrever um documento de teste
    const testCollection = collection(db, 'test_connection');
    const testDoc = await addDoc(testCollection, {
      message: 'Teste de conexão',
      timestamp: new Date().toISOString()
    });
    
    console.log('✅ Documento de teste criado com sucesso!');
    console.log(`   ID do documento: ${testDoc.id}`);
    
    // Listar coleções para verificar a conexão
    console.log('\n📋 Listando coleções disponíveis:');
    
    // Obter documentos da coleção de teste
    const querySnapshot = await getDocs(collection(db, 'test_connection'));
    console.log(`   - test_connection (${querySnapshot.size} documentos)`);
    
    // Listar outras coleções (se existirem)
    try {
      const collections = ['users', 'musicians', 'events', 'rehearsals'];
      for (const collName of collections) {
        const collSnapshot = await getDocs(collection(db, collName));
        console.log(`   - ${collName} (${collSnapshot.size} documentos)`);
      }
    } catch (err) {
      // Ignorar erros ao listar outras coleções
    }
    
    // Limpar o documento de teste
    await deleteDoc(doc(db, 'test_connection', testDoc.id));
    console.log('\n🧹 Documento de teste removido com sucesso!');
    
    console.log('\n✅ Conexão com o Firebase Firestore estabelecida com sucesso!');
  } catch (error) {
    console.error('\n❌ Erro ao conectar com o Firebase Firestore:');
    console.error(error);
    
    console.log('\n🔍 Dicas de depuração:');
    console.log('1. Verifique se as credenciais do Firebase no arquivo .env estão corretas');
    console.log('2. Confirme se o projeto do Firebase está criado e ativo');
    console.log('3. Verifique se o Firestore Database está habilitado no console do Firebase');
    console.log('4. Confirme se as regras de segurança do Firestore permitem leitura/escrita');
    process.exit(1);
  }
}

// Executar o teste
testFirebaseConnection();