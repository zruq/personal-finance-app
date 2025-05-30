import { createFileRoute } from '@tanstack/react-router';
import * as React from 'react';
import { z } from 'zod';
import { PageHeader } from '../-components/page-header';
import { sortByValues } from '../-components/sort-by';
import CreateBill from './-components/create-bill';
import Summary from './-components/summary';
import BillsTable from './-components/table';

const billsSearchSchema = z.object({
  page: z.number({ coerce: true }).int().min(1).catch(1),
  pageSize: z.number({ coerce: true }).int().min(1).catch(10),
  sortBy: z.enum(sortByValues).catch('latest'),
  search: z.string().optional().catch(undefined),
});

export const Route = createFileRoute('/_app/recurring-bills/')({
  component: BillsPage,
  validateSearch: billsSearchSchema,
  loaderDeps: ({ search }) => search,
});

function BillsPage() {
  const [showCreateBill, setShowCreateBill] = React.useState(false);
  return (
    <div className="space-y-8">
      <PageHeader
        title="Recurring Bills"
        action={{
          text: '+ Add New Bill',
          onClick: () => {
            setShowCreateBill(true);
          },
        }}
      />
      <div className="xl:flex xl:gap-x-6 max-xl:space-y-6">
        <div className="xl:flex-1">
          <Summary />
        </div>
        <BillsTable />
      </div>
      <CreateBill onOpenChange={setShowCreateBill} open={showCreateBill} />
    </div>
  );
}
