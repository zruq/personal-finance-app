import * as React from 'react';
import { queryClient } from '@/clients/queryClient';
import { trpc } from '@/router';
import { useSuspenseQuery } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import { PageHeader } from '../-components/page-header';
import PotCard from './-components/pot-card';
import CreatePot from './-components/create-pot';

export const Route = createFileRoute('/_app/pots')({
  component: RouteComponent,
  loader: () => queryClient.ensureQueryData(trpc.pots.all.queryOptions()),
});

function RouteComponent() {
  const { data: pots } = useSuspenseQuery(trpc.pots.all.queryOptions());
  console.log('pots', pots);
  const [showCreatePot, setShowCreatePot] = React.useState(false);
  const usedThemesIds = pots.map((pot) => pot.id);
  return (
    <div>
      <PageHeader
        title="Pots"
        action={{
          text: '+ Add New Pot',
          onClick: () => {
            setShowCreatePot(true);
          },
        }}
      />
      <ul className="space-y-6 pt-8 lg:grid lg:grid-cols-2 lg:gap-x-6">
        {pots.map((pot) => (
          <li key={pot.id}>
            <PotCard usedThemesIds={usedThemesIds} {...pot} />
          </li>
        ))}
      </ul>
      <CreatePot
        usedThemesIds={usedThemesIds}
        open={showCreatePot}
        onOpenChange={setShowCreatePot}
      />
    </div>
  );
}
