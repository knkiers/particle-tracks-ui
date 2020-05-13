const RADIUS_ACTIVATED = 3;//px
const RADIUS_NOT_ACTIVATED = 0.5;
const STROKE_WIDTH_USED_FOR_FIT = 2;
const STROKE_WIDTH_NOT_USED_FOR_FIT = 0;
const STROKE_COLOUR_ACTIVATED = 'darkslateblue';
const STROKE_COLOUR_NOT_ACTIVATED = 'grey';
const FILL_COLOUR_ACTIVATED = 'darkslateblue';
const FILL_COLOUR_NOT_ACTIVATED = 'grey';
const FILL_COLOUR_USED_FOR_FIT = 'white';

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
    checkDot(colourModeOn: boolean) {
        console.log('moused!');
        if (colourModeOn) {
            if (this.activated && (!this.useForFit)) {
                this.useForFit = true;
            }
        } else {
            if (this.activated && (this.useForFit)) {
                this.useForFit = false;
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