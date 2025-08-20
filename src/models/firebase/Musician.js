const { db } = require('../../config/firebaseConfig');
const { collection, doc, getDoc, getDocs, addDoc, updateDoc, deleteDoc, query, where } = require('firebase/firestore');

const COLLECTION_NAME = 'musicians';

class Musician {
  /**
   * Cria um novo músico
   * @param {Object} musicianData - Dados do músico
   * @returns {Promise<Object>} - Músico criado
   */
  static async create(musicianData) {
    try {
      // Preparar dados do músico
      const musician = {
        name: musicianData.name,
        phone: musicianData.phone,
        instrument: musicianData.instrument,
        isOrganist: musicianData.isOrganist || false,
        availableDays: musicianData.availableDays || {
          sunday: false,
          monday: false,
          tuesday: false,
          wednesday: false,
          thursday: false,
          friday: false,
          saturday: false
        },
        active: true,
        notes: musicianData.notes || '',
        user: musicianData.user || null,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      // Adicionar músico ao Firestore
      const docRef = await addDoc(collection(db, COLLECTION_NAME), musician);
      
      return { id: docRef.id, ...musician };
    } catch (error) {
      throw error;
    }
  }
  
  /**
   * Busca um músico pelo ID
   * @param {string} id - ID do músico
   * @returns {Promise<Object|null>} - Músico encontrado ou null
   */
  static async findById(id) {
    try {
      const docRef = doc(db, COLLECTION_NAME, id);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() };
      }
      
      return null;
    } catch (error) {
      throw error;
    }
  }
  
  /**
   * Atualiza um músico
   * @param {string} id - ID do músico
   * @param {Object} updateData - Dados a serem atualizados
   * @returns {Promise<Object>} - Músico atualizado
   */
  static async update(id, updateData) {
    try {
      const docRef = doc(db, COLLECTION_NAME, id);
      const docSnap = await getDoc(docRef);
      
      if (!docSnap.exists()) {
        throw new Error('Músico não encontrado');
      }
      
      // Preparar dados para atualização
      const updates = { ...updateData, updatedAt: new Date() };
      
      // Atualizar músico no Firestore
      await updateDoc(docRef, updates);
      
      // Retornar músico atualizado
      return { id, ...docSnap.data(), ...updates };
    } catch (error) {
      throw error;
    }
  }
  
  /**
   * Remove um músico
   * @param {string} id - ID do músico
   * @returns {Promise<boolean>} - true se removido com sucesso
   */
  static async delete(id) {
    try {
      const docRef = doc(db, COLLECTION_NAME, id);
      const docSnap = await getDoc(docRef);
      
      if (!docSnap.exists()) {
        throw new Error('Músico não encontrado');
      }
      
      await deleteDoc(docRef);
      return true;
    } catch (error) {
      throw error;
    }
  }
  
  /**
   * Lista todos os músicos
   * @returns {Promise<Array>} - Lista de músicos
   */
  static async findAll() {
    try {
      const querySnapshot = await getDocs(collection(db, COLLECTION_NAME));
      
      return querySnapshot.docs.map(doc => {
        return { id: doc.id, ...doc.data() };
      });
    } catch (error) {
      throw error;
    }
  }
  
  /**
   * Busca músicos disponíveis em um determinado dia da semana
   * @param {string} day - Dia da semana (sunday, monday, etc.)
   * @returns {Promise<Array>} - Lista de músicos disponíveis
   */
  static async findAvailableByDay(day) {
    try {
      // Validar o dia da semana
      const validDays = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
      if (!validDays.includes(day)) {
        throw new Error('Dia da semana inválido');
      }
      
      // Buscar músicos disponíveis no dia especificado
      const querySnapshot = await getDocs(collection(db, COLLECTION_NAME));
      
      // Filtrar músicos disponíveis
      const availableMusicians = querySnapshot.docs
        .map(doc => ({ id: doc.id, ...doc.data() }))
        .filter(musician => musician.availableDays[day] === true && musician.active === true);
      
      // Ordenar por nome
      return availableMusicians.sort((a, b) => a.name.localeCompare(b.name));
    } catch (error) {
      throw error;
    }
  }
}

module.exports = Musician;