import { Router, Request, Response } from 'express';
import { Container } from 'typedi';
import InflationService from '../../../services/inflation-service';
import TeamService from '../../../services/team-service';
import { currentUser } from '../../middlewares/current-user';
import { requireLogin } from '../../middlewares/require-login';

const router = Router();

router.get(
  '/',
  currentUser,
  requireLogin,
  async (req: Request, res: Response) => {
    const teamService = Container.get(TeamService);
    const teams = await teamService.getTeams();
    const inflationService = Container.get(InflationService);
    const inflation = await inflationService.calculateInflation();
    res.status(200).send({ teams, inflation });
  }
);

export { router as showTeamsRouter };
