import { useState } from 'react';
import InputError from './InputError';
import { useTranslate } from '@/Hooks/useTranslate';

export default function Checkbox({ className = '', ...props }) {
    const { t } = useTranslate();
    const [validationMessage, setValidationMessage] = useState('');
    const { onChange, onInvalid, ...otherProps } = props;

    return (
        <div className="relative flex items-center">
            <input
                {...otherProps}
                type="checkbox"
                className={
                    'rounded border-secondary-300 text-primary-600 shadow-sm focus:ring-primary-500 ' +
                    className
                }
                onInvalid={(e) => {
                    e.preventDefault();
                    if (e.target.validity.valueMissing) {
                        setValidationMessage(t('validation.checkbox_required'));
                    } else {
                        setValidationMessage(e.target.validationMessage);
                    }
                    if (onInvalid) onInvalid(e);
                }}
                onChange={(e) => {
                    setValidationMessage('');
                    if (onChange) onChange(e);
                }}
            />
            <InputError
                message={validationMessage}
                className="absolute top-full left-0 mt-1 w-max z-50 bg-white dark:bg-gray-800 px-2 py-1 rounded shadow-lg border border-red-200 dark:border-red-800"
            />
        </div>
    );
}
