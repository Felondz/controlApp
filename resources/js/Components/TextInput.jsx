import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';
import InputError from './InputError';

export default forwardRef(function TextInput(
    { type = 'text', className = '', isFocused = false, error = null, ...props },
    ref,
) {
    const localRef = useRef(null);
    const [validationMessage, setValidationMessage] = useState('');

    useImperativeHandle(ref, () => ({
        focus: () => localRef.current?.focus(),
    }));

    useEffect(() => {
        if (isFocused) {
            localRef.current?.focus();
        }
    }, [isFocused]);

    const baseStyles = 'border rounded-md shadow-sm ' +
        'focus:ring-2 focus:ring-opacity-50 ' +
        'transition duration-200 ease-in-out ';

    const lightStyles = error
        ? 'bg-red-50 text-red-900 border-red-300 focus:border-red-600 focus:ring-red-500 placeholder-red-400 '
        : 'bg-secondary-50 text-secondary-900 border-secondary-300 focus:border-primary-600 focus:ring-primary-500 placeholder-secondary-400 ';

    const darkStyles = error
        ? 'dark:bg-red-900/10 dark:text-red-100 dark:border-red-500/50 dark:focus:border-red-500 dark:focus:ring-red-500 dark:placeholder-red-300 '
        : 'dark:bg-secondary-700 dark:text-secondary-100 dark:border-secondary-500 dark:focus:border-primary-500 dark:focus:ring-primary-500 dark:placeholder-secondary-300 ';

    const { onChange, onInvalid, ...otherProps } = props;

    return (
        <>
            <input
                {...otherProps}
                type={type}
                className={`
                ${baseStyles}
                ${lightStyles}
                ${darkStyles}
                ${className}
            `.trim()}
                ref={localRef}
                onInvalid={(e) => {
                    e.preventDefault();
                    setValidationMessage(e.target.validationMessage);
                    if (onInvalid) onInvalid(e);
                }}
                onChange={(e) => {
                    setValidationMessage('');
                    if (onChange) onChange(e);
                }}
            />
            {validationMessage && <InputError message={validationMessage} className="mt-1" />}
        </>
    );
});
