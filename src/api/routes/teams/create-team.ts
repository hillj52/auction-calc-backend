import { Router, Request, Response } from 'express';
import { Container } from 'typedi';
import TeamService from '../../../services/team-service';
import { currentUser } from '../../middlewares/current-user';
import { requireLogin } from '../../middlewares/require-login';
import { requireRole } from '../../middlewares/require-role';

const router = Router();

router.post(
  '/createTeam',
  currentUser,
  requireLogin,
  requireRole('admin'),
  async (req: Request, res: Response) => {
    const teamService = Container.get(TeamService);
    const { name, owner } = req.body;
    const team = await teamService.createTeam({ name, owner, money: 300 });
    res.status(201).send(team);
  }
);

export { router as createTeamRouter };
