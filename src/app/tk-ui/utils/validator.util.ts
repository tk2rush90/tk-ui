import {AbstractControl, FormControl, ValidationErrors} from '@angular/forms';
import {ValidationUtil} from '@tk-ui/utils/validation.util';
import {DateUtil} from '@tk-ui/utils/date.util';

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

  /**
   * Validate the mm/dd/yy format date.
   * @param control Form control.
   */
  static date(control: AbstractControl): ValidationErrors | null {
    const value = control.value;

    if (value) {
      if (DateUtil.parse(value)) {
        return null;
      }

      return {
        date: true,
      };
    } else {
      return null;
    }
  }

  /**
   * Return the validator function for end date.
   * @param startControl The start date control.
   */
  static endDate(startControl: FormControl): (control: AbstractControl) => ValidationErrors | null {
    /**
     * Validate the date range between and date and start date.
     * @param control The end date control.
     */
    return (control: AbstractControl) => {
      if (control.value && startControl.value) {
        const end = DateUtil.parse(control.value);
        const start = DateUtil.parse(startControl.value);

        if (end && start && end < start) {
          return {
            endDate: true,
          };
        }
      }

      return null;
    }
  }

  /**
   * Return the validator function for start date.
   * @param endControl The end date control.
   */
  static startDate(endControl: FormControl): (control: AbstractControl) => ValidationErrors | null {
    /**
     * Validate the date range between and date and start date.
     * @param control The start date control.
     */
    return (control: AbstractControl) => {
      if (control.value && endControl.value) {
        const start = DateUtil.parse(control.value);
        const end = DateUtil.parse(endControl.value);

        if (end && start && end < start) {
          return {
            startDate: true,
          };
        }
      }

      return null;
    }
  }

  /**
   * Return the validator function for old password field.
   * @param newPassword The FormControl for new password.
   * @param confirmNewPassword The FormControl for confirm new password.
   */
  static oldPassword(newPassword: FormControl, confirmNewPassword: FormControl): (control: AbstractControl) => ValidationErrors | null {
    /**
     * Validate `oldPassword` field by checking `newPassword` and `confirmNewPassword`.
     * If `newPassword` or `confirmPassword` has value and `oldPassword` doesn't,
     * return the ValidationErrors.
     * @param control The `oldPassword` control.
     */
    return (control: AbstractControl) => {
      if (newPassword.value || confirmNewPassword.value) {
        if (!control.value) {
          return {
            oldPassword: true,
          };
        }
      }

      return null;
    }
  }

  /**
   * Return the validator function for new password field.
   * @param oldPassword The FormControl for old password.
   */
  static newPassword(oldPassword: FormControl): (control: AbstractControl) => ValidationErrors | null {
    /**
     * Validate `newPassword` field by checking `oldPassword`.
     * If `oldPassword` has value and `newPassword` doesn't,
     * return the ValidationErrors.
     * @param control The `newPassword` control.
     */
    return (control: AbstractControl) => {
      if (oldPassword.value) {
        if (!control.value) {
          return {
            newPassword: true,
          };
        } else if (oldPassword.value === control.value) {
          return {
            samePassword: true,
          };
        }
      }

      return null;
    }
  }

  /**
   * Return the validator function for confirm password field.
   * @param password The FormControl for password.
   */
  static confirmPassword(password: FormControl): (control: AbstractControl) => ValidationErrors | null {
    /**
     * Validate `confirmPassword` field by checking `password`.
     * If `password` has value and `confirmPassword` doesn't,
     * return the ValidationErrors.
     * @param control The `confirmPassword` control.
     */
    return (control: AbstractControl) => {
      if (password.value || control.value) {
        if (password.value !== control.value) {
          return {
            confirmPassword: true,
          };
        }
      }

      return null;
    }
  }
}
