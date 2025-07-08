const Invite=require('../db/models/invite')
const ServiceMan=require('../db/models/serviceman')
const ServiceDetail=require('../db/models/servicedetail')
const User=require('../db/models/user')
const { Op } = require('sequelize');


// Send Invite
const sendInvite = async (req, res) => {
  const { nanoid } = await import('nanoid');
    

  try {
    const { servicemanId, userId } = req.body;

    if (!servicemanId || !userId) {
      return res.status(400).json({ message: 'servicemanId and userId are required.' });
    }

    const existing = await Invite.findOne({
      where: {
        servicemanId,
        userId,
        status: ['pending', 'accepted']
      }
    });

    if (existing) {
      return res.status(409).json({ message: `An invite is already ${existing.status}.` });
    }

    const invite = await Invite.create({
      id: 'inv_' + nanoid(10),
      servicemanId,
      userId,
      status: 'pending',
      createdAt: new Date(),
      updatedAt: new Date()
    });

    res.status(201).json({ message: 'Invite sent.', invite });

  } catch (err) {
    console.error('Send Invite Error:', err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

const respondToInvite = async (req, res) => {
  try {
    const { inviteId } = req.params;
    const { action } = req.body;

    if (!['accept', 'reject'].includes(action)) {
      return res.status(400).json({ message: 'Action must be "accept" or "reject".' });
    }

    const invite = await Invite.findByPk(inviteId);
    if (!invite || invite.status !== 'pending') {
      return res.status(404).json({ message: 'Invite not found or already responded.' });
    }

    if (action === 'accept') {
      invite.status = 'accepted';
      await invite.save();

      // ❌ Reject all other pending invites for this user
      await Invite.update(
        { status: 'rejected' },
        {
          where: {
            userId: invite.userId,
            status: 'pending',
            id: { [Op.ne]: invite.id }
          }
        }
      );
    } else {
      invite.status = 'rejected';
      await invite.save();
    }

    res.status(200).json({ message: `Invite ${invite.status}.`, invite });

  } catch (err) {
    console.error('Respond Invite Error:', err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};



const getInvitesForUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const invites = await Invite.findAll({
      where: { userId },
      include: [
        {
          model: ServiceMan,
          as: 'serviceman',
          attributes: ['id', 'email', 'serviceType'],
          include: [{
            model: ServiceDetail,
            as: 'detail',
            attributes: ['name', 'imageUrl', 'category', 'location']
          }]
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    if (!invites.length) {
      return res.status(404).json({ message: 'No invites found.' });
    }

    res.status(200).json({ invites });

  } catch (err) {
    console.error('Get Invites Error:', err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};


module.exports = {
  sendInvite,
  respondToInvite,
  getInvitesForUser
};