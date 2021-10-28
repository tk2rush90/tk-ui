export class PaginationUtil {
  /**
   * get default pagination
   * @param total total pages
   * @param page current page (starts from `1`)
   * @param display display count of pages at once
   */
  static getDefaultPagination(total: number, page: number, display: number): number[] {
    this._checkPageValidation(total, page);

    const half = Math.floor(display / 2);
    const even = display % 2 === 0;
    const previous = even ? half - 1 : half;

    let start = Math.max(1, page - previous);
    const pages = [];

    while (pages.length < display) {
      pages.push(start);

      start++;
    }

    return pages;
  }

  /**
   * get row number pagination
   * @param total total row length
   * @param size page size
   * @param page current page (starts from `1`)
   */
  static getRowNumberPagination(total: number, size: number, page: number): RowNumberPagination {
    const totalPage = Math.ceil(total / size);

    this._checkPageValidation(totalPage, page);

    return {
      start: (page - 1) * size + 1,
      end: Math.min(page * size, total),
    };
  }

  /**
   * get ellipsis pagination
   * @param total total pages
   * @param page current page (starts from `1`)
   * @param startDisplay display count for starting pages
   * @param middleDisplay display count for middle pages
   * @param endDisplay display count for ending pages
   * @example
   * PaginationUtil.getEllipsisPagination(30, 1, 2, 5, 2); // {start: [1, 2, 3, 4, 5, 6, 7, 8], middle: [], end: [29, 30]}
   * PaginationUtil.getEllipsisPagination(30, 2, 2, 5, 2); // {start: [1, 2, 3, 4, 5, 6, 7, 8], middle: [], end: [29, 30]}
   * PaginationUtil.getEllipsisPagination(30, 3, 2, 5, 2); // {start: [1, 2, 3, 4, 5, 6, 7, 8], middle: [], end: [29, 30]}
   * PaginationUtil.getEllipsisPagination(30, 4, 2, 5, 2); // {start: [1, 2, 3, 4, 5, 6, 7, 8], middle: [], end: [29, 30]}
   * PaginationUtil.getEllipsisPagination(30, 5, 2, 5, 2); // {start: [1, 2, 3, 4, 5, 6, 7, 8], middle: [], end: [29, 30]}
   * PaginationUtil.getEllipsisPagination(30, 6, 2, 5, 2); // {start: [1, 2], middle: [4, 5, 6, 7, 8], end: [29, 30]}
   * PaginationUtil.getEllipsisPagination(11, 5, 2, 5, 2); // {start: [1, 2, 3, 4, 5, 6, 7, 8], middle: [], end: [10, 11]}
   * PaginationUtil.getEllipsisPagination(11, 6, 2, 5, 2); // {start: [1, 2], middle: [4, 5, 6, 7, 8], end: [10, 11]}
   * PaginationUtil.getEllipsisPagination(11, 7, 2, 5, 2); // {start: [1, 2], middle: [], end: [4, 5, 6, 7, 8, 9, 10, 11]}
   * PaginationUtil.getEllipsisPagination(10, 1, 2, 5, 2); // {start: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10], middle: [], end: []}
   * PaginationUtil.getEllipsisPagination(30, 1, 3, 5, 3); // {start: [1, 2, 3, 4, 5, 6, 7, 8, 9], middle: [], end: [28, 29, 30]}
   * PaginationUtil.getEllipsisPagination(30, 7, 3, 5, 3); // {start: [1, 2, 3], middle: [5, 6, 7, 8, 9], end: [28, 29, 30]}
   */
  static getEllipsisPagination(total: number, page: number, startDisplay: number, middleDisplay: number, endDisplay: number): EllipsisPagination {
    this._checkPageValidation(total, page);

    const startEdgeDisplay = startDisplay + middleDisplay + 1;
    const endEdgeDisplay = endDisplay + middleDisplay + 1;
    const pagination: EllipsisPagination = new EllipsisPagination();

    if (total <= startDisplay + middleDisplay + endDisplay + 1) {
      // render only starts
      pagination.renderStartPages(total);
    } else {
      const middleHalf = Math.floor(middleDisplay / 2);
      const middleEven = middleDisplay % 2 === 0;
      const middlePrevious = middleEven ? middleHalf - 1 : middleHalf;

      const middleStart = Math.max(1, page - middlePrevious);
      const middleEnd = Math.min(total, page + middleHalf);

      if (1 + startDisplay >= middleStart) {
        // do not render middle
        pagination.renderStartPages(startEdgeDisplay);
        pagination.renderEndPages(total, endDisplay);
      } else if (total - endDisplay <= middleEnd) {
        // do not render middle
        pagination.renderStartPages(startDisplay);
        pagination.renderEndPages(total, endEdgeDisplay);
      } else {
        // render middle
        pagination.renderStartPages(startDisplay);
        pagination.renderMiddlePages(middleStart, middleDisplay);
        pagination.renderEndPages(total, endDisplay);
      }
    }

    return pagination;
  }

  /**
   * check page validation
   * @param total total page
   * @param page current page
   */
  private static _checkPageValidation(total: number, page: number): void {
    if (page > total || page < 1) {
      throw new Error('Invalid page number');
    }
  }
}

/**
 * row number pagination
 */
export interface RowNumberPagination {
  /**
   * start row number
   */
  start: number;

  /**
   * end row number
   */
  end: number;
}

/**
 * ellipsis pagination
 * each pages are distinguished by ellipsis
 */
export class EllipsisPagination {
  /**
   * starting pages
   */
  start: number[] = [];

  /**
   * middle pages
   */
  middle: number[] = [];

  /**
   * end pages
   */
  end: number[] = [];

  /**
   * render start pages
   * @param display display count of start
   */
  renderStartPages(display: number): void {
    let page = 1;

    while (this.start.length < display) {
      this.start.push(page);
      page++;
    }
  }

  /**
   * render middle pages
   * @param start start page of middle
   * @param display display count of middle
   */
  renderMiddlePages(start: number, display: number): void {
    while (this.middle.length < display) {
      this.middle.push(start);
      start++;
    }
  }

  /**
   * render end pages
   * @param total total pages
   * @param display display count of end
   */
  renderEndPages(total: number, display: number): void {
    while (this.end.length < display) {
      this.end.unshift(total);
      total--;
    }
  }
}
