import mongoose, { Mongoose } from 'mongoose';
import { Meeting, Reservation, Participant, Registrant } from './schemas';
import { appConfig } from '../../../domain/config/appConfig';

export class MongoDatabaseService {
  connectPromise: Promise<Mongoose>;
  constructor(private dbUri: string) {
    this.connectPromise = mongoose.connect(dbUri);
  }

  // Create a new meeting
  async createMeeting(meetingData: {
    title: string;
    description: string;
    date: Date;
    maxParticipants: number;
  }) {
    const meeting = new Meeting({
      title: meetingData.title,
      description: meetingData.description,
      date: meetingData.date,
      maxParticipants: meetingData.maxParticipants
    });
    await meeting.save();
    return meeting;
  }

  async getLatestMeeting() {
    return Meeting.findOne({}).sort({ date: -1 }).exec();
  }

  // Create a new reservation
  async createReservation(reservationData: {
    meetingId: string;
    participantIds: string[];
    status: 'reserved' | 'paid' | 'released' | 'refunded' | 'cancelled';
  }) {
    const reservation = new Reservation({
      meetingId: new mongoose.Types.ObjectId(reservationData.meetingId),
      participantIds: reservationData.participantIds,
      status: reservationData.status
    });
    await reservation.save();
    return reservation;
  }
  async changeReservationStatus(
    reservationId: string,
    status: 'reserved' | 'paid' | 'released' | 'refunded' | 'cancelled'
  ) {
    return Reservation.findByIdAndUpdate(reservationId, { status }).exec();
  }

  async findRegistrantByEmail(email: string) {
    return Registrant.findOne({ email }).exec();
  }

  async createRegistrant(registrantData: {
    name: string;
    email: string;
    stripeCustomerId: string;
  }) {
    const registrant = new Registrant({
      name: registrantData.name,
      email: registrantData.email,
      stripeCustomerId: registrantData.stripeCustomerId
    });
    await registrant.save();
    return registrant;
  }

  async createOrUpdateParticipant(participantData: {
    email: string;
    name: string;
    country: string;
    organization: string;
    stripeCustomerId?: string;
    meetingId?: string;
    reservedBy?: string;
  }) {
    const filter = { email: participantData.email }; // Unique identifier for the participant
    const update = { ...participantData };
    const options = { new: true, upsert: true }; // Return the modified document rather than the original. upsert = true creates a new doc if no match is found.

    const participant = await Participant.findOneAndUpdate(filter, update, options).exec();
    return participant;
  }

  // Get the count of reserved seats for a meeting
  async getReservedSeatsCount(meetingId: string): Promise<number> {
    const meetingObjectId = new mongoose.Types.ObjectId(meetingId);
    const reservations = await Reservation.aggregate([
      { $match: { meetingId: meetingObjectId, status: { $in: ['reserved', 'paid'] } } },
      { $unwind: '$participantIds' },
      { $group: { _id: null, count: { $sum: 1 } } }
    ]);

    return reservations.length > 0 ? reservations[0].count : 0;
  }
}

export const mongoDatabaseService = new MongoDatabaseService(appConfig.keys.mongoUri);
