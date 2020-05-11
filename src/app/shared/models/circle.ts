export class Circle {
    CW: boolean; //clockwise
    incoming: boolean;
    r: number;
    rPx: number;
    theta: number;
    xc: number;
    xcPx: number;
    yc: number;
    ycPx: number;
    dotIndices: number[]
    constructor(obj: any) {
        this.CW = obj.CW;
        this.incoming = obj.incoming;
        this.r = obj.r;
        this.rPx = obj.rPx;
        this.theta = obj.theta;
        this.xc = obj.xc;
        this.xcPx = obj.xcPx;
        this.yc = obj.yc;
        this.ycPx = obj.ycPx;
        this.dotIndices = obj.dotIndices;
    }
    /*
    checkDot(colourModeOn: boolean) {
        console.log('moused!');
        if (colourModeOn) {
            if (this.activated && (!this.useForFit)) {
                this.useForFit = true;
            }
        } else {
            if (this.activated && (this.useForFit)) {
                this.useForFit = true;
            }
        }
    }
    findRadius() {
        return this.activated ? RADIUS_ACTIVATED : RADIUS_NOT_ACTIVATED;
    }
    findStrokeWidth() {
        return this.useForFit ? STROKE_WIDTH_USED_FOR_FIT : STROKE_WIDTH_NOT_USED_FOR_FIT;
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

    */
}