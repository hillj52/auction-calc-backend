import Container, { Service, Inject } from 'typedi';
import { scrypt, randomBytes } from 'crypto';
import { promisify } from 'util';
import { Logger } from 'winston';
import PlayerService from './player-service';
import TeamService from './team-service';

@Service()
export default class InflationService {
  private playerService: PlayerService;
  private teamService: TeamService;

  constructor(@Inject('logger') private logger: Logger) {
    this.playerService = Container.get(PlayerService);
    this.teamService = Container.get(TeamService);
  }

  public async calculateInflation() {
    this.logger.debug('Calculating inflation...');
    const availableBudget = await this.teamService.getAvailableBudget();
    const remainingValue = await this.playerService.getRemainingValue();
    this.logger.silly(`Remaining Budget: ${availableBudget}`);
    this.logger.silly(`Remaining Value: ${remainingValue}`);
    this.logger.silly(
      `New Inflation Value: ${availableBudget / remainingValue}`
    );
    return availableBudget / remainingValue;
  }
}
