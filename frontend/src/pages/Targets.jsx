import { useGetTargetsQuery, useStartReconMutation } from '../redux/services/apiSlice';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';

export default function Targets() {
    const { data: targets, isLoading } = useGetTargetsQuery();
    const [startRecon] = useStartReconMutation();

    const handleRecon = async (targetId) => {
        try {
            await startRecon(targetId).unwrap();
            alert('Recon started');
        } catch (err) {
            alert('Failed to start recon');
        }
    };

    if (isLoading) return <div>Loading...</div>;

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-semibold">🎯 Targets & Recon</h1>
            <div className="grid gap-4">
                {targets?.data?.map((target) => (
                    <Card key={target._id}>
                        <div className="flex justify-between items-center">
                            <div>
                                <h3 className="text-lg font-medium">{target.name}</h3>
                                <p className="text-sm text-gray-500">{target.domain}</p>
                            </div>
                            <Button onClick={() => handleRecon(target._id)} variant="secondary">
                                Run Recon
                            </Button>
                        </div>
                        {target.metadata?.subdomains?.length > 0 && (
                            <div className="mt-4">
                                <p className="text-sm font-medium">
                                    Subdomains ({target.metadata.subdomains.length})
                                </p>
                                <div className="mt-2 flex flex-wrap gap-2">
                                    {target.metadata.subdomains.slice(0, 5).map((sub, i) => (
                                        <span
                                            key={i}
                                            className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-xs"
                                        >
                                            {sub}
                                        </span>
                                    ))}
                                    {target.metadata.subdomains.length > 5 && (
                                        <span className="text-xs text-gray-500">
                                            +{target.metadata.subdomains.length - 5} more
                                        </span>
                                    )}
                                </div>
                            </div>
                        )}
                    </Card>
                ))}
            </div>
        </div>
    );
}
