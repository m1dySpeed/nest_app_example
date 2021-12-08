import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type RootDocument = Root & Document;

export const ROOT_COLLECTION = 'root';

@Schema({ collection: ROOT_COLLECTION, autoCreate: true, _id: true })
export class Root extends Document {
  @Prop()
  username: string;

  @Prop()
  password: string;

  @Prop()
  role: string;
}

export const RootSchema = SchemaFactory.createForClass(Root);
