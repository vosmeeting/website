import mongoose, { Document, Schema } from 'mongoose';

export interface IMeeting extends Document {
  title: string;
  description: string;
  maxParticipants: number;
}

export interface IReservation extends Document {
  meetingId: mongoose.Types.ObjectId;
  participantIds: mongoose.Types.ObjectId[];
  status: 'reserved' | 'paid' | 'released' | 'refunded';
  createdAt: Date;
  heldUntil: Date | null;
}

export interface IParticipant extends Document {
  name: string;
  email: string;
  meetingId: mongoose.Types.ObjectId;
  reservedBy: mongoose.Types.ObjectId;
  organization: string;
  country: string;
}

export interface IRegistrant extends Document {
  name: string;
  email: string;
  stripeCustomerId: string;
  participantId?: mongoose.Types.ObjectId;
}

const meetingSchema = new Schema({
  title: { type: String, required: true },
  description: String,
  date: { type: Date, required: true },
  maxParticipants: { type: Number, required: true }
});

const reservationSchema = new Schema({
  meetingId: { type: Schema.Types.ObjectId, ref: 'Meeting', required: true },
  participantIds: [{ type: Schema.Types.ObjectId, ref: 'Participant' }],
  status: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  heldUntil: { type: Date, default: null }
});

const participantSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  meetingId: { type: Schema.Types.ObjectId, ref: 'Meeting', required: false },
  reservedBy: { type: Schema.Types.ObjectId, ref: 'Participant', default: null },
  status: { type: String, default: 'registered' },
  organization: { type: String, required: true },
  country: { type: String, required: true }
});

const registrantSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  stripeCustomerId: { type: String, required: true },
  participantId: { type: Schema.Types.ObjectId, ref: 'Participant', default: null, required: false }
});

export const Meeting =
  mongoose.models?.Meeting || mongoose.model<IMeeting>('Meeting', meetingSchema);
export const Reservation =
  mongoose.models?.Reservation || mongoose.model<IReservation>('Reservation', reservationSchema);
export const Participant =
  mongoose.models?.Participant || mongoose.model<IParticipant>('Participant', participantSchema);
export const Registrant =
  mongoose.models?.Registrant || mongoose.model<IRegistrant>('Registrant', registrantSchema);
