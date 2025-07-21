import { z } from 'zod';
import { ApiProperty } from '@nestjs/swagger';

export const TeaSchema = z.object({
  name: z.string().min(3, 'Name is required').max(40),
  origin: z.string().min(2, 'Origin is required').max(30),
  rating: z.number().min(1).max(10).positive('Rating must be positive').optional(),
  brewTemp: z.number().min(60).max(100).optional(),
  notes: z.string().max(150).optional(),
});

export class CreateTeaDto {
  @ApiProperty({ description: 'Tea name', minLength: 3, maxLength: 40 })
  name: string;

  @ApiProperty({ description: 'Tea origin', minLength: 2, maxLength: 30 })
  origin: string;

  @ApiProperty({ description: 'Tea rating', minimum: 1, maximum: 10, required: false })
  rating?: number;

  @ApiProperty({ description: 'Brewing temperature', minimum: 60, maximum: 100, required: false })
  brewTemp?: number;

  @ApiProperty({ description: 'Tea notes', maxLength: 150, required: false })
  notes?: string;
}

export const UpdateTeaSchema = TeaSchema.partial();

export class UpdateTeaDto {
  @ApiProperty({ description: 'Tea name', minLength: 3, maxLength: 40, required: false })
  name?: string;

  @ApiProperty({ description: 'Tea origin', minLength: 2, maxLength: 30, required: false })
  origin?: string;

  @ApiProperty({ description: 'Tea rating', minimum: 1, maximum: 10, required: false })
  rating?: number;

  @ApiProperty({ description: 'Brewing temperature', minimum: 60, maximum: 100, required: false })
  brewTemp?: number;

  @ApiProperty({ description: 'Tea notes', maxLength: 150, required: false })
  notes?: string;
}