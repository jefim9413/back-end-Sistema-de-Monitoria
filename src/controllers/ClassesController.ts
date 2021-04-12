import { Request, Response } from 'express';
import { getCustomRepository } from 'typeorm';

import ClassesRepository from '../repositories/ClassesRepository';

class ClassesController {
  async create(req: Request, res: Response): Promise<any> {
    const { name, avatar, whatsapp, bio, subject, cost, schedule } = req.body;
    res.json({ status: 'OK' });
    const classesRepository = getCustomRepository(ClassesRepository);

    schedule.map(
      async (item: { week_day: number; from: string; to: string }) => {
        const classes = classesRepository.create({
          name,
          avatar,
          whatsapp,
          bio,
          subject,
          cost,
          weekday: item.week_day,
          time_from: Number(item.from.slice(0, 2)),
          time_to: Number(item.to.slice(0, 2)),
        });
        await classesRepository.save(classes);
      },
    );
  }

  async index(request: Request, response: Response): Promise<any> {
    const filters = request.query;
    const subject = filters.subject as string;
    const week_day = filters.weekday as string;
    const time = filters.time as string;
    const weekday = Number(week_day);
    const time_from = Number(time?.slice(0, 2));

    const classesRepository = getCustomRepository(ClassesRepository);

    if (!filters.weekday || !filters.subject || !filters.time) {
      return response.status(400).json({
        error: 'Missing filters to search classes',
      });
    }

    const listCourses = await classesRepository.find({
      where: {
        subject,
        weekday,
        time_from,
      },
    });
    return response.send(listCourses);
  }
}
export default ClassesController;
