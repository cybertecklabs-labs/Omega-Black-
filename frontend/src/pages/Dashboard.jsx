import { useGetVulnerabilitiesQuery } from '../redux/services/apiSlice';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import Card from '../components/ui/Card';

export default function Dashboard() {
    const { data: vulnerabilities, isLoading } = useGetVulnerabilitiesQuery();

    if (isLoading) return <div>Loading...</div>;

    const severityCount = vulnerabilities?.reduce((acc, vuln) => {
        acc[vuln.severity] = (acc[vuln.severity] || 0) + 1;
        return acc;
    }, {});

    const chartData = Object.entries(severityCount || {}).map(([severity, count]) => ({
        severity,
        count,
    }));

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Dashboard</h1>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card title="Total Vulnerabilities" value={vulnerabilities?.length} />
                <Card title="Critical" value={severityCount?.critical || 0} color="red" />
                <Card title="High" value={severityCount?.high || 0} color="orange" />
                <Card title="Medium" value={severityCount?.medium || 0} color="yellow" />
            </div>
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
                <h3 className="text-lg font-medium mb-4">Vulnerabilities by Severity</h3>
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={chartData}>
                        <XAxis dataKey="severity" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="count" fill="#0ea5e9" />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
