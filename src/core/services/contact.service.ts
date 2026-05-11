import { Contact, ContactStatus } from '../models/contact.model';
import contactRepository from '../repositories/contact.repository';

class ContactService {
  private contactRepository = contactRepository;
  // =========================
  // CREATE CONTACT
  // =========================
  async createContact(data: Partial<Contact>) {
    return await this.contactRepository.create(data);
  }

  // =========================
  // FIND CONTACT BY ID
  // =========================
  async findById(id: string) {
    return await this.contactRepository.findById(id);
  }

  // =========================
  // RECEIVED CONTACTS
  // =========================
  async getReceivedContacts(receiverId: string) {
    return await this.contactRepository.getReceivedContacts(receiverId);
  }

  // =========================
  // SENT CONTACTS
  // =========================
  async getSentContacts(senderId: string) {
    return await this.contactRepository.findSent(senderId);
  }

  // =========================
  // CONVERSATION BETWEEN 2 STARTUPS
  // =========================
  async getConversation(startupA: string, startupB: string) {
    return await this.contactRepository.getConversation(startupA, startupB);
  }

  // =========================
  // MARK CONTACT AS READ
  // =========================
  async markAsRead(id: string) {
    return await this.contactRepository.markAsRead(id);
  }

  // =========================
  // UPDATE STATUS
  // =========================
  async updateStatus(id: string, status: ContactStatus) {
    return await this.contactRepository.updateStatus(id, status);
  }

  // =========================
  // UNREAD COUNT
  // =========================
  async getUnreadCount(receiverId: string) {
    return await this.contactRepository.getUnreadCount(receiverId);
  }

  // =========================
  // DELETE CONTACT
  // =========================
  async deleteContact(id: string) {
    return await this.contactRepository.destroy(id);
  }

  // =========================
  // MARK CONVERSATION AS READ
  // =========================

  async markConversationAsRead(senderId: string, receiverId: string) {
    await this.contactRepository.markConversationAsRead(senderId, receiverId);
  }
}

export default new ContactService();
