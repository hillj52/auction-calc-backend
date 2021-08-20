import { Service, Inject } from 'typedi';
import { NotFoundError } from '../errors/not-found-error';
import { TeamAttributes, TeamModel, TeamDocument } from '../models/team';
import { Logger } from 'winston';
import { PlayerDocument } from '../models/player';
import { RosterPosition } from '../interfaces/position';
import config from '../config';

@Service()
export default class TeamService {
  constructor(
    @Inject('teamModel') private teamModel: TeamModel,
    @Inject('logger') private logger: Logger
  ) {}

  public async getTeams() {
    const teams = await this.teamModel.find({});
    return teams;
  }

  public async getTeam(id: string) {
    const team = await this.teamModel.findById(id);
    if (!team) {
      throw new NotFoundError();
    }
    return team;
  }

  public async createTeam(teamAttributes: TeamAttributes) {
    this.logger.debug('In teamService - createTeam');
    this.logger.debug(JSON.stringify(teamAttributes));
    const team = this.teamModel.build({ ...teamAttributes });
    this.logger.debug(team);
    await team.save();
    this.logger.silly(`Created team: ${team.id}`);
    return team;
  }

  public async updateTeam(id: string, teamAttributes: TeamAttributes) {
    const team = await this.teamModel.findByIdAndDelete(id);
    if (!team) {
      throw new NotFoundError();
    }
    team.set({ ...teamAttributes });
    await team.save();
    this.logger.silly(`Updated team: ${team.id}`);
    return team;
  }

  public async deleteTeam(id: string) {
    const team = await this.teamModel.findById(id);
    if (!team) {
      throw new NotFoundError();
    }
    await team.delete();
    this.logger.silly(`Deleted team: ${team.id}`);
    return team;
  }

  public async draftPlayer(
    teamId: string,
    player: PlayerDocument,
    position: RosterPosition,
    price: number
  ) {
    const team = await this.teamModel.findById(teamId);
    if (!team) {
      throw new NotFoundError();
    }
    const money = team.money - price;
    if (position === RosterPosition.BENCH) {
      if (team.bench) {
        team.set({ bench: [...team.bench, player], money });
      } else {
        team.set({ bench: [player], money });
      }
    } else {
      team.set({ [position]: player, money });
    }
    await team.save();
    return team;
  }

  public async undraftPlayer(
    teamId: string,
    player: PlayerDocument,
    position: RosterPosition,
    price: number
  ) {
    const team = await this.teamModel.findById(teamId);
    if (!team) {
      throw new NotFoundError();
    }
    const money = team.money + price;
    if (position === RosterPosition.BENCH) {
      const bench = team.bench!.filter(({ id }) => id !== player.id);
      if (bench.length === 0) {
        team.set({ bench: undefined, money });
      } else {
        team.set({ bench, money });
      }
    } else {
      team.set({ [position]: undefined, money });
    }
    await team.save();
    return team;
  }

  public async getAvailableBudget() {
    const teams = await this.getTeams();
    return teams.reduce((acc, team) => acc + this.getRemainingBudget(team), 0);
  }

  private getRemainingBudget(team: TeamDocument) {
    let isFull = true;
    let remainingBudget = config.team.maxBudget;
    if (team.qb) {
      remainingBudget -= team.qb.price!;
    } else {
      isFull = false;
    }
    if (team.rb1) {
      remainingBudget -= team.rb1.price!;
    } else {
      isFull = false;
    }
    if (team.rb2) {
      remainingBudget -= team.rb2.price!;
    } else {
      isFull = false;
    }
    if (team.wr1) {
      remainingBudget -= team.wr1.price!;
    } else {
      isFull = false;
    }
    if (team.wr2) {
      remainingBudget -= team.wr2.price!;
    } else {
      isFull = false;
    }
    if (team.flex) {
      remainingBudget -= team.flex.price!;
    } else {
      isFull = false;
    }
    if (team.op) {
      remainingBudget -= team.op.price!;
    } else {
      isFull = false;
    }
    if (team.te) {
      remainingBudget -= team.te.price!;
    } else {
      isFull = false;
    }
    if (team.k) {
      remainingBudget -= team.k.price!;
    } else {
      isFull = false;
    }
    if (team.dst) {
      remainingBudget -= team.dst.price!;
    } else {
      isFull = false;
    }
    if (team.bench) {
      if (team.bench.length < 6) {
        isFull = false;
      }
      const benchPrice = team.bench.reduce((acc, { price }) => acc + price!, 0);
      remainingBudget -= benchPrice;
    } else {
      isFull = false;
    }
    return isFull ? 0 : remainingBudget;
  }
}
