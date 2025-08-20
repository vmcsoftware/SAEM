const { db } = require('../../config/firebaseConfig');
const { collection, doc, getDoc, getDocs, addDoc, updateDoc, deleteDoc, query, where, Timestamp } = require('firebase/firestore');

const COLLECTION_NAME = 'events';

class Event {
  /**
   * Cria um novo evento
   * @param {Object} eventData - Dados do evento
   * @returns {Promise<Object>} - Evento criado
   */
  static async create(eventData) {
    try {
      // Preparar dados do evento
      const event = {
        title: eventData.title,
        date: Timestamp.fromDate(new Date(eventData.date)),
        startTime: eventData.startTime,
        endTime: eventData.endTime,
        location: eventData.location,
        description: eventData.description || '',
        eventType: eventData.eventType || 'outro',
        repertoire: eventData.repertoire || [],
        musicians: eventData.musicians || [],
        createdBy: eventData.createdBy,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      };
      
      // Adicionar evento ao Firestore
      const docRef = await addDoc(collection(db, COLLECTION_NAME), event);
      
      return { id: docRef.id, ...event };
    } catch (error) {
      throw error;
    }
  }
  
  /**
   * Busca um evento pelo ID
   * @param {string} id - ID do evento
   * @returns {Promise<Object|null>} - Evento encontrado ou null
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
   * Atualiza um evento
   * @param {string} id - ID do evento
   * @param {Object} updateData - Dados a serem atualizados
   * @returns {Promise<Object>} - Evento atualizado
   */
  static async update(id, updateData) {
    try {
      const docRef = doc(db, COLLECTION_NAME, id);
      const docSnap = await getDoc(docRef);
      
      if (!docSnap.exists()) {
        throw new Error('Evento não encontrado');
      }
      
      // Preparar dados para atualização
      const updates = { ...updateData, updatedAt: Timestamp.now() };
      
      // Se a data estiver sendo atualizada, converter para Timestamp
      if (updates.date) {
        updates.date = Timestamp.fromDate(new Date(updates.date));
      }
      
      // Atualizar evento no Firestore
      await updateDoc(docRef, updates);
      
      // Retornar evento atualizado
      return { id, ...docSnap.data(), ...updates };
    } catch (error) {
      throw error;
    }
  }
  
  /**
   * Remove um evento
   * @param {string} id - ID do evento
   * @returns {Promise<boolean>} - true se removido com sucesso
   */
  static async delete(id) {
    try {
      const docRef = doc(db, COLLECTION_NAME, id);
      const docSnap = await getDoc(docRef);
      
      if (!docSnap.exists()) {
        throw new Error('Evento não encontrado');
      }
      
      await deleteDoc(docRef);
      return true;
    } catch (error) {
      throw error;
    }
  }
  
  /**
   * Lista todos os eventos
   * @returns {Promise<Array>} - Lista de eventos
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
   * Adiciona um músico ao evento
   * @param {string} eventId - ID do evento
   * @param {string} musicianId - ID do músico
   * @returns {Promise<Object>} - Evento atualizado
   */
  static async addMusician(eventId, musicianId) {
    try {
      const event = await this.findById(eventId);
      
      if (!event) {
        throw new Error('Evento não encontrado');
      }
      
      // Verificar se o músico já está no evento
      const musicianExists = event.musicians.some(m => m.musician === musicianId);
      
      if (musicianExists) {
        throw new Error('Músico já está neste evento');
      }
      
      // Adicionar músico ao evento
      const musicians = [...event.musicians, {
        musician: musicianId,
        confirmed: false,
        notificationSent: false
      }];
      
      // Atualizar evento
      return await this.update(eventId, { musicians });
    } catch (error) {
      throw error;
    }
  }
  
  /**
   * Remove um músico do evento
   * @param {string} eventId - ID do evento
   * @param {string} musicianId - ID do músico
   * @returns {Promise<Object>} - Evento atualizado
   */
  static async removeMusician(eventId, musicianId) {
    try {
      const event = await this.findById(eventId);
      
      if (!event) {
        throw new Error('Evento não encontrado');
      }
      
      // Filtrar músicos para remover o especificado
      const musicians = event.musicians.filter(m => m.musician !== musicianId);
      
      if (musicians.length === event.musicians.length) {
        throw new Error('Músico não está neste evento');
      }
      
      // Atualizar evento
      return await this.update(eventId, { musicians });
    } catch (error) {
      throw error;
    }
  }
  
  /**
   * Confirma a presença de um músico no evento
   * @param {string} eventId - ID do evento
   * @param {string} musicianId - ID do músico
   * @returns {Promise<Object>} - Evento atualizado
   */
  static async confirmMusician(eventId, musicianId) {
    try {
      const event = await this.findById(eventId);
      
      if (!event) {
        throw new Error('Evento não encontrado');
      }
      
      // Atualizar status de confirmação do músico
      const musicians = event.musicians.map(m => {
        if (m.musician === musicianId) {
          return { ...m, confirmed: true };
        }
        return m;
      });
      
      // Verificar se o músico foi encontrado
      if (JSON.stringify(musicians) === JSON.stringify(event.musicians)) {
        throw new Error('Músico não está neste evento');
      }
      
      // Atualizar evento
      return await this.update(eventId, { musicians });
    } catch (error) {
      throw error;
    }
  }
  
  /**
   * Busca eventos por data
   * @param {string} date - Data no formato YYYY-MM-DD
   * @returns {Promise<Array>} - Lista de eventos na data especificada
   */
  static async findByDate(date) {
    try {
      // Criar objeto de data a partir da string (formato: YYYY-MM-DD)
      const searchDate = new Date(date);
      searchDate.setHours(0, 0, 0, 0);
      
      const nextDay = new Date(searchDate);
      nextDay.setDate(nextDay.getDate() + 1);
      
      const startTimestamp = Timestamp.fromDate(searchDate);
      const endTimestamp = Timestamp.fromDate(nextDay);
      
      // Buscar eventos na data especificada
      const q = query(
        collection(db, COLLECTION_NAME),
        where('date', '>=', startTimestamp),
        where('date', '<', endTimestamp)
      );
      
      const querySnapshot = await getDocs(q);
      
      return querySnapshot.docs.map(doc => {
        return { id: doc.id, ...doc.data() };
      });
    } catch (error) {
      throw error;
    }
  }
}

module.exports = Event;