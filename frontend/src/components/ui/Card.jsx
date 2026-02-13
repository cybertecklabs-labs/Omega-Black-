export default function Card({ children, title, value, color }) {
    if (title && value !== undefined) {
        return (
            <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                        {title}
                    </dt>
                    <dd className={`mt-1 text-3xl font-semibold text-${color || 'gray'}-900 dark:text-white`}>
                        {value}
                    </dd>
                </div>
            </div>
        );
    }
    return (
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
            {children}
        </div>
    );
}
