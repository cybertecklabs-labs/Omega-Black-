import { useGetWorkflowsQuery, useExecuteWorkflowMutation } from '../redux/services/apiSlice';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { useState } from 'react';

export default function N8NWorkflows() {
    const { data: workflows, isLoading } = useGetWorkflowsQuery();
    const [executeWorkflow] = useExecuteWorkflowMutation();
    const [executingId, setExecutingId] = useState(null);

    const handleExecute = async (workflowId) => {
        setExecutingId(workflowId);
        try {
            await executeWorkflow({ id: workflowId, payload: {} }).unwrap();
            alert('Workflow triggered');
        } catch (err) {
            alert('Execution failed');
        } finally {
            setExecutingId(null);
        }
    };

    if (isLoading) return <div>Loading workflows...</div>;

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-semibold">🔁 n8n Workflow Automation</h1>
            <div className="grid gap-4">
                {workflows?.data?.map((workflow) => (
                    <Card key={workflow.id}>
                        <div className="flex justify-between items-center">
                            <div>
                                <h3 className="text-lg font-medium">{workflow.name}</h3>
                                <p className="text-sm text-gray-500">Active: {workflow.active ? '✅' : '❌'}</p>
                            </div>
                            <Button
                                onClick={() => handleExecute(workflow.id)}
                                disabled={executingId === workflow.id}
                                variant="secondary"
                            >
                                {executingId === workflow.id ? 'Triggering...' : 'Run Workflow'}
                            </Button>
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    );
}
