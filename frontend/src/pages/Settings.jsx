import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useGetMeQuery } from '../redux/services/apiSlice';
import { setTheme } from '../redux/slices/uiSlice';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';

export default function Settings() {
    const { data: user } = useGetMeQuery();
    const dispatch = useDispatch();
    const { theme } = useSelector((state) => state.ui);
    const [apiKeyName, setApiKeyName] = useState('');
    const [apiKeys, setApiKeys] = useState([]); // Would fetch from API

    const handleGenerateApiKey = () => {
        alert('API key generated (mock)');
    };

    return (
        <div className="max-w-3xl space-y-6">
            <h1 className="text-2xl font-semibold">⚙️ User Settings</h1>

            <Card title="Profile">
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium">Email</label>
                        <input
                            type="email"
                            value={user?.data?.email || ''}
                            className="mt-1 block w-full border rounded-md px-3 py-2"
                            readOnly
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium">Username</label>
                        <input
                            type="text"
                            value={user?.data?.username || ''}
                            className="mt-1 block w-full border rounded-md px-3 py-2"
                            readOnly
                        />
                    </div>
                </div>
            </Card>

            <Card title="Appearance">
                <div className="flex items-center space-x-4">
                    <span>Theme</span>
                    <select
                        value={theme}
                        onChange={(e) => dispatch(setTheme(e.target.value))}
                        className="border rounded px-3 py-2"
                    >
                        <option value="light">Light</option>
                        <option value="dark">Dark</option>
                        <option value="system">System</option>
                    </select>
                </div>
            </Card>

            <Card title="API Keys">
                <p className="text-sm text-gray-500 mb-4">
                    API keys allow programmatic access to OMEGA BLACK.
                </p>
                <div className="space-y-4">
                    {apiKeys.map((key) => (
                        <div
                            key={key.id}
                            className="flex justify-between items-center p-2 bg-gray-50 dark:bg-gray-800 rounded"
                        >
                            <div>
                                <p className="font-mono text-sm">
                                    {key.prefix}...{key.suffix}
                                </p>
                                <p className="text-xs text-gray-500">
                                    Created: {new Date(key.createdAt).toLocaleDateString()}
                                </p>
                            </div>
                            <Button variant="danger" size="sm">
                                Revoke
                            </Button>
                        </div>
                    ))}
                    <div className="flex space-x-2">
                        <input
                            type="text"
                            placeholder="Key name (e.g., 'CI/CD')"
                            value={apiKeyName}
                            onChange={(e) => setApiKeyName(e.target.value)}
                            className="flex-1 border rounded px-3 py-2"
                        />
                        <Button onClick={handleGenerateApiKey}>Generate New Key</Button>
                    </div>
                </div>
            </Card>
        </div>
    );
}
