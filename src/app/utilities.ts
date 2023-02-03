export class Utilities {
  public static lifetimeToString(lifetime: number): string {
    const hours: number = Math.floor(lifetime / 3600);
    const mins: number = Math.floor((lifetime % 3600) / 60);
    return `${(hours < 10) ? '0' + hours : hours}:${(mins < 10) ? '0' + mins : mins}`;
  }

  public static resetText(str: string): string {
    str = str.replace(new RegExp('<mark>', 'gi'), (match) => '');
    str = str.replace(new RegExp('</mark>', 'gi'), (match) => '');
    return str;
  }

  public static cleanText(str: string): string {
    str = this.resetText(str);
    return str.toLocaleLowerCase().trim();
  }

  public static getPageSizeOptions(dataSource, minUnitNumber): number[] {
    if (dataSource) {
      const unitNumbers = [];
      for (let i = 1; i < dataSource.data.length / minUnitNumber; i++) {
        unitNumbers.push(minUnitNumber * i);
      }
      unitNumbers.push(dataSource.data.length);
      return unitNumbers;
    }
    return [minUnitNumber];
  }

  static getDate(timestamp: number) {
    return timestamp ? new Date(timestamp).toISOString() : '-';
  }

  static getIsoToTimestamp(isoTime: string): number {
    return Math.floor(new Date(isoTime).getTime() / 1000);
  }

  static getTimeGap(timestamp: number, unit: string | null): number {

    const eventUtfTimestamp = new Date(timestamp).getTime();
    const todayUtfTimestamp = new Date().getTime();
    const offsetTimestamp = eventUtfTimestamp - todayUtfTimestamp;

    let duration;
    switch (unit) {
      case 'second':
        duration = 1000;
        break;
      case 'minute':
        duration = 1000 * 60;
        break;
      case 'hour':
        duration = 1000 * 60 * 60;
        break;
      case 'day':
        duration = 1000 * 60 * 60 * 24;
        break;
      default:
        duration = 1;
    }

    return Math.floor(offsetTimestamp / duration);
  }

  public static compare(a: number | string, b: number | string, isAsc: boolean) {
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
  }

  public static isExpiredTimestamp(ts: number): boolean {
    // if ts has not been set, expiry does not happen
    if (ts === 0) {
      return false;
    }
    return ts * 1000 < Date.now();
  }

  public static camelize(str: string): string {
    return str.replace(/-./g, x => x[1].toUpperCase());
  }
}
