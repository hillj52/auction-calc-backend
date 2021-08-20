import parse from 'csv-parse';
import fs from 'fs';
import path from 'path';
import { Service } from 'typedi';
import { PositionalPlayerAttributes } from '../interfaces/player';
import { Position } from '../interfaces/position';

export interface PositionalPlayerCSV {
  name: string;
  team: string;
  byeWeek: string;
  value: string;
}

@Service()
export default class PositionalPlayerCSVService {
  private transformPlayer(
    playerCSV: PositionalPlayerCSV,
    position: Position
  ): PositionalPlayerAttributes {
    return {
      name: playerCSV.name,
      team: playerCSV.team,
      byeWeek: +playerCSV.byeWeek,
      value: +playerCSV.value.replace('$', ''),
      position,
    };
  }

  public readValues(position: Position) {
    const dataPromise = new Promise<PositionalPlayerAttributes[]>(
      (resolve, reject) => {
        const data: PositionalPlayerCSV[] = [];
        const csvPath = path.resolve('./', `${position}.csv`);

        const buffer = fs.readFileSync(csvPath);

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
          resolve(data.map((player) => this.transformPlayer(player, position)));
        });

        parser.write(buffer);

        parser.end();
      }
    );
    return dataPromise;
  }
}
