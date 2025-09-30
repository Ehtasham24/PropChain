import React from 'react';

interface InputProps {
  label: string;
  type: string;
  name: string;
  onChange?: (_e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (_e: React.FocusEvent<HTMLInputElement>) => void;
  placeholder: string;
  id: string;
}

export const InputComponent: React.FC<InputProps> = ({
  label,
  type,
  name,
  onChange,
  onBlur,
  placeholder,
  id,
}) => {
  return (
    <div>
      <label htmlFor={id}>{label}</label>
      <input
        type={type}
        name={name}
        id={id}
        onChange={onChange}
        onBlur={onBlur}
        placeholder={placeholder}
        className=''
      />
    </div>
  );
};
