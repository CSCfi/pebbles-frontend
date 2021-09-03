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

  public static getPageSizeOptions(dataSource, minUnitNumber): number[]{
    if (dataSource) {
      const unitNumbers = [];
      for ( let i = 1; i < dataSource.data.length / minUnitNumber; i++) {
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
}
