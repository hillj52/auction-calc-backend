import { Router, Request, Response } from 'express';
import { Container } from 'typedi';
import PlayerService from '../../../services/player-service';
import { currentUser } from '../../middlewares/current-user';
import { requireLogin } from '../../middlewares/require-login';

const router = Router();

router.get(
  '/',
  currentUser,
  requireLogin,
  async (req: Request, res: Response) => {
    const playerService = Container.get(PlayerService);
    const players = await playerService.getPlayers();
    res.status(200).send(players);
  }
);

export { router as showPlayersRouter };
