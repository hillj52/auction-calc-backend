import { Router, Request, Response } from 'express';
import { Container } from 'typedi';
import PlayerService from '../../../services/player-service';
import { currentUser } from '../../middlewares/current-user';
import { requireLogin } from '../../middlewares/require-login';
import { requireRole } from '../../middlewares/require-role';

const router = Router();

router.get(
  '/createPlayers',
  currentUser,
  requireLogin,
  requireRole('admin'),
  async (req: Request, res: Response) => {
    const playerService = Container.get(PlayerService);
    const players = await playerService.updatePlayers();
    res.status(201).send(players);
  }
);

export { router as createPlayersRouter };
