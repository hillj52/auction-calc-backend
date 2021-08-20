import { Router } from 'express';
import { signUpRouter } from './auth/sign-up';
import { signInRouter } from './auth/sign-in';
import { signOutRouter } from './auth/sign-out';
import { currentUserRouter } from './auth/current-user';
import { createPlayersRouter } from './players/create-players';
import { showPlayerRouter } from './players/show-player';
import { showPlayersRouter } from './players/show-players';
import { createTeamRouter } from './teams/create-team';
import { updateTeamRouter } from './teams/update-team';
import { draftPlayerRouter } from './draft/draft-player';
import { showTeamsRouter } from './teams/show-teams';
import { undraftPlayerRouter } from './draft/undraft-player';

const router = Router();

router.use(
  '/auth',
  signUpRouter,
  signInRouter,
  signOutRouter,
  currentUserRouter
);

router.use(
  '/players',
  createPlayersRouter,
  showPlayerRouter,
  showPlayersRouter
);

router.use('/draft', draftPlayerRouter, undraftPlayerRouter);

router.use('/teams', createTeamRouter, updateTeamRouter, showTeamsRouter);

export { router as appRouter };
