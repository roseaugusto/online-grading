import { read, utils } from 'xlsx';
export * from 'xlsx';

export class Excel {
  static async read(file) {
    const reader = new FileReader();
    return new Promise((resolve, reject) => {
      reader.onload = (e) => {
        try {
          const data = new Uint8Array(e.target.result);
          const workbook = read(data, {
            type: 'array',
            cellDates: true,
          });
          resolve(workbook);
        } catch (e) {
          reject(e);
        }
      };
      reader.readAsArrayBuffer(file);
    });
  }

  static downloadXlsm(blob, filename) {
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
  }

  static getLastIndex(coverSheet) {
    const result = [];

    let row;
    let rowNum;
    let colNum;

    const range = coverSheet['!ref']
      ? utils.decode_range(coverSheet['!ref'])
      : { e: { c: 0, r: 0 }, s: { c: 0, r: 0 } };

    for (rowNum = range.s.r; rowNum <= range.e.r; rowNum++) {
      row = [];
      for (colNum = range.s.c; colNum <= range.e.c; colNum++) {
        const nextCell = coverSheet[utils.encode_cell({ r: rowNum, c: colNum })];
        if (typeof nextCell !== 'undefined' || nextCell) {
          row.push(nextCell.w);
        }
      }
      if (row.length >= 15) {
        result.push(row);
      }
    }
    return result.filter((item) => item.length).length;
  }
}
