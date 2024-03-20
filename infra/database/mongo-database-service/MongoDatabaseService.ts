import mongoose, { Mongoose } from 'mongoose';
import { Meeting, Reservation, Participant, Registrant, IMeeting } from './schemas';
import { appConfig } from '../../../domain/config/appConfig';
import { v4 as uuid } from 'uuid';
import { ReservationType } from '../../../types';

export class MongoDatabaseService {
  connectPromise: Promise<Mongoose>;
  constructor(private dbUri: string) {
    if (!dbUri) {
      throw new Error('MongoDatabaseService error: MONGODB URI is not set');
    }
    this.connectPromise = mongoose.connect(dbUri);
  }

  // Create a new meeting
  async createMeeting(meetingData: {
    title: string;
    description: string;
    date: Date;
    maxParticipants: number;
  }) {
    await this.connectPromise;
    const meeting = new Meeting({
      title: meetingData.title,
      description: meetingData.description,
      date: meetingData.date,
      maxParticipants: meetingData.maxParticipants,
      secretUrlId: uuid()
    });
    await meeting.save();
    return meeting;
  }

  async createReservation(reservationData: {
    meetingId: string;
    participantIds: string[];
    heldUntil: Date;
    reservationType: ReservationType;
  }) {
    const reservation = new Reservation({
      meetingId: new mongoose.Types.ObjectId(reservationData.meetingId),
      participantIds: reservationData.participantIds,
      status: 'reserved',
      heldUntil: reservationData.heldUntil,
      type: reservationData.reservationType
    });
    await reservation.save();
    return reservation;
  }

  async getLatestMeeting() {
    await this.connectPromise;
    return Meeting.findOne({}).sort({ date: -1 }).exec() as Promise<IMeeting>;
  }

  async findMeetingById(meetingId: string) {
    const meeting = await Meeting.findById(meetingId).exec();
    return meeting;
  }

  async alterFromReserved(
    reservationId: string,
    status: 'paid' | 'released' | 'refunded' | 'cancelled'
  ) {
    await this.connectPromise;
    return Reservation.findByIdAndUpdate(reservationId, { status, heldUntil: null }).exec();
  }

  async findRegistrantByEmail(email: string) {
    await this.connectPromise;
    return Registrant.findOne({ email }).exec();
  }

  async createRegistrant(registrantData: {
    name: string;
    email: string;
    stripeCustomerId?: string;
    notifyMe?: boolean;
  }) {
    await this.connectPromise;
    const registrant = new Registrant({
      name: registrantData.name,
      email: registrantData.email,
      stripeCustomerId: registrantData.stripeCustomerId,
      notifyMe: registrantData.notifyMe
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
    await this.connectPromise;

    const participant = await Participant.findOneAndUpdate(filter, update, options).exec();
    return participant;
  }

  // Get the count of reserved seats for a meeting
  async getRegularReservedSeatsCount(meetingId: string): Promise<number> {
    await this.connectPromise;
    const meetingObjectId = new mongoose.Types.ObjectId(meetingId);

    const reservations = await Reservation.aggregate([
      {
        $match: {
          meetingId: meetingObjectId,
          type: { $ne: 'vip' }, // Exclude vip ones
          $or: [
            { status: 'paid' }, // Always include paid reservations
            {
              status: 'reserved',
              heldUntil: { $gt: new Date() } // Include reserved reservations that are still within the payment window
            }
          ]
        }
      },
      { $unwind: '$participantIds' },
      { $group: { _id: null, count: { $sum: 1 } } }
    ]);

    return reservations.length > 0 ? reservations[0].count : 0;
  }
}

export const mongoDatabaseService = new MongoDatabaseService(appConfig.keys.mongoUri);
