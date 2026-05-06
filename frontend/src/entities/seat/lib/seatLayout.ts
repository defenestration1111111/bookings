export function buildColumnGroups(columns: string[], aislesAfter: string[]): string[][] {
  const groups: string[][] = [];
  let current: string[] = [];

  for (const col of columns) {
    current.push(col);
    if (aislesAfter.includes(col)) {
      groups.push(current);
      current = [];
    }
  }

  if (current.length > 0) groups.push(current);
  return groups;
}
