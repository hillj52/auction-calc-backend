import { Router, Request, Response } from 'express';
import { body } from 'express-validator';
import { Container } from 'typedi';
import InflationService from '../../../services/inflation-service';
import PlayerService from '../../../services/player-service';
import TeamService from '../../../services/team-service';
import { currentUser } from '../../middlewares/current-user';
import { requireLogin } from '../../middlewares/require-login';
import { requireRole } from '../../middlewares/require-role';
import { validateRequest } from '../../middlewares/validate-request';

const router = Router();

router.post(
  '/undraftPlayer',
  currentUser,
  requireLogin,
  requireRole('admin'),
  [body('playerId').not().isEmpty(), body('teamId').not().isEmpty()],
  validateRequest,
  async (req: Request, res: Response) => {
    const { playerId, teamId, position, price } = req.body;
    const playerService = Container.get(PlayerService);
    const teamService = Container.get(TeamService);
    const player = await playerService.undraftPlayer(playerId);
    const team = await teamService.undraftPlayer(
      teamId,
      player,
      position,
      price
    );
    const inflationService = Container.get(InflationService);
    const inflation = await inflationService.calculateInflation();
    res.status(201).send({ team, inflation });
  }
);

export { router as undraftPlayerRouter };
