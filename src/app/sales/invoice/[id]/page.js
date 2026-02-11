import InvoiceClient from './InvoiceClient';

export default function InvoicePrintPage() {
    return <InvoiceClient />;
}

export async function generateStaticParams() {
    return [{ id: 'sample' }];
}
