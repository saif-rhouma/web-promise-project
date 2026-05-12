import { Request, Response } from 'express';
import AsyncRouteHandler from 'src/types/AsyncRouteHandler';

import usersRepository from '../repositories/user.repository';
import startupProfileRepository from '../repositories/startup-profile.repository';

import contactService from '../services/contact.service';

import { getUser } from '../../helpers/getUser.helpers';
import { ContactStatus } from '../models/contact.model';
import { StartupProfile } from '../models/startup-profile.model';

class ContactController {
  // ======================
  // CONTACTS PAGE
  // ======================
  contactsPage: AsyncRouteHandler = async (req: Request, res: Response) => {
    try {
      const user = await getUser(req, res, usersRepository);

      if (!user?.startupProfile?.id) {
        return res.redirect('/startup/profile');
      }

      const receivedContacts = await contactService.getReceivedContacts(user.startupProfile.id);

      const sentContacts = await contactService.getSentContacts(user.startupProfile.id);

      const unreadCount = await contactService.getUnreadCount(user.startupProfile.id);

      const totalConversations = receivedContacts.length;
      console.log('----> receivedContacts', receivedContacts);

      return res.render('pages/startup/contacts', {
        csrfToken: req.csrfToken(),
        user,
        startupProfile: user?.startupProfile || {},
        receivedContacts,
        sentContacts,
        unreadCount,
        totalConversations,
        currentPath: req.path,
      });
    } catch (err) {
      console.error(err);
      return res.status(500).send('Failed to load contacts');
    }
  };

  // ======================
  // CONTACT DETAILS
  // ======================
  getContactDetails: AsyncRouteHandler = async (req: Request, res: Response) => {
    try {
      const user = await getUser(req, res, usersRepository);

      const contactId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;

      const contact = await contactService.findById(contactId);

      if (!contact) {
        return res.status(404).send('Contact not found');
      }

      // 🔒 SECURITY
      const startupId = user?.startupProfile?.id;

      const isAllowed = contact.sender.id === startupId || contact.receiver.id === startupId;

      if (!isAllowed) {
        return res.status(403).send('Unauthorized');
      }

      // auto mark as read
      if (contact.receiver.id === startupId && !contact.isRead) {
        await contactService.markAsRead(contact.id);
      }

      return res.render('pages/startup/contact-detail', {
        csrfToken: req.csrfToken(),
        user,
        startupProfile: user?.startupProfile || {},
        contact,
        currentPath: req.path,
      });
    } catch (err) {
      console.error(err);
      return res.status(500).send('Failed to load contact');
    }
  };

  // ======================
  // SEND CONTACT
  // ======================
  sendContact: AsyncRouteHandler = async (req: Request, res: Response) => {
    try {
      const user = await getUser(req, res, usersRepository);

      if (!user || !user.startupProfile) {
        return res.status(401).json({
          success: false,
          message: 'Unauthorized',
        });
      }

      // ======================
      // BODY
      // ======================

      const receiverId = req.body.receiverId;

      const subject = req.body.subject?.trim();
      const message = req.body.message?.trim();

      const email = req.body.email?.trim() || null;
      const phone = req.body.phone?.trim() || null;

      // ======================
      // VALIDATION
      // ======================
      if (!receiverId || !subject || !message) {
        return res.status(400).json({
          success: false,
          message: 'Missing required fields',
        });
      }

      // ======================
      // RECEIVER
      // ======================

      const receiver = await startupProfileRepository.findOne({
        where: {
          id: receiverId,
        },
      });

      if (!receiver) {
        return res.status(404).json({
          success: false,
          message: 'Receiver startup not found',
        });
      }

      // ======================
      // PREVENT SELF CONTACT
      // ======================

      if (receiver.id === user.startupProfile.id) {
        return res.status(400).json({
          success: false,
          message: 'Cannot contact yourself',
        });
      }

      // ======================
      // CREATE CONTACT
      // ======================

      await contactService.createContact({
        sender: user.startupProfile,
        receiver,
        subject,
        message,
        email,
        phone,
        status: ContactStatus.PENDING,
        isRead: false,
      });

      // ======================
      // SUCCESS
      // ======================

      return res.status(201).json({
        success: true,
        message: 'Contact sent successfully',
      });
    } catch (err) {
      console.error('SEND CONTACT ERROR:', err);

      return res.status(500).json({
        success: false,
        message: 'Failed to send contact',
      });
    }
  };

