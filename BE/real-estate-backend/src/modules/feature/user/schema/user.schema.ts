import { HydratedDocument, Schema as MongooseSchema } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Role } from 'src/types/common.type';

export type UserDocument = HydratedDocument<User>;

@Schema({ timestamps: true })
export class User {
  @Prop({
    required: true,
    unique: true,
    index: true,
    validate: {
      validator: (v: string) => /^0x[a-fA-F0-9]{40}$/.test(v),
      message: (props) => `${props.value} is not a valid Ethereum address!`,
    },
  })
  walletAddress: string;

  @Prop({ type: String, required: true })
  name: string;

  @Prop({ type: String, required: true, unique: true })
  email: string;

  @Prop({ type: String, required: true, select: false })
  password: string;

  // @Prop({ type: String, required: true, enum: Role })
  // role: Role;

  // @Prop({
  //   type: Boolean,
  //   required: true,
  //   name: 'is_email_verified',
  //   default: false,
  // })
  // isEmailVerified: boolean;

  // @Prop({ type: Date, default: null })
  // emailVerifiedAt: Date | null;
}

export const UserSchema = SchemaFactory.createForClass(User);
