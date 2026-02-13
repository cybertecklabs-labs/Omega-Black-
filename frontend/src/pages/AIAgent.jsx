import { useState } from 'react';
import { useRunAgentMutation } from '../redux/services/apiSlice';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';

export default function AIAgent() {
    const [task, setTask] = useState('');
    const [conversation, setConversation] = useState([]);
    const [loading, setLoading] = useState(false);
    const [runAgent] = useRunAgentMutation();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!task.trim()) return;
        setLoading(true);
        setConversation((prev) => [...prev, { role: 'user', content: task }]);
        try {
            const result = await runAgent({ task }).unwrap();
            setConversation((prev) => [...prev, { role: 'assistant', content: result.data.answer }]);
        } catch (error) {
            setConversation((prev) => [...prev, { role: 'assistant', content: `Error: ${error.message}` }]);
        } finally {
            setLoading(false);
            setTask('');
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <h1 className="text-2xl font-semibold">🧠 OMEGA AI Agent</h1>
            <Card>
                <div className="h-96 overflow-y-auto mb-4 space-y-4 p-4 bg-gray-50 dark:bg-gray-900 rounded">
                    {conversation.map((msg, idx) => (
                        <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                            <div
                                className={`max-w-[70%] p-3 rounded-lg ${msg.role === 'user'
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100'
                                    }`}
                            >
                                {msg.content}
                            </div>
                        </div>
                    ))}
                    {loading && (
                        <div className="flex justify-start">
                            <div className="bg-gray-200 dark:bg-gray-700 p-3 rounded-lg">
                                <div className="flex space-x-1">
                                    <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
                                    <div
                                        className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"
                                        style={{ animationDelay: '0.1s' }}
                                    ></div>
                                    <div
                                        className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"
                                        style={{ animationDelay: '0.2s' }}
                                    ></div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
                <form onSubmit={handleSubmit} className="flex space-x-2">
                    <input
                        type="text"
                        value={task}
                        onChange={(e) => setTask(e.target.value)}
                        placeholder="Ask the AI agent to perform a security task..."
                        className="flex-1 border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        disabled={loading}
                    />
                    <Button type="submit" disabled={loading}>
                        Send
                    </Button>
                </form>
            </Card>
        </div>
    );
}
