import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { EyeIcon, EyeOffIcon } from './Icons';

export default forwardRef(function PasswordInput(
    { className = '', isFocused = false, error, ...props },
    ref,
) {
    const [showPassword, setShowPassword] = useState(false);
    const localRef = useRef(null);

    useImperativeHandle(ref, () => ({
        focus: () => localRef.current?.focus(),
    }));

    useEffect(() => {
        if (isFocused) {
            localRef.current?.focus();
        }
    }, [isFocused]);

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    return (
        <div className="relative">
            <input
                {...props}
                type={showPassword ? 'text' : 'password'}
                className={
                    'w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:focus:border-primary-600 dark:focus:ring-primary-600 ' +
                    (error
                        ? 'border-red-500 focus:border-red-500 focus:ring-red-500 dark:border-red-600 dark:focus:border-red-600 dark:focus:ring-red-600 '
                        : '') +
                    className
                }
                ref={localRef}
            />
            <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-400 transition-colors"
                tabIndex={-1}
                aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
            >
                {showPassword ? (
                    <EyeOffIcon className="h-5 w-5" />
                ) : (
                    <EyeIcon className="h-5 w-5" />
                )}
            </button>
        </div>
    );
});
