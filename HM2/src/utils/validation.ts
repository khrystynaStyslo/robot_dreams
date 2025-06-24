export function validateBookData(data: any): string | null {
  if (!data.title || !data.author || !data.year || !data.genre) {
    return 'Missing required fields: title, author, year, genre';
  }

  if (typeof data.year !== 'number' || data.year < 0) {
    return 'Year must be a positive number';
  }

  return null;
}

export function validateId(id: string): number | null {
  const numId = parseInt(id, 10);

  return isNaN(numId) ? null : numId;
}

export function validateUpdateData(data: any): string | null {
  if (data.title !== undefined && (!data.title || typeof data.title !== 'string')) {
    return 'Title must be a non-empty string';
  }

  if (data.author !== undefined && (!data.author || typeof data.author !== 'string')) {
    return 'Author must be a non-empty string';
  }

  if (data.year !== undefined && (typeof data.year !== 'number' || data.year < 0)) {
    return 'Year must be a positive number';
  }

  if (data.genre !== undefined && (!data.genre || typeof data.genre !== 'string')) {
    return 'Genre must be a non-empty string';
  }

  return null;
}