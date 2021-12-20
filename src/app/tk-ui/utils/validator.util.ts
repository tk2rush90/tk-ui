import {AbstractControl, ValidationErrors} from '@angular/forms';
import {ValidationUtil} from '@tk-ui/utils/validation.util';

export class ValidatorUtil {
  /**
   * text required validator
   * @param control form control
   */
  static textRequired(control: AbstractControl): ValidationErrors | null {
    const value = control.value;

    if (ValidationUtil.isValidText(value)) {
      return null;
    } else {
      return {
        required: true,
      };
    }
  }

  /**
   * email validator
   * @param control form control
   */
  static email(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    const reg = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    if (reg.test(value)) {
      return null;
    } else {
      return {
        email: true,
      };
    }
  }
}
