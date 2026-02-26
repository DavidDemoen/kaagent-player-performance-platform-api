export function generatePlayerSlug(
  firstName: string,
  lastName: string,
): string {
  return `${firstName}-${lastName}`.toLowerCase().replace(/\s+/g, '-');
}
