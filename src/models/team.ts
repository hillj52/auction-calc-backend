import mongoose from 'mongoose';
import { PlayerDocument } from './player';

export interface TeamAttributes {
  name: string;
  owner: string;
  money: number;
  qb?: PlayerDocument;
  rb1?: PlayerDocument;
  rb2?: PlayerDocument;
  wr1?: PlayerDocument;
  wr2?: PlayerDocument;
  flex?: PlayerDocument;
  op?: PlayerDocument;
  te?: PlayerDocument;
  k?: PlayerDocument;
  dst?: PlayerDocument;
  bench?: PlayerDocument[];
}

export interface TeamDocument extends mongoose.Document {
  name: string;
  owner: string;
  money: number;
  qb?: PlayerDocument;
  rb1?: PlayerDocument;
  rb2?: PlayerDocument;
  wr1?: PlayerDocument;
  wr2?: PlayerDocument;
  flex?: PlayerDocument;
  op?: PlayerDocument;
  te?: PlayerDocument;
  k?: PlayerDocument;
  dst?: PlayerDocument;
  bench?: PlayerDocument[];
}

export interface TeamModel extends mongoose.Model<TeamDocument> {
  build(attributes: TeamAttributes): TeamDocument;
}

const teamSchema = new mongoose.Schema<TeamDocument>(
  {
    name: {
      type: String,
      required: true,
    },
    owner: {
      type: String,
      required: true,
    },
    money: {
      type: Number,
      required: true,
    },
    qb: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Player',
      required: false,
      autopopulate: true,
    },
    rb1: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Player',
      required: false,
      autopopulate: true,
    },
    rb2: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Player',
      required: false,
      autopopulate: true,
    },
    wr1: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Player',
      required: false,
      autopopulate: true,
    },
    wr2: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Player',
      required: false,
      autopopulate: true,
    },
    flex: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Player',
      required: false,
      autopopulate: true,
    },
    op: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Player',
      required: false,
      autopopulate: true,
    },
    te: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Player',
      required: false,
      autopopulate: true,
    },
    k: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Player',
      required: false,
      autopopulate: true,
    },
    dst: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Player',
      required: false,
      autopopulate: true,
    },
    bench: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: 'Player',
      required: false,
      autopopulate: true,
    },
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
      },
    },
  }
);

teamSchema.plugin(require('mongoose-autopopulate'));

teamSchema.static(
  'build',
  (attributes: TeamAttributes) => new Team(attributes)
);

const Team = mongoose.model<TeamDocument, TeamModel>('Team', teamSchema);

export default Team;
