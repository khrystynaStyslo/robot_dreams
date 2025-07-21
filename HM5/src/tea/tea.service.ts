import { Injectable } from '@nestjs/common';
import { CreateTeaDto, UpdateTeaDto } from './dto/tea.dto';
import { Tea, FindAllOptions, PaginatedResponse } from './types/tea.types';

@Injectable()
export class TeaService {
  private teas: Tea[] = [];
  private nextId = 1;

  async findAll(options: FindAllOptions): Promise<PaginatedResponse<Tea>> {
    let filteredTeas = this.teas;

    if (options.minRating !== undefined) {
      const minRating = options.minRating;

      filteredTeas = filteredTeas.filter(tea => {
        return tea.rating && tea.rating >= minRating
      });
    }

    const total = filteredTeas.length;
    const totalPages = Math.ceil(total / options.limit);
    const offset = (options.page - 1) * options.limit;
    const data = filteredTeas.slice(offset, offset + options.limit);

    return {
      data,
      total,
      page: options.page,
      pageSize: options.limit,
      totalPages,
    };
  }

  async findOne(id: string): Promise<Tea | null> {
    return this.teas.find(tea => tea.id === id) || null;
  }

  async create(createTeaDto: CreateTeaDto): Promise<Tea> {
    const tea: Tea = {
      id: this.nextId.toString(),
      ...createTeaDto,
    };
    this.teas.push(tea);
    this.nextId++;

    return tea;
  }

  async update(id: string, updateTeaDto: UpdateTeaDto): Promise<Tea | null> {
    const teaIndex = this.teas.findIndex(tea => tea.id === id);

    if (teaIndex === -1) {
      return null;
    }
    
    this.teas[teaIndex] = { ...this.teas[teaIndex], ...updateTeaDto };

    return this.teas[teaIndex];
  }

  async remove(id: string): Promise<boolean> {
    const teaIndex = this.teas.findIndex(tea => tea.id === id);

    if (teaIndex === -1) {
      return false;
    }
    
    this.teas.splice(teaIndex, 1);

    return true;
  }
}
