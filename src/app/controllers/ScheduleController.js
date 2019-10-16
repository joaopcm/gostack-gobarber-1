import { startOfDay, endOfDay, parseISO } from 'date-fns';
import { Op } from 'sequelize';
import User from '../models/User';
import Appointment from '../models/Appointment';
import File from '../models/File';

class ScheduleController {
  async index(request, response) {
    const checkUserProvider = await User.findOne({
      id: request.userId,
      provider: true,
    });

    if (!checkUserProvider) {
      return response
        .status(401)
        .json({ error: 'Just providers has schedules' });
    }

    const { date = new Date() } = request.query;

    const parsedDate = parseISO(date);

    const appointments = await Appointment.findAll({
      where: {
        provider_id: request.userId,
        canceled_at: null,
        date: {
          [Op.between]: [startOfDay(parsedDate), endOfDay(parsedDate)],
        },
      },
      attributes: ['id', 'date'],
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'name', 'email'],
          include: [{ model: File, as: 'avatar', attributes: ['path', 'url'] }],
        },
      ],
      order: ['date'],
    });

    return response.json(appointments);
  }
}

export default new ScheduleController();
