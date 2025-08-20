const { db } = require('../../config/firebaseConfig');
const { collection, doc, getDoc, getDocs, addDoc, updateDoc, deleteDoc, query, where } = require('firebase/firestore');
const bcrypt = require('bcryptjs');

const COLLECTION_NAME = 'users';

class User {
  /**
   * Cria um novo usuário
   * @param {Object} userData - Dados do usuário
   * @returns {Promise<Object>} - Usuário criado
   */
  static async create(userData) {
    try {
      // Hash da senha
      const hashedPassword = await bcrypt.hash(userData.password, 8);
      
      // Preparar dados do usuário
      const user = {
        name: userData.name,
        email: userData.email.toLowerCase(),
        password: hashedPassword,
        role: userData.role || 'user',
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      // Verificar se o email já existe
      const emailExists = await this.findByEmail(user.email);
      if (emailExists) {
        throw new Error('Email já está em uso');
      }
      
      // Adicionar usuário ao Firestore
      const docRef = await addDoc(collection(db, COLLECTION_NAME), user);
      
      // Retornar usuário criado (sem a senha)
      const { password, ...userWithoutPassword } = user;
      return { id: docRef.id, ...userWithoutPassword };
    } catch (error) {
      throw error;
    }
  }
  
  /**
   * Busca um usuário pelo ID
   * @param {string} id - ID do usuário
   * @returns {Promise<Object|null>} - Usuário encontrado ou null
   */
  static async findById(id) {
    try {
      const docRef = doc(db, COLLECTION_NAME, id);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        const userData = docSnap.data();
        const { password, ...userWithoutPassword } = userData;
        return { id: docSnap.id, ...userWithoutPassword };
      }
      
      return null;
    } catch (error) {
      throw error;
    }
  }
  
  /**
   * Busca um usuário pelo email
   * @param {string} email - Email do usuário
   * @returns {Promise<Object|null>} - Usuário encontrado ou null
   */
  static async findByEmail(email) {
    try {
      const q = query(
        collection(db, COLLECTION_NAME),
        where('email', '==', email.toLowerCase())
      );
      
      const querySnapshot = await getDocs(q);
      
      if (!querySnapshot.empty) {
        const doc = querySnapshot.docs[0];
        return { id: doc.id, ...doc.data() };
      }
      
      return null;
    } catch (error) {
      throw error;
    }
  }
  
  /**
   * Verifica as credenciais do usuário
   * @param {string} email - Email do usuário
   * @param {string} password - Senha do usuário
   * @returns {Promise<Object|null>} - Usuário autenticado ou null
   */
  static async authenticate(email, password) {
    try {
      const user = await this.findByEmail(email);
      
      if (!user) {
        return null;
      }
      
      const isMatch = await bcrypt.compare(password, user.password);
      
      if (!isMatch) {
        return null;
      }
      
      const { password: userPassword, ...userWithoutPassword } = user;
      return userWithoutPassword;
    } catch (error) {
      throw error;
    }
  }
  
  /**
   * Atualiza um usuário
   * @param {string} id - ID do usuário
   * @param {Object} updateData - Dados a serem atualizados
   * @returns {Promise<Object>} - Usuário atualizado
   */
  static async update(id, updateData) {
    try {
      const docRef = doc(db, COLLECTION_NAME, id);
      const docSnap = await getDoc(docRef);
      
      if (!docSnap.exists()) {
        throw new Error('Usuário não encontrado');
      }
      
      const userData = docSnap.data();
      
      // Preparar dados para atualização
      const updates = { ...updateData, updatedAt: new Date() };
      
      // Se a senha estiver sendo atualizada, fazer o hash
      if (updates.password) {
        updates.password = await bcrypt.hash(updates.password, 8);
      }
      
      // Atualizar usuário no Firestore
      await updateDoc(docRef, updates);
      
      // Retornar usuário atualizado
      const updatedUser = { ...userData, ...updates };
      const { password, ...userWithoutPassword } = updatedUser;
      
      return { id, ...userWithoutPassword };
    } catch (error) {
      throw error;
    }
  }
  
  /**
   * Remove um usuário
   * @param {string} id - ID do usuário
   * @returns {Promise<boolean>} - true se removido com sucesso
   */
  static async delete(id) {
    try {
      const docRef = doc(db, COLLECTION_NAME, id);
      const docSnap = await getDoc(docRef);
      
      if (!docSnap.exists()) {
        throw new Error('Usuário não encontrado');
      }
      
      await deleteDoc(docRef);
      return true;
    } catch (error) {
      throw error;
    }
  }
  
  /**
   * Lista todos os usuários
   * @returns {Promise<Array>} - Lista de usuários
   */
  static async findAll() {
    try {
      const querySnapshot = await getDocs(collection(db, COLLECTION_NAME));
      
      return querySnapshot.docs.map(doc => {
        const userData = doc.data();
        const { password, ...userWithoutPassword } = userData;
        return { id: doc.id, ...userWithoutPassword };
      });
    } catch (error) {
      throw error;
    }
  }
}

module.exports = User;