import { keyframes } from 'styled-components';


/** 모달 애니메이션 종류 */
export enum ModalAnimationType {
    SLIDE,
    ZOOM
}


/** 모달 애니메이션 정보 keyframes, duration*/
export interface ModalAnimationMotion {
    onAppear: any;
    onDisappear: any;
    duration: number;
}


/** 모달 애니메이션 클래스 */
export class ModalAnimation {
    public static getAnimationModtion(modalAnimationType: ModalAnimationType) {
        switch (modalAnimationType) {
            case ModalAnimationType.SLIDE:
                return { onAppear: SlideUp, onDisappear: SlideDown, duration: 200 };
            case ModalAnimationType.ZOOM:
                return { onAppear: ZoomIn, onDisappear: ZoomOut, duration: 200 };
            default:
                return { onAppear: keyframes``, onDisappear: keyframes``, duration: 0 };
        }
    }
}



/** 슬라이드 에니메이션 */
const SlideUp = keyframes`
  0% {bottom: -100%; }
  100% {bottom: 0; }
`;

const SlideDown = keyframes`
  0% {bottom: 0%; }
  100% {bottom: -100%; }
`;



/** 줌인 에니메이션 */
const ZoomIn = keyframes`
  0% {
    transform: scale(0);  
    opacity: 0;         
  }
  100% {
    transform: scale(1);
    opacity: 1;        
  }
`;

const ZoomOut = keyframes`
  0% {
    transform: scale(1); 
    opacity: 1;           
  }
  100% {
    transform: scale(0);
    opacity: 0;    
  }
`;


