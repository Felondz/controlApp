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
                `block mb-1 text-sm font-semibold text-primary-800 dark:text-primary-300 ` +
                className
            }
        >
            {value ? value : children}
        </label>
    );
}
