import { Service, Inject, Container } from 'typedi';
import { NotFoundError } from '../errors/not-found-error';
import {
  PlayerAttributes,
  PositionalPlayerAttributes,
} from '../interfaces/player';
import { Position } from '../interfaces/position';
import { PlayerModel, PlayerDocument } from '../models/player';
import { Logger } from 'winston';
import PlayerCSVService from './csv-reader';
import PositionalPlayerCSVService from './positional-csv-reader';
import ByeWeekService from './bye-week-service';

@Service()
export default class PlayerService {
  private playerCSVService: PlayerCSVService;
  private positionalPlayerCSVService: PositionalPlayerCSVService;
  private byeWeekService: ByeWeekService;

  constructor(
    @Inject('playerModel') private playerModel: PlayerModel,
    @Inject('logger') private logger: Logger
  ) {
    this.playerCSVService = Container.get(PlayerCSVService);
    this.positionalPlayerCSVService = Container.get(PositionalPlayerCSVService);
    this.byeWeekService = Container.get(ByeWeekService);
  }

  private async getPositionalPlayerAttributes() {
    const players = Object.keys(Position).map(
      (position) =>
        new Promise<PositionalPlayerAttributes[]>(async (resolve, reject) => {
          const positionalPlayerAttributes =
            await this.positionalPlayerCSVService.readValues(
              position as Position
            );
          resolve(positionalPlayerAttributes);
        })
    );
    return await Promise.all(players).then((result) =>
      result.reduce((acc, val) => acc.concat(val), [])
    );
  }

  public async updatePlayers() {
    const playerAttributes: PlayerAttributes[] =
      await this.playerCSVService.readValues();
    const positionalPlayerAttributes: PositionalPlayerAttributes[] =
      await this.getPositionalPlayerAttributes();
    const players = playerAttributes.map(
      (playerAttribute) =>
        new Promise<PlayerDocument>(async (resolve, reject) => {
          const positionalPlayer = positionalPlayerAttributes.find(
            ({ name, team }) =>
              name === playerAttribute.name && team === playerAttribute.team
          );
          if (positionalPlayer) {
            const player = this.playerModel.build({
              ...playerAttribute,
              ...positionalPlayer,
              drafted: false,
            });
            await player.save();
            resolve(player);
          } else {
            this.logger.error(
              `Error finding match for: ${playerAttribute.overallRank}: ${playerAttribute.name}`
            );
            const player = this.playerModel.build({
              ...playerAttribute,
              price: 0,
              byeWeek: this.byeWeekService.getByeWeek(playerAttribute.team),
              drafted: false,
            });
            await player.save();
            resolve(player);
          }
        })
    );
    return await Promise.all(players).then((result) => result);
  }

  public async getPlayers() {
    const players = await this.playerModel.find({});
    return players;
  }

  public async getPlayer(id: string) {
    const player = await this.playerModel.findById(id);
    if (!player) {
      throw new NotFoundError();
    }
    return player;
  }

  public async draftPlayer(id: string, price: number) {
    const player = await this.playerModel.findById(id);
    if (!player) {
      throw new NotFoundError();
    }
    player.set({ drafted: true, price });
    await player.save();
    return player;
  }

  public async undraftPlayer(id: string) {
    const player = await this.playerModel.findById(id);
    if (!player) {
      throw new NotFoundError();
    }
    player.set({ drafted: false, price: 0 });
    await player.save();
    return player;
  }

  public async getRemainingValue() {
    const players = await this.getPlayers();
    return players.reduce(
      (acc, player) => (player.drafted ? acc : acc + player.value),
      0
    );
  }
}
