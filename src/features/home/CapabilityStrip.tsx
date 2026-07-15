import {
  BrainIcon,
  ChartBarIcon,
  DeviceMobileIcon,
  GraphIcon,
} from '@phosphor-icons/react';
import type { PortfolioContent } from '../../content';

const iconByCapability = {
  distributed: GraphIcon,
  mobile: DeviceMobileIcon,
  ai: BrainIcon,
  observability: ChartBarIcon,
} as const;

export function CapabilityStrip({
  items,
}: {
  items: PortfolioContent['hero']['capabilities'];
}) {
  return (
    <ul className="capability-strip">
      {items.map((item) => {
        const Icon = iconByCapability[item.id];

        return (
          <li className="capability-strip__item" key={item.id}>
            <Icon aria-hidden="true" size={34} weight="light" />
            <span>{item.label}</span>
          </li>
        );
      })}
    </ul>
  );
}
