const RADIUS_ACTIVATED = 3;//px
const RADIUS_NOT_ACTIVATED = 0.5;
const STROKE_WIDTH_USED_FOR_FIT = 2;
const STROKE_WIDTH_NOT_USED_FOR_FIT = 0;
const STROKE_COLOUR_ACTIVATED = 'darkslateblue';
const STROKE_COLOUR_NOT_ACTIVATED = 'grey';
const FILL_COLOUR_ACTIVATED = 'darkslateblue';
const FILL_COLOUR_NOT_ACTIVATED = 'grey';
const FILL_COLOUR_USED_FOR_FIT = 'white';

export enum SelectModes {
    HoverSelect = "HOVER-SELECT",
    HoverDeselect = "HOVER-DESELECT",
    TapSelectDeselect = "TAP-SELECT-DESELECT"
}

export class Dot {
    id: number;
    activated: boolean;
    useForFit: boolean;
    x: string;
    xcm: number;
    y: string;
    ycm: number;
    constructor(obj: any) {
        this.id = obj.id;
        this.activated = obj.activated;
        this.useForFit = obj.useForFit;
        this.x = obj.x;
        this.xcm = obj.xcm;
        this.y = obj.y;
        this.ycm = obj.ycm;
    }

    mouseOverToSelectDeselect(selectMode: string) {
        console.log('moused!');
        if (selectMode === SelectModes.HoverSelect) {
            if (this.activated && (!this.useForFit)) {
                this.useForFit = true;
            }
        } else if (selectMode === SelectModes.HoverDeselect) {
            if (this.activated && (this.useForFit)) {
                this.useForFit = false;
            }
        }
    }

    clickToToggle(selectMode: string) {
        console.log('clicked!');
        if (selectMode === SelectModes.TapSelectDeselect) {
            if (this.activated) {
                this.useForFit = !this.useForFit;
            }
        }
    }

    findRadius() {
        return this.activated ? RADIUS_ACTIVATED : RADIUS_NOT_ACTIVATED;
    }
    findStrokeWidth() {
        return this.useForFit ? STROKE_WIDTH_USED_FOR_FIT : STROKE_WIDTH_NOT_USED_FOR_FIT;
    }
    findStrokeColour() {
        return this.activated ? STROKE_COLOUR_ACTIVATED : STROKE_COLOUR_NOT_ACTIVATED;
    }
    findFillColour() {
        if (!this.activated) {
            return FILL_COLOUR_NOT_ACTIVATED;
        } else {
            if (this.useForFit) {
                return FILL_COLOUR_USED_FOR_FIT;
            } else {
                return FILL_COLOUR_ACTIVATED;
            }
        }
    }
    deactivate() {
        this.activated = false;
    }
    activate() {
        this.activated = true;
    }
    unsetUseForFit() {
        this.useForFit = false;
    }
    setUseForFit() {
        this.useForFit = true;
    }

}