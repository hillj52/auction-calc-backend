import mongoose from 'mongoose';
import { PlayerAttributes } from '../interfaces/player';

export interface PlayerDocument extends mongoose.Document {
  overallRank: number;
  tier: number;
  name: string;
  team: string;
  position: string;
  positionalRank: number;
  strengthOfSchedule?: Number;
  pointsAboveProjection?: number;
  gamesAboveProjection: string;
  byeWeek: number;
  value: number;
  price?: number;
  drafted: boolean;
}

export interface PlayerModel extends mongoose.Model<PlayerDocument> {
  build(attributes: PlayerAttributes): PlayerDocument;
}

const playerSchema = new mongoose.Schema(
  {
    overallRank: {
      type: Number,
      required: true,
    },
    tier: {
      type: Number,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    team: {
      type: String,
      required: true,
    },
    position: {
      type: String,
      required: true,
    },
    positionalRank: {
      type: Number,
      required: true,
    },
    strengthOfSchedule: {
      type: Number,
      required: false,
    },
    pointsAboveProjection: {
      type: Number,
      required: false,
    },
    gamesAboveProjection: {
      type: String,
      required: true,
    },
    byeWeek: {
      type: Number,
      required: true,
    },
    value: {
      type: Number,
      required: true,
    },
    price: {
      type: Number,
      required: false,
    },
    drafted: {
      type: Boolean,
      required: true,
    },
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
      },
      versionKey: false,
    },
    timestamps: true,
  }
);

playerSchema.static('build', (attributes: PlayerAttributes) => {
  return new Player(attributes);
});

const Player = mongoose.model<PlayerDocument, PlayerModel>(
  'Player',
  playerSchema
);

export default Player;
