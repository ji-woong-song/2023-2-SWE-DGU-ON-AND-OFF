import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import styled, { css } from 'styled-components';
import { ModalAnimationType, ModalAnimationMotion, ModalAnimation } from './ModalAnimations';

/*****************************************************************
 * 모달 생성과 관리를 위한 Hook과 컴포넌트들입니다.
 *****************************************************************/

/** 
 * 모달 필드를 생성하고 관리하는 Hook입니다.
 * 페이지 바디에 모달 필드를 추가하고 제거합니다.
 */
export default function useModalCreater() {
    useEffect(() => {
        const pageBody = document.body;
        const div = document.createElement('div');
        div.id = "modal";
        pageBody.appendChild(div);
        return () => { pageBody.removeChild(div); };
    }, []);
}

/** 
 * ModalPortal의 속성 인터페이스입니다.
 * children: 포탈을 통해 렌더링될 React 노드입니다.
 */
interface ModalPortalProps {
    children: React.ReactNode;
}

/** 
 * ModalPortal 컴포넌트는 자식 노드를 모달 필드에 렌더링합니다.
 */
function ModalPortal({ children }: ModalPortalProps) {
    const modalRoot = document.getElementById('modal') as HTMLElement;
    return ReactDOM.createPortal(children, modalRoot);
}

/** 
 * ModalWrapper의 속성 인터페이스입니다.
 * backgroundColor: 모달 배경색입니다.
 */
interface ModalWrapperProps {
    backgroundColor: string;
}

/** 
 * ModalWrapper 컴포넌트는 모달의 배경을 렌더링합니다.
 */
const ModalWrapper = styled.div<ModalWrapperProps>`
  position: fixed;
  left: 0;
  top: 0;
  z-index: 1050;
  width: 100%;
  height: 100%;
  background-color: ${({ backgroundColor }) => backgroundColor};
`;

/** 
 * ModalInner의 속성 인터페이스입니다.
 * modalAnimationMotion: 모달 애니메이션 모션입니다.
 * isUnmount: 마운트 해제 상태 여부입니다.
 */
interface ModalInnerProps {
    modalAnimationMotion: ModalAnimationMotion;
    isUnmount: boolean;
}

/** 
 * ModalInner 컴포넌트는 모달의 내부 컨텐츠를 렌더링합니다.
 */
const ModalInner = styled.div<ModalInnerProps>`
  position: relative;
  width: 100%;
  height: 100%;
  margin: 0 auto;
  background-color: transparent;
  display: flex;
  align-items: center;
  justify-content: center;
  ${({ modalAnimationMotion: modalAnimation, isUnmount }) => css`
  animation: ${isUnmount ? modalAnimation.onDisappear : modalAnimation.onAppear} ${modalAnimation.duration / 1000}s ease-in-out;
  `}
`;

/** 
 * ModalFrame의 속성 인터페이스입니다.
 */
interface ModalFrameProps {
    modalAnimation: ModalAnimationMotion;
    isUnmount: boolean;
    isOpen: boolean;
    onClose: () => void;
    children: React.ReactNode;
    backgroundColor: string;
}

/** 
 * ModalFrame 컴포넌트는 모달의 프레임을 렌더링합니다.
 */
function ModalFrame({ modalAnimation, isUnmount, isOpen, onClose, children, backgroundColor }: ModalFrameProps) {
    const handleClickInnerModal = (e: React.MouseEvent<HTMLDivElement>) => {
        e.stopPropagation();
    };
    return (
        <>
            {isOpen && (
                <ModalPortal>
                    <ModalWrapper
                        backgroundColor={backgroundColor}
                        onClick={onClose}
                    >
                        <ModalInner
                            onClick={onClose}
                            modalAnimationMotion={modalAnimation}
                            isUnmount={isUnmount}
                        >
                            <div onClick={handleClickInnerModal}>
                                {children}
                            </div>
                        </ModalInner>
                    </ModalWrapper>
                </ModalPortal>
            )}
        </>
    );
}

/** 
 * 모달 관리를 위한 Hook입니다.
 */
export function useModal(modalAnimation: ModalAnimationType, backgroundColor: string = "#0b0b0bb8"): [
    ({ children }: { children: React.ReactNode; }) => JSX.Element,
    () => void,
    () => void,
] {
    const [isOpen, setIsOpen] = useState(false);
    const [isUnmount, setIsUnmount] = useState(false);

    const animation = ModalAnimation.getAnimationModtion(modalAnimation);

    const closeModal = () => {
        setIsUnmount(true);
        setTimeout(() => {
            setIsOpen(false);
        }, animation.duration);
    };

    const openModal = () => {
        setIsUnmount(false)
        setIsOpen(true);
    };

    const Modal = ({ children }: { children: React.ReactNode }) => (
        <ModalFrame
            isOpen={isOpen}
            onClose={closeModal}
            isUnmount={isUnmount}
            modalAnimation={animation}
            backgroundColor={backgroundColor}
        >
            {children}
        </ModalFrame>
    );

    return [Modal, openModal, closeModal];
}
