import { Injectable } from '@angular/core';
import { Angular5Csv } from 'angular5-csv/Angular5-csv';

@Injectable({
  providedIn: 'root'
})
export class FileService {

  constructor() { }

  exportDataAsExcel(data, name) {
    const options = {
      fieldSeparator: ',',
      quoteStrings: '"',
      decimalseparator: '.',
      showLabels: true,
      showTitle: true,
      useBom: true,
      noDownload: true
    };
    return new Angular5Csv(data, name, options);
  }

}
