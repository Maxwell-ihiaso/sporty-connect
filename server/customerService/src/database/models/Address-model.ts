import mongoose, { Document, Model, Schema } from 'mongoose';

export interface IAddress extends Document {
  street: string;
  postalCode: string;
  city: string;
  country: string;
}

const AddressSchema: Schema<IAddress> = new Schema({
  street: String,
  postalCode: String,
  city: String,
  country: String,
});

const AddressModel: Model<IAddress> = mongoose.model<IAddress>(
  'address',
  AddressSchema,
);

export default AddressModel;
