import styled, { keyframes } from 'styled-components';

const pulse = keyframes`
  0% { box-shadow: 0 0 0 0 rgba(220, 38, 38, 0.55); }
  70% { box-shadow: 0 0 0 18px rgba(220, 38, 38, 0); }
  100% { box-shadow: 0 0 0 0 rgba(220, 38, 38, 0); }
`;

export const Overlay = styled.div`
  position: fixed;
  inset: 0;
  z-index: 10000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
  background: rgba(15, 23, 42, 0.6);
`;

export const Dialog = styled.div`
  width: 100%;
  max-width: 440px;
  padding: 32px 28px 24px;
  border-radius: 12px;
  background: #fff;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.35);
  text-align: center;
  font-family: inherit;
  color: #1f2937;
`;

export const RecordIcon = styled.div`
  width: 56px;
  height: 56px;
  margin: 0 auto 20px;
  border-radius: 50%;
  border: 4px solid #dc2626;
  display: flex;
  align-items: center;
  justify-content: center;
  animation: ${pulse} 1.6s infinite;

  &::after {
    content: '';
    width: 24px;
    height: 24px;
    border-radius: 50%;
    background: #dc2626;
  }
`;

export const Title = styled.h2`
  margin: 0 0 12px;
  font-size: 1.35rem;
  font-weight: 600;
`;

export const Description = styled.p`
  margin: 0 0 8px;
  font-size: 1rem;
  line-height: 1.45;
`;

export const Hint = styled.p`
  margin: 0 0 24px;
  font-size: 0.875rem;
  color: #6b7280;
`;

export const ConfirmButton = styled.button`
  min-width: 140px;
  padding: 10px 24px;
  border: none;
  border-radius: 8px;
  background: #dc2626;
  color: #fff;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;

  &:hover {
    background: #b91c1c;
  }

  &:focus-visible {
    outline: 3px solid #fca5a5;
    outline-offset: 2px;
  }
`;
