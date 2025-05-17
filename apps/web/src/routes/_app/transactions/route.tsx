import * as React from 'react';
import { createFileRoute } from '@tanstack/react-router';
import { PageHeader } from '../-components/page-header';
import CreateTransaction from './-components/create-transaction';

export const Route = createFileRoute('/_app/transactions')({
  component: TransactionsPage,
});

function TransactionsPage() {
  const [showCreateTransaction, setShowCreateTransaction] =
    React.useState(false);
  return (
    <div>
      <PageHeader
        title="Transactions"
        action={{
          text: '+ Add New Transaction',
          onClick: () => {
            setShowCreateTransaction(true);
          },
        }}
      />
      <CreateTransaction
        open={showCreateTransaction}
        onOpenChange={setShowCreateTransaction}
      />
    </div>
  );
}
