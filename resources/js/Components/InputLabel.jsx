export default function InputLabel({
    value,
    className = '',
    children,
    ...props
}) {
    return (
        <label
            {...props}
            className={
                `block mb-1 text-sm font-semibold text-primary-800 dark:text-secondary-200 ` +
                className
            }
        >
            {value ? value : children}
        </label>
    );
}
