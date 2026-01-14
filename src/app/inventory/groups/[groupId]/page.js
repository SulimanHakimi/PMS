import ClientGroupDetail from '@/components/inventory/ClientGroupDetail';

export default function GroupDetail() {
    return <ClientGroupDetail />;
}

export async function generateStaticParams() {
    return [{ groupId: 'generic-medicine' }];
}
