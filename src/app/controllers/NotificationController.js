import Notification from '../schemas/Notification';
import User from '../models/User';

class FileController {
  async index(request, response) {
    const checkIsProvider = await User.findOne({
      where: {
        id: request.userId,
        provider: true,
      },
    });

    if (!checkIsProvider) {
      return response
        .status(400)
        .json({ error: 'Just providers can load notifications' });
    }

    const notificaitons = await Notification.find({
      user: request.userId,
    })
      .sort({ createdAt: 'desc' })
      .limit(20);

    return response.json(notificaitons);
  }

  async update(request, response) {
    const notification = await Notification.findByIdAndUpdate(
      request.params.id,
      { read: true },
      { new: true }
    );
    return response.json(notification);
  }
}

export default new FileController();
