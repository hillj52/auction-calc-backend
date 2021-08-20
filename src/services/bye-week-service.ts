import { Service, Inject, Container } from 'typedi';
import { Logger } from 'winston';
@Service()
export default class ByeWeekService {
  constructor(@Inject('logger') private logger: Logger) {}

  public getByeWeek(team: string) {
    this.logger.info('Getting bye week for team: ' + team);
    switch (team) {
      case 'ATL':
      case 'NO':
      case 'NYJ':
      case 'SF':
        return 6;
      case 'BUF':
      case 'DAL':
      case 'JAX':
      case 'LAC':
      case 'MIN':
      case 'PIT':
        return 7;
      case 'BAL':
      case 'LV':
        return 8;
      case 'DET':
      case 'SEA':
      case 'TB':
      case 'WSH':
        return 9;
      case 'CHI':
      case 'CIN':
      case 'HOU':
      case 'NYG':
        return 10;
      case 'DEN':
      case 'LAR':
        return 11;
      case 'ARI':
      case 'KC':
        return 12;
      case 'CAR':
      case 'CLE':
      case 'GB':
      case 'TEN':
        return 13;
      case 'IND':
      case 'MIA':
      case 'NE':
      case 'PHI':
        return 14;
      case 'FA':
        return 0;
      default:
        this.logger.error(`Cannot find bye week for ${team}`);
        return 0;
    }
  }
}
