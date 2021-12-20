import {ValidationUtil} from '@tk-ui/utils/validation.util';

export interface UnrefinedParams {
  [key: string]: any;
}

export class ApiBaseService {
  // api host
  private readonly _host: string;

  constructor(path = '', host = '') {
    this._host = host;
    this._host += path;
  }

  /**
   * return the api endpoint
   * @param path path string
   */
  protected endpoint(path = ''): string {
    return this._host + path;
  }

  /**
   * create http params from object type params
   * @param params params
   */
  protected _getHttpParams(params: UnrefinedParams): { [k: string]: string } {
    const refined: { [k: string]: string } = {};

    Object.keys(params || {}).forEach(key => {
      if (ValidationUtil.isDefined(params[key])) {
        refined[key] = params[key] + '';
      }
    });

    return refined;
  }
}
