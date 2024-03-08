// @ts-ignore
import { ButtonType } from 'packages/button/src/ButtonTypes';

export enum DropdownTrigger {
    click ='click',
    hover = 'hover'
}

export enum DropdownPlacements {
    hover = 'bottom-start',
    top = 'top',
    topStart = 'top-start',
    topEnd = 'top-end',
    bottom = 'bottom',
    bottomStart = 'bottom-start',
    bottomEnd = 'bottom-end'
}

export { ButtonType as DropdownType };
