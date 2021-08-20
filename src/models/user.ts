import { Container } from 'typedi';
import mongoose from 'mongoose';
import { UserAttributes } from '../interfaces/user';
import PasswordService from '../services/password-service';

export interface UserDocument extends mongoose.Document {
  email: string;
  password: string;
  roles: string[];
}

export interface UserModel extends mongoose.Model<UserDocument> {
  build(attributes: UserAttributes): UserDocument;
}

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    roles: {
      type: [String],
      default: ['user'],
    },
  },
  {
    toJSON: {
      transform(doc, ret) {
        delete ret.password;
        ret.id = ret._id;
        delete ret._id;
      },
      versionKey: false,
    },
    timestamps: true,
  }
);

userSchema.pre('save', async function (done) {
  if (this.isModified('password')) {
    const passwordService = Container.get(PasswordService);
    const hashed = await passwordService.toHash(this.get('password'));
    this.set('password', hashed);
  }
});

userSchema.static('build', (attributes: UserAttributes) => {
  return new User(attributes);
});

const User = mongoose.model<UserDocument, UserModel>('User', userSchema);

export default User;
