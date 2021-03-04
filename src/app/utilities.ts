export class Utilities {
  public static lifetimeToString(lifetime: number): string {
    const hours: number = Math.floor(lifetime / 3600);
    const mins: number = Math.floor((lifetime % 3600) / 60);
    return `${(hours < 10) ? '0' + hours : hours}:${(mins < 10) ? '0' + mins : mins}`;
  }
}
