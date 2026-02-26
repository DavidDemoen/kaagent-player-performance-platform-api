export function generatePlayerSlug(
  firstName: string,
  lastName: string,
): string {
  const trimmedFirst = firstName.trim();
  const trimmedLast = lastName.trim();
  return `${trimmedFirst}-${trimmedLast}`.toLowerCase().replace(/\s+/g, '-');
}
