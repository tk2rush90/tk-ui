export class EventUtil {
  /**
   * detect pressed key type
   * @param event keyboard event
   * @param type key type
   */
  static isKey(event: KeyboardEvent, type: AvailableKey): boolean {
    if (event) {
      const key = event.code;
      // keyCode is used for Safari on Mac
      // tslint:disable-next-line:deprecation
      const code = event.keyCode;

      return key === type || KEY_MAP[type].indexOf(code) !== -1;
    } else {
      return false;
    }
  }

  /**
   * neutralize the event
   * @param event event
   */
  static neutralize(event: Event): void {
    event.stopPropagation();
    event.preventDefault();
  }

  /**
   * return `true` when command key is pressed
   * @param event keyboard event
   * @param commandKeys command key array
   * @param key other key
   */
  static isCommand(event: KeyboardEvent, commandKeys: CommandKey[], key: AvailableKey): boolean {
    if (event) {
      const isKey = this.isKey(event, key);
      const isCommand = this._isOnlyCommand(event, commandKeys);

      return isKey && isCommand;
    } else {
      return false;
    }
  }

  /**
   * Get xy position from mouse or touch event
   * @param event event
   */
  static getMouseOrTouchXY(event?: MouseEvent | TouchEvent): { x: number, y: number } {
    return {
      x: (event as MouseEvent)?.x || (event as TouchEvent)?.touches[0]?.pageX || 0,
      y: (event as MouseEvent)?.y || (event as TouchEvent)?.touches[0]?.pageY || 0,
    };
  }

  /**
   * return `true` when only the command key array are pushed
   * @param event keyboard event
   * @param commandKeys command key array
   */
  private static _isOnlyCommand(event: KeyboardEvent, commandKeys: CommandKey[]): boolean {
    if (event) {
      const toBePressed: CommandKeyMap = {
        [CommandKey.ctrl]: false,
        [CommandKey.alt]: false,
        [CommandKey.shift]: false,
        [CommandKey.meta]: false,
      };

      const isPressed: CommandKeyMap = {
        [CommandKey.ctrl]: false,
        [CommandKey.alt]: false,
        [CommandKey.shift]: false,
        [CommandKey.meta]: false,
      };

      // check to be pressed
      commandKeys.forEach(key => {
        toBePressed[key] = true;
      });

      isPressed[CommandKey.ctrl] = event.ctrlKey;
      isPressed[CommandKey.shift] = event.shiftKey;
      isPressed[CommandKey.alt] = event.altKey;
      isPressed[CommandKey.meta] = event.metaKey;

      return Object.keys(toBePressed).every(key => {
        return toBePressed[key as CommandKey] === isPressed[key as CommandKey];
      });
    } else {
      return false;
    }
  }

  /**
   * return the wheel direction with deltaY
   * @param deltaY deltaY value
   */
  static getWheelDirection(deltaY: number): WheelDirection {
    if (deltaY > 0) {
      return WheelDirection.downward;
    } else if (deltaY < 0) {
      return WheelDirection.upward;
    } else {
      return WheelDirection.none;
    }
  }

  /**
   * get the distance between two fingers
   * @param first first finger
   * @param second second finger
   */
  static getFingerDistance(first: Touch | null, second: Touch | null): number {
    let distance = 0;

    if (first && second) {
      distance = Math.hypot(first.pageX - second.pageX, first.pageY - second.pageY);
    }

    return distance;
  }
}

/**
 * available key enum
 */
