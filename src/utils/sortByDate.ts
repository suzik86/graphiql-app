export interface RequestObject {
  path: string;
  date: string;
  endpoint: string;
}
export function sortByDate(a: RequestObject, b: RequestObject) {
  return new Date(b.date).getTime() - new Date(a.date).getTime();
}
