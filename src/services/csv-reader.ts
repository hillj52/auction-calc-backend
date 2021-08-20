import parse from 'csv-parse';
import fs from 'fs';
import path from 'path';
import { Service } from 'typedi';
import { PlayerAttributes } from '../interfaces/player';

export interface PlayerCSV {
  rank: string;
  tier: string;
  name: string;
  team: string;
  position: string;
  strengthOfSchedule: string;
  pointsAboveProjection: string;
  gamesAboveProjection: string;
}

@Service()
export default class PlayerCSVService {
  private transformPlayer(playerCSV: PlayerCSV): PlayerAttributes {
    const strengthOfSchedule = isNaN(+playerCSV.strengthOfSchedule)
      ? undefined
      : +playerCSV.strengthOfSchedule;
    const pointsAboveProjection = isNaN(+playerCSV.pointsAboveProjection)
      ? undefined
      : +playerCSV.pointsAboveProjection;
    return {
      overallRank: +playerCSV.rank,
      tier: +playerCSV.tier,
      name: playerCSV.name,
      team: playerCSV.team,
      position: playerCSV.position.replace(/[0-9]/g, ''),
      positionalRank: +playerCSV.position.replace(/\D/g, ''),
      strengthOfSchedule,
      pointsAboveProjection,
      gamesAboveProjection: playerCSV.gamesAboveProjection,
      value: 0,
      price: 0,
      byeWeek: 0,
      drafted: false,
    };
  }

  public readValues() {
    const dataPromise = new Promise<PlayerAttributes[]>((resolve, reject) => {
      const csvPath = path.resolve('./', 'players.csv');

      const buffer = fs.readFileSync(csvPath);

      const data: PlayerCSV[] = [];

      const parser = parse(buffer, {
        columns: true,
      });

      parser.on('readable', () => {
        let record;
        while ((record = parser.read())) {
          data.push(record);
        }
      });

      parser.on('error', (err) => {
        console.log('ERROR', err);
        reject(err);
      });

      parser.on('end', () => {
        resolve(data.map((player) => this.transformPlayer(player)));
      });

      parser.write(buffer);

      parser.end();
    });
    return dataPromise;
  }
}
