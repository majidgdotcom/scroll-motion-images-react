export interface ShakeImageWithScrollProps {
    id: string;
    folder: string;
    length: number;
    distance: number;
    fileFormat: string;
    backColor?: string;
    fullScreen?: boolean;
    widthSize?: {
        befor768: string;
        after768: string
    };
    scrollY: number;
    windowSize: {
        width: number;
        height: number
    };
}