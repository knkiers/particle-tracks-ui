const HOVER_COLOUR: string = 'mediumpurple';
const NON_HOVER_COLOUR: string = 'darkslateblue';
const HOVER_STROKE_WIDTH: number = 4;
const NON_HOVER_STROKE_WIDTH: number = 2;

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
    dotIndices: number[];
    hovered: boolean;
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
        this.hovered = false;
        this.theta = null;
    }
    circleColour() {
        return this.hovered ? HOVER_COLOUR : NON_HOVER_COLOUR;
    }
    strokeWidth() {
        return this.hovered ? HOVER_STROKE_WIDTH : NON_HOVER_STROKE_WIDTH;
    }
    setHovered() {
        this.hovered = true;
    }
    setUnhovered() {
        this.hovered = false;
    }
    unsetAngle() {
        this.theta = null;
    }
    setAngle(theta: number) {
        this.theta = theta;
    }
    setRotationDirection(isCW: boolean) {
        this.CW = isCW;
    }
    setParticleDirection(isIncoming: boolean) {
        this.incoming = isIncoming;
    }

}