import { BG2, BORDER, TEXT } from '../../constants';

export const inputStyle = {
  width: '100%',
  background: BG2,
  border: `1px solid ${BORDER}`,
  borderRadius: 8,
  padding: '10px 14px',
  color: TEXT,
  fontFamily: 'Syne, sans-serif',
  fontSize: 14,
  outline: 'none',
  transition: 'border-color 0.15s',
};

export const selectStyle = { ...inputStyle, cursor: 'pointer', appearance: 'none' };
