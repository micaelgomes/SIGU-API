import { startOfHour } from 'date-fns';
import { getCustomRepository } from 'typeorm';
import Appointment from '../models/Appointment';
import AppointmentsRepository from '../repositories/AppointmentsRepository';

interface RequestDTO {
  providerId: string;
  date: Date;
}

class CreateAppointmentService {
  public async execute({ providerId, date }: RequestDTO): Promise<Appointment> {
    const appointmentsRepository = getCustomRepository(AppointmentsRepository);

    const appointmentData = startOfHour(date);

    const appointmentExists = await appointmentsRepository.findByDate(
      appointmentData,
    );

    if (appointmentExists) throw Error('This appointment has been booking. 😰');

    const appointment = appointmentsRepository.create({
      providerId,
      date: appointmentData,
    });

    await appointmentsRepository.save(appointment);

    return appointment;
  }
}

export default CreateAppointmentService;
