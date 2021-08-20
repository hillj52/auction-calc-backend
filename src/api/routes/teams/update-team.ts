import { Router, Request, Response } from 'express';
import { Container } from 'typedi';
import { TeamAttributes } from '../../../models/team';
import TeamService from '../../../services/team-service';
import { currentUser } from '../../middlewares/current-user';
import { requireLogin } from '../../middlewares/require-login';
import { requireRole } from '../../middlewares/require-role';

const router = Router();

router.post(
  '/updateTeam',
  currentUser,
  requireLogin,
  requireRole('admin'),
  async (req: Request, res: Response) => {
    const teamService = Container.get(TeamService);
    const teamAttributes: TeamAttributes = req.body.team;
    const id = req.body.team.id;
    const team = await teamService.updateTeam(id, teamAttributes);
    res.status(201).send(team);
  }
);

export { router as updateTeamRouter };
