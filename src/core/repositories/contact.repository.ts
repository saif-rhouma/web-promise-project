import AppDataSource from '../../database/data-source';
import { Contact, ContactStatus } from '../models/contact.model';

import BaseRepository from './baseRepository';

class ContactRepository extends BaseRepository<Contact> {
  constructor() {
    super(AppDataSource.getRepository(Contact));
  }

  // =========================
  // FIND BY ID
  // =========================
  async findById(id: string) {
    return await this.repo.findOne({
      where: { id },
      relations: ['sender', 'receiver'],
    });
  }

  // =========================
  // RECEIVED CONTACTS
  // =========================
  async findReceived(receiverId: string) {
    return await this.repo.find({
      where: {
        receiver: {
          id: receiverId,
        },
      } as any,
      relations: ['sender', 'receiver'],
      order: {
        createdAt: 'DESC',
      },
    });
  }

  // async getReceivedContacts(receiverId: string) {
  //   const contacts = await this.repo.find({
  //     where: {
  //       receiver: {
  //         id: receiverId,
  //       },
  //     } as any,
  //     relations: ['sender', 'receiver'],
  //     order: {
  //       createdAt: 'DESC',
  //     },
  //   });

  //   const grouped = new Map();

  //   for (const contact of contacts) {
  //     const senderId = contact.sender.id;

  //     // because ordered DESC,
  //     // first one is latest message
  //     if (!grouped.has(senderId)) {
  //       grouped.set(senderId, {
  //         sender: contact.sender,
  //         lastMessage: contact,
  //         messages: [],
  //         unreadCount: 0,
  //       });
  //     }

  //     const conversation = grouped.get(senderId);

  //     conversation.messages.push(contact);

  //     if (!contact.isRead) {
  //       conversation.unreadCount++;
  //     }
  //   }

  //   return Array.from(grouped.values());
  // }

  async getReceivedContacts(startupId: string) {
    const contacts = await this.repo.find({
      where: [
        {
          sender: {
            id: startupId,
          },
        } as any,

        {
          receiver: {
            id: startupId,
          },
        } as any,
      ],

      relations: ['sender', 'receiver'],

      order: {
        createdAt: 'DESC',
      },
    });

    const grouped = new Map();

    for (const contact of contacts) {
      // ======================
      // OTHER USER
      // ======================

      const otherUser = contact.sender.id === startupId ? contact.receiver : contact.sender;

      const conversationKey = otherUser.id;

      // ======================
      // FIRST = LAST MESSAGE
      // ======================

      if (!grouped.has(conversationKey)) {
        grouped.set(conversationKey, {
          startup: otherUser,

          lastMessage: contact,

          messages: [],

          unreadCount: 0,
        });
      }

      const conversation = grouped.get(conversationKey);

      conversation.messages.push(contact);

      // ======================
      // UNREAD COUNT
      // only received unread
      // ======================

      const isUnread = contact.receiver.id === startupId && !contact.isRead;

      if (isUnread) {
        conversation.unreadCount++;
      }
    }

    return Array.from(grouped.values());
  }

  // =========================
  // SENT CONTACTS
  // =========================
  async findSent(senderId: string) {
    return await this.repo.find({
      where: {
        sender: {
          id: senderId,
        },
      } as any,
      relations: ['sender', 'receiver'],
      order: {
        createdAt: 'DESC',
      },
    });
  }

  // =========================
  // MARK AS READ
  // =========================
  async markAsRead(id: string) {
    const contact = await this.findById(id);

    if (!contact) return null;

    Object.assign(contact, {
      isRead: true,
      status: ContactStatus.READ,
    });

    return await this.save(contact);
  }

  // =========================
  // UPDATE STATUS
  // =========================
  async updateStatus(id: string, status: ContactStatus) {
    const contact = await this.findById(id);

    if (!contact) return null;

    contact.status = status;

    return await this.save(contact);
  }

  // =========================
  // GET UNREAD COUNT
  // =========================
  async getUnreadCount(receiverId: string) {
    return await this.repo.count({
      where: {
        receiver: {
          id: receiverId,
        },
        isRead: false,
      } as any,
    });
  }

  // =========================
  // CONVERSATION
  // =========================
  async getConversation(startupA: string, startupB: string) {
    return await this.repo.find({
      where: [
        {
          sender: { id: startupA },
          receiver: { id: startupB },
        },
        {
          sender: { id: startupB },
          receiver: { id: startupA },
        },
      ] as any,
      relations: ['sender', 'receiver'],
      order: {
        createdAt: 'ASC',
      },
    });
  }

  // async getConversation(startupA: string, startupB: string) {
  //   const messages = await this.repo.find({
  //     where: [
  //       {
  //         sender: { id: startupA },
  //         receiver: { id: startupB },
  //       },
  //       {
  //         sender: { id: startupB },
  //         receiver: { id: startupA },
  //       },
  //     ] as any,
  //     relations: ['sender', 'receiver'],
  //     order: {
  //       createdAt: 'ASC',
  //     },
  //   });

  //   const groupedConversation = {
  //     participant: messages[0]?.sender.id === startupA ? messages[0]?.receiver : messages[0]?.sender,

  //     messages: messages.map((message) => ({
  //       id: message.id,
  //       message: message.message,
  //       subject: message.subject,
  //       createdAt: message.createdAt,
  //       isRead: message.isRead,
  //       status: message.status,

  //       isMine: message.sender.id === startupA,

  //       sender: {
  //         id: message.sender.id,
  //         name: message.sender.name,
  //         avatar: message.sender.avatar,
  //       },

  //       receiver: {
  //         id: message.receiver.id,
  //         name: message.receiver.name,
  //         avatar: message.receiver.avatar,
  //       },
  //     })),
  //   };

  //   return groupedConversation;
  // }

  // =========================
  // MARK CONVERSATION AS READ
  // =========================
  async markConversationAsRead(senderId: string, receiverId: string) {
    await this.repo.update(
      {
        sender: { id: senderId },
        receiver: { id: receiverId },
        isRead: false,
      } as any,
      {
        isRead: true,
      }
    );
  }
}

export default new ContactRepository();
