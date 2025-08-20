const { db } = require('../../config/firebaseConfig');
const { collection, doc, getDoc, getDocs, addDoc, updateDoc, deleteDoc, query, where, Timestamp } = require('firebase/firestore');

const COLLECTION_NAME = 'rehearsals';

class Rehearsal {
  /**
   * Cria um novo ensaio
   * @param {Object} rehearsalData - Dados do ensaio
   * @returns {Promise<Object>} - Ensaio criado
   */
  static async create(rehearsalData) {
    try {
      // Preparar dados do ensaio
      const rehearsal = {
        title: rehearsalData.title,
        date: Timestamp.fromDate(new Date(rehearsalData.date)),
        startTime: rehearsalData.startTime,
        endTime: rehearsalData.endTime,
        location: rehearsalData.location,
        description: rehearsalData.description || '',
        repertoire: rehearsalData.repertoire || [],
        musicians: rehearsalData.musicians || [],
        createdBy: rehearsalData.createdBy,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      };
      
      // Adicionar ensaio ao Firestore
      const docRef = await addDoc(collection(db, COLLECTION_NAME), rehearsal);
      
      return { id: docRef.id, ...rehearsal };
    } catch (error) {
      throw error;
    }
  }
  
  /**
   * Busca um ensaio pelo ID
   * @param {string} id - ID do ensaio
   * @returns {Promise<Object|null>} - Ensaio encontrado ou null
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
   * Atualiza um ensaio
   * @param {string} id - ID do ensaio
   * @param {Object} updateData - Dados a serem atualizados
   * @returns {Promise<Object>} - Ensaio atualizado
   */
  static async update(id, updateData) {
    try {
      const docRef = doc(db, COLLECTION_NAME, id);
      const docSnap = await getDoc(docRef);
      
      if (!docSnap.exists()) {
        throw new Error('Ensaio não encontrado');
      }
      
      // Preparar dados para atualização
      const updates = { ...updateData, updatedAt: Timestamp.now() };
      
      // Se a data estiver sendo atualizada, converter para Timestamp
      if (updates.date) {
        updates.date = Timestamp.fromDate(new Date(updates.date));
      }
      
      // Atualizar ensaio no Firestore
      await updateDoc(docRef, updates);
      
      // Retornar ensaio atualizado
      return { id, ...docSnap.data(), ...updates };
    } catch (error) {
      throw error;
    }
  }
  
  /**
   * Remove um ensaio
   * @param {string} id - ID do ensaio
   * @returns {Promise<boolean>} - true se removido com sucesso
   */
  static async delete(id) {
    try {
      const docRef = doc(db, COLLECTION_NAME, id);
      const docSnap = await getDoc(docRef);
      
      if (!docSnap.exists()) {
        throw new Error('Ensaio não encontrado');
      }
      
      await deleteDoc(docRef);
      return true;
    } catch (error) {
      throw error;
    }
  }
  
  /**
   * Lista todos os ensaios
   * @returns {Promise<Array>} - Lista de ensaios
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
   * Adiciona um músico ao ensaio
   * @param {string} rehearsalId - ID do ensaio
   * @param {string} musicianId - ID do músico
   * @returns {Promise<Object>} - Ensaio atualizado
   */
  static async addMusician(rehearsalId, musicianId) {
    try {
      const rehearsal = await this.findById(rehearsalId);
      
      if (!rehearsal) {
        throw new Error('Ensaio não encontrado');
      }
      
      // Verificar se o músico já está no ensaio
      const musicianExists = rehearsal.musicians.some(m => m.musician === musicianId);
      
      if (musicianExists) {
        throw new Error('Músico já está neste ensaio');
      }
      
      // Adicionar músico ao ensaio
      const musicians = [...rehearsal.musicians, {
        musician: musicianId,
        confirmed: false,
        notificationSent: false
      }];
      
      // Atualizar ensaio
      return await this.update(rehearsalId, { musicians });
    } catch (error) {
      throw error;
    }
  }
  
  /**
   * Remove um músico do ensaio
   * @param {string} rehearsalId - ID do ensaio
   * @param {string} musicianId - ID do músico
   * @returns {Promise<Object>} - Ensaio atualizado
   */
  static async removeMusician(rehearsalId, musicianId) {
    try {
      const rehearsal = await this.findById(rehearsalId);
      
      if (!rehearsal) {
        throw new Error('Ensaio não encontrado');
      }
      
      // Filtrar músicos para remover o especificado
      const musicians = rehearsal.musicians.filter(m => m.musician !== musicianId);
      
      if (musicians.length === rehearsal.musicians.length) {
        throw new Error('Músico não está neste ensaio');
      }
      
      // Atualizar ensaio
      return await this.update(rehearsalId, { musicians });
    } catch (error) {
      throw error;
    }
  }
  
  /**
   * Confirma a presença de um músico no ensaio
   * @param {string} rehearsalId - ID do ensaio
   * @param {string} musicianId - ID do músico
   * @returns {Promise<Object>} - Ensaio atualizado
   */
  static async confirmMusician(rehearsalId, musicianId) {
    try {
      const rehearsal = await this.findById(rehearsalId);
      
      if (!rehearsal) {
        throw new Error('Ensaio não encontrado');
      }
      
      // Atualizar status de confirmação do músico
      const musicians = rehearsal.musicians.map(m => {
        if (m.musician === musicianId) {
          return { ...m, confirmed: true };
        }
        return m;
      });
      
      // Verificar se o músico foi encontrado
      if (JSON.stringify(musicians) === JSON.stringify(rehearsal.musicians)) {
        throw new Error('Músico não está neste ensaio');
      }
      
      // Atualizar ensaio
      return await this.update(rehearsalId, { musicians });
    } catch (error) {
      throw error;
    }
  }
}

module.exports = Rehearsal;