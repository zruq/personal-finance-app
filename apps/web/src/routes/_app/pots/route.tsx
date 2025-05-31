import { useSuspenseQuery } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import * as React from 'react';
import { PageHeader } from '../-components/page-header';
import CreatePot from './-components/create-pot';
import PotCard from './-components/pot-card';
import { queryClient } from '@/clients/queryClient';
import { trpc } from '@/router';

export const Route = createFileRoute('/_app/pots')({
  component: PotsPage,
  loader: () => {
    queryClient.ensureQueryData(trpc.pots.all.queryOptions());
    queryClient.ensureQueryData({
      ...trpc.themes.all.queryOptions(),
      staleTime: Infinity,
    });
  },
});

function PotsPage() {
  const { data: pots } = useSuspenseQuery(trpc.pots.all.queryOptions());
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
