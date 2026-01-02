import { getCustomers, getCustomerStats } from "@/app/actions/customers";
import { CustomerStats } from "@/global-types";
import { CustomerStatsCards } from "@/components/customers/customer-stats";
import { CustomersTable } from "@/components/customers/customers-table";

export default async function CustomersPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { page: pageParam, limit: limitParam } = await searchParams;
  const page = Number(pageParam) || 1;
  const limit = Number(limitParam) || 20;

  const [customersRes, statsRes] = await Promise.all([
    getCustomers(page, limit),
    getCustomerStats(),
  ]);

  const customersData = customersRes.success
    ? customersRes.data
    : { customers: [], total: 0, total_pages: 0 };

  const statsData: CustomerStats =
    statsRes.success && statsRes.data
      ? statsRes.data
      : {
          total_customers: 0,
          active_customers: 0,
          total_revenue: 0,
          average_order_value: 0,
        };

  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Customers</h1>
      </div>

      <CustomerStatsCards stats={statsData} />

      <CustomersTable
        customers={customersData?.customers || []}
        total={customersData?.total || 0}
        currentPage={page}
        totalPages={customersData?.total_pages || 0}
        limit={limit}
      />
    </div>
  );
}
