import { Router } from 'express';
import User from './app/models/User';

const routes = new Router();

routes.get('/', async (request, response) => {
  const user = await User.create({
    name: 'Raphael',
    email: 'raphael@gmail.com',
    password_hash: 'sad564as65d4a65s4d65as4d',
  });
  response.json(user);
});

export default routes;
