import { INTERNAL_DESTINATIONS, SITE_ANCHORS } from '../site-contract';

export function SkipLink({ label }: { label: string }) {
  return (
    <a
      className="skip-link"
      href={INTERNAL_DESTINATIONS.fragment(SITE_ANCHORS.main)}
    >
      {label}
    </a>
  );
}