  // ======================
  // UPDATE STATUS
  // ======================
  updateStatus: AsyncRouteHandler = async (req: Request, res: Response) => {
    try {
      const contactId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;

      const { status } = req.body;

      const contact = await contactService.findById(contactId);

      if (!contact) {
        return res.status(404).json({
          message: 'Contact not found',
        });
      }

      await contactService.updateStatus(contactId, status as ContactStatus);

      return res.json({
        success: true,
      });
    } catch (err) {
      console.error(err);

      return res.status(500).json({
        message: 'Failed to update status',
      });
    }
  };

  // ======================
  // MARK AS READ
  // ======================
  markAsRead: AsyncRouteHandler = async (req: Request, res: Response) => {
    try {
      const contactId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;

      const contact = await contactService.markAsRead(contactId);

      if (!contact) {
        return res.status(404).json({
          message: 'Contact not found',
        });
      }

      return res.json({
        success: true,
      });
    } catch (err) {
      console.error(err);

      return res.status(500).json({
        message: 'Failed to mark as read',
      });
    }
  };

  // ======================
  // CONVERSATION
  // ======================
  // getConversation: AsyncRouteHandler = async (req: Request, res: Response) => {
  //   try {
  //     // ======================
  //     // AUTH USER
  //     // ======================

  //     const user = await getUser(req, res, usersRepository);

  //     if (!user || !user.startupProfile) {
  //       return res.status(401).send('Unauthorized');
  //     }

  //     // ======================
  //     // PARAMS
  //     // ======================

  //     const startupId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;

  //     if (!startupId) {
  //       return res.status(400).send('Invalid startup id');
  //     }

  //     // ======================
  //     // TARGET STARTUP
  //     // ======================

  //     const startup = await startupProfileRepository.findOne({
  //       where: {
  //         id: startupId,
  //       },
  //     });

  //     if (!startup) {
  //       return res.status(404).send('Startup not found');
  //     }

  //     // ======================
  //     // CONVERSATION
  //     // ======================

  //     const conversations = await contactService.getConversation(user.startupProfile.id, startupId);

  //     // ======================
  //     // MARK AS READ
  //     // ======================

  //     await contactService.markConversationAsRead(startupId, user.startupProfile.id);

  //     return res.render('pages/startup/conversation', {
  //       csrfToken: req.csrfToken(),

  //       user,

  //       startupProfile: user.startupProfile,

  //       conversations,

  //       startup,

  //       currentPath: req.path,
  //     });
  //   } catch (err) {
  //     console.error(err);

  //     return res.status(500).send('Failed to load conversation');
  //   }
  // };

  getConversation: AsyncRouteHandler = async (req: Request, res: Response) => {
    try {
      const user = await getUser(req, res, usersRepository);

      if (!user || !user.startupProfile) {
        return res.status(401).send('Unauthorized');
      }

      // ======================
      // LEFT SIDEBAR CONVERSATIONS
      // ======================

      const receivedContacts = await contactService.getReceivedContacts(user.startupProfile.id);
      // ======================
      // ACTIVE CHAT
      // ======================

      const startupId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;

      let startup: StartupProfile | null = null;
      let conversations: any[] = [];

      if (startupId) {
        startup = await startupProfileRepository.findOne({
          where: {
            id: startupId,
          },
        });

        if (startup) {
          conversations = await contactService.getConversation(user.startupProfile.id, startupId);

          await contactService.markConversationAsRead(startupId, user.startupProfile.id);
        }
      }

      return res.render('pages/startup/conversation', {
        csrfToken: req.csrfToken(),

        user,

        startupProfile: user.startupProfile,

        conversations,

        startup,

        receivedContacts,
        selectedStartupId: startupId,

        currentPath: req.path,
      });
    } catch (err) {
      console.error(err);

      return res.status(500).send('Failed to load conversation');
    }
  };

  getConversationJson: AsyncRouteHandler = async (req: Request, res: Response) => {
    const user = await getUser(req, res, usersRepository);

    const startupId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;

    const conversations = await contactService.getConversation(user.startupProfile.id, startupId);

    return res.json(conversations);
  };

  // ======================
  // DELETE CONTACT
  // ======================
  deleteContact: AsyncRouteHandler = async (req: Request, res: Response) => {
    try {
      const contactId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;

      const deleted = await contactService.deleteContact(contactId);

      if (!deleted) {
        return res.status(404).json({
          message: 'Contact not found',
        });
      }

      return res.json({
        success: true,
      });
    } catch (err) {
      console.error(err);

      return res.status(500).json({
        message: 'Delete failed',
      });
    }
  };
}

export default new ContactController();
