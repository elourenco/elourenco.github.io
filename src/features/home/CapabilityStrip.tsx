import {
  BrainIcon,
  ChartBarIcon,
  DeviceMobileIcon,
  GraphIcon,
  MouseSimpleIcon,
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
  exploreLabel,
}: {
  items: PortfolioContent['hero']['capabilities'];
  exploreLabel: string;
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
      <li className="capability-strip__hint">
        <MouseSimpleIcon aria-hidden="true" size={34} weight="light" />
        <span>{exploreLabel}</span>
      </li>
    </ul>
  );
}
