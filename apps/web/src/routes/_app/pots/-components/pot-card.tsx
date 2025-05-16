import type { RouterOutputs } from '@personal-finance-app/api/server';
import { Card } from '@personal-finance-app/ui/components/card';
import { DropdownMenu } from '@personal-finance-app/ui/components/dropdown';
import * as React from 'react';
import EllipsisIcon from '../../-icons/ellipsis.icon';
import { Button } from '@personal-finance-app/ui/components/button';
import Progress from './progress';
import EditPot from './edit-pot';
import DeletePot from './delete-pot';
import AddToPot from './add-to-pot';

type Pot = RouterOutputs['pots']['all'][number];

type PotCardProps = Pot & { usedThemesIds: number[] };

export default function PotCard({
  theme,
  target,
  totalSaved,
  name,
  id,
  usedThemesIds,
}: PotCardProps) {
  const [showAddMoney, setShowAddMoney] = React.useState<{
    type: 'add' | 'withdraw';
    show: boolean;
  }>({ type: 'add', show: false });
  const [showEditPot, setShowEditPot] = React.useState(false);
  const [showDeletePot, setShowDeletePot] = React.useState(false);
  return (
    <Card>
      <div className="flex items-center justify-between pb-8">
        <div className="flex items-center gap-x-4">
          <div
            style={{ backgroundColor: theme.color }}
            className="size-4 rounded-full"
          ></div>
          <h2 className="text-preset-2">{name}</h2>
        </div>
        <DropdownMenu
          trigger={
            <button type="button" className="group cursor-pointer">
              <EllipsisIcon className="fill-grey-300 group-hover:fill-grey-500 size-4 transition-colors duration-300" />
              <span className="sr-only">settings</span>
            </button>
          }
          items={[
            { id: '1', label: 'Edit Pot', onClick: () => setShowEditPot(true) },
            {
              id: '2',
              label: 'Delete Pot',
              onClick: () => setShowDeletePot(true),
              className: 'text-red',
            },
          ]}
        />
      </div>
      <Progress
        label="Total Saved"
        totalValue={target}
        currentValue={totalSaved}
        theme={theme}
      />
      <div className="flex items-center gap-x-4">
        <Button
          variant="secondary"
          className="w-full"
          onClick={() => setShowAddMoney({ type: 'add', show: true })}
        >
          + Add Money
        </Button>
        <Button
          onClick={() => setShowAddMoney({ type: 'withdraw', show: true })}
          variant="secondary"
          className="w-full"
        >
          Withdraw
        </Button>
      </div>
      <AddToPot
        type={showAddMoney.type}
        open={showAddMoney.show}
        pot={{ name, id, theme, target, totalSaved }}
        onOpenChange={(v) => {
          setShowAddMoney((s) => ({ ...s, show: v }));
        }}
      />
      <EditPot
        usedThemesIds={usedThemesIds}
        open={showEditPot}
        onOpenChange={setShowEditPot}
        pot={{ id, name, target, theme }}
      />
      <DeletePot
        open={showDeletePot}
        onOpenChange={setShowDeletePot}
        pot={{ name, id }}
      />
    </Card>
  );
}
