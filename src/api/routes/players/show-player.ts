import { Router, Request, Response } from 'express';
import { Container } from 'typedi';
import PlayerService from '../../../services/player-service';
import { currentUser } from '../../middlewares/current-user';
import { requireLogin } from '../../middlewares/require-login';

const router = Router();

router.get(
  '/:id',
  currentUser,
  requireLogin,
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const playerService = Container.get(PlayerService);
    const player = await playerService.getPlayer(id);
    res.status(200).send(player);
  }
);

export { router as showPlayerRouter };
