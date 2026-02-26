export default function InputError({ message, className = '', ...props }) {
    if (!message) return null;

    let displayMessage = '';

    if (Array.isArray(message)) {
        displayMessage = message[0];
    } else if (typeof message === 'string') {
        displayMessage = message;
    } else if (typeof message === 'object' && message !== null) {
        displayMessage = Object.values(message)[0];
    }

    if (!displayMessage || (typeof displayMessage === 'string' && displayMessage.trim() === '')) {
        return null;
    }

    return (
        <div
            {...props}
            className={`block mt-1 text-xs font-bold text-red-600 dark:text-red-400 px-1 ${className}`}
        >
            <span className="inline-block mr-1">●</span>
            {displayMessage}
        </div>
    );
}
