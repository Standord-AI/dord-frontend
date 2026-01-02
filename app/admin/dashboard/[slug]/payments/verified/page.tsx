import { getReviewedPayments } from "@/app/actions/payments";
import { PaymentsTable } from "@/components/payments/payments-table";

export default async function VerifiedPaymentsPage() {
  const { payments, error } = await getReviewedPayments();

  if (error) {
    return <div className="p-6 text-red-500">{error}</div>;
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Reviewed Payments</h1>
      </div>
      <PaymentsTable payments={payments} />
    </div>
  );
}
