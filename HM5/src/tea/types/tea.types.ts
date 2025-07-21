import { CreateTeaDto } from '../dto/tea.dto';

export interface Tea extends CreateTeaDto {
  id: string;
}

export interface FindAllOptions {
  minRating?: number;
  page: number;
  limit: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}