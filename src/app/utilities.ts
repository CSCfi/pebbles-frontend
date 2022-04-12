import { IconProp } from '@fortawesome/fontawesome-svg-core';

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

  public static compare(a: number | string, b: number | string, isAsc: boolean) {
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
  }

  public static getApplicationIcon(labels: string[]): IconProp {
    if (labels.includes('js') || labels.includes('javascript')) {
      return ['fab', 'js'];
    } else if (labels.includes('markup') || labels.includes('html')) {
      return ['fas', 'code'];
    } else if (labels.includes('linux') || labels.includes('command line')) {
      return ['fab', 'linux'];
    } else if (labels.includes('ai') || labels.includes('deep learning')) {
      return ['fas', 'brain'];
    } else if (labels.includes('machine learning')) {
      return ['fas', 'circle-nodes'];
    } else if (labels.includes('quantum computing')) {
      return ['fas', 'atom'];
    } else if (labels.includes('bio') || labels.includes('bio informatics')) {
      return ['fas', 'dna'];
    } else if (labels.includes('nlp') || labels.includes('natural language processing')) {
      return ['fas', 'language'];
    } else if (labels.includes('r') || labels.includes('rstudio')) {
      return ['fab', 'r-project'];
    } else if (labels.includes('data analytics') || labels.includes('data science') || labels.includes('analytics')) {
      return ['fas', 'chart-column'];
    } else if (labels.includes('python')) {
      return ['fab', 'python'];
    } else {
      return ['fas', 'book'];
    }
  }

  public static applicationTypeName(type): string {
    switch (type) {
      case 'jupyter':
        return 'Jupyter';
      case 'rstudio':
        return 'RStudio';
      default:
        return 'Generic';
    }
  }
}