export enum AvailableKey {
  ContextMenu = 'ContextMenu',
  Backspace = 'Backspace',
  Enter = 'Enter',
  Space = 'Space',
  Tab = 'Tab',
  Delete = 'Delete',
  End = 'End',
  Help = 'Help',
  Home = 'Home',
  Insert = 'Insert',
  PageDown = 'PageDown',
  PageUp = 'PageUp',
  ArrowDown = 'ArrowDown',
  ArrowLeft = 'ArrowLeft',
  ArrowRight = 'ArrowRight',
  ArrowUp = 'ArrowUp',
  Escape = 'Escape',
  PrintScreen = 'PrintScreen',
  ScrollLock = 'ScrollLock',
  Pause = 'Pause',
  AltLeft = 'AltLeft',
  AltRight = 'AltRight',
  CapsLock = 'CapsLock',
  ControlLeft = 'ControlLeft',
  ControlRight = 'ControlRight',
  OSLeft = 'OSLeft',
  OSRight = 'OSRight',
  ShiftLeft = 'ShiftLeft',
  ShiftRight = 'ShiftRight',
  F1 = 'F1',
  F2 = 'F2',
  F3 = 'F3',
  F4 = 'F4',
  F5 = 'F5',
  F6 = 'F6',
  F7 = 'F7',
  F8 = 'F8',
  F9 = 'F9',
  F10 = 'F10',
  F11 = 'F11',
  F12 = 'F12',
  F13 = 'F13',
  F14 = 'F14',
  F15 = 'F15',
  F16 = 'F16',
  F17 = 'F17',
  F18 = 'F18',
  F19 = 'F19',
  F20 = 'F20',
  F21 = 'F21',
  F22 = 'F22',
  F23 = 'F23',
  F24 = 'F24',
  Digit1 = 'Digit1',
  Digit2 = 'Digit2',
  Digit3 = 'Digit3',
  Digit4 = 'Digit4',
  Digit5 = 'Digit5',
  Digit6 = 'Digit6',
  Digit7 = 'Digit7',
  Digit8 = 'Digit8',
  Digit9 = 'Digit9',
  Digit0 = 'Digit0',
  KeyA = 'KeyA',
  KeyB = 'KeyB',
  KeyC = 'KeyC',
  KeyD = 'KeyD',
  KeyE = 'KeyE',
  KeyF = 'KeyF',
  KeyG = 'KeyG',
  KeyH = 'KeyH',
  KeyI = 'KeyI',
  KeyJ = 'KeyJ',
  KeyK = 'KeyK',
  KeyL = 'KeyL',
  KeyM = 'KeyM',
  KeyN = 'KeyN',
  KeyO = 'KeyO',
  KeyP = 'KeyP',
  KeyQ = 'KeyQ',
  KeyR = 'KeyR',
  KeyS = 'KeyS',
  KeyT = 'KeyT',
  KeyU = 'KeyU',
  KeyV = 'KeyV',
  KeyW = 'KeyW',
  KeyX = 'KeyX',
  KeyY = 'KeyY',
  KeyZ = 'KeyZ',
}

export const KEY_MAP = {
  ContextMenu: [0, 93],
  Backspace: [8],
  Enter: [13],
  Space: [32],
  Tab: [9],
  Delete: [46, 8], // Mac OS may use 8 for Delete
  End: [35],
  Help: [6, 45, 47],
  Home: [36],
  Insert: [45],
  PageDown: [34],
  PageUp: [33],
  ArrowDown: [40],
  ArrowLeft: [37],
  ArrowRight: [39],
  ArrowUp: [38],
  Escape: [27],
  PrintScreen: [124, 42, 44],
  ScrollLock: [125, 145],
  Pause: [126, 19, 1],
  AltLeft: [18],
  AltRight: [18],
  CapsLock: [20],
  ControlLeft: [17],
  ControlRight: [17],
  OSLeft: [224, 91],
  OSRight: [92, 93, 91, 224],
  ShiftLeft: [16],
  ShiftRight: [16],
  F1: [112],
  F2: [113],
  F3: [114],
  F4: [115],
  F5: [116],
  F6: [117],
  F7: [118],
  F8: [119],
  F9: [120],
  F10: [121],
  F11: [122],
  F12: [123],
  F13: [124, 44, 0],
  F14: [125, 145, 0],
  F15: [126, 19, 0],
  F16: [127, 0],
  F17: [128, 0],
  F18: [129, 0],
  F19: [130, 0],
  F20: [229, 131, 0],
  F21: [0, 132],
  F22: [0, 133],
  F23: [0, 134],
  F24: [135, 0],
  Digit1: [49],
  Digit2: [50],
  Digit3: [51],
  Digit4: [52],
  Digit5: [53],
  Digit6: [54],
  Digit7: [55],
  Digit8: [56],
  Digit9: [57],
  Digit0: [48],
  KeyA: [65],
  KeyB: [66],
  KeyC: [67],
  KeyD: [68],
  KeyE: [69],
  KeyF: [70],
  KeyG: [71],
  KeyH: [72],
  KeyI: [73],
  KeyJ: [74],
  KeyK: [75],
  KeyL: [76],
  KeyM: [77],
  KeyN: [78],
  KeyO: [79],
  KeyP: [80],
  KeyQ: [186, 81],
  KeyR: [82],
  KeyS: [83],
  KeyT: [84],
  KeyU: [85],
  KeyV: [86],
  KeyW: [87],
  KeyX: [88],
  KeyY: [89],
  KeyZ: [90],
};

export enum CommandKey {
  ctrl = 'ctrl',
  shift = 'shift',
  alt = 'alt',
  meta = 'meta',
}

interface CommandKeyMap {
  [CommandKey.ctrl]: boolean;
  [CommandKey.shift]: boolean;
  [CommandKey.alt]: boolean;
  [CommandKey.meta]: boolean;
}

/**
 * wheel direction enum
 */
export enum WheelDirection {
  upward = 'upward',
  downward = 'downward',
  none = 'none',
}
