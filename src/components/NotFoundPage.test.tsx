import { cleanup, render } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import { NotFoundPage } from './NotFoundPage';

afterEach(cleanup);

describe('NotFoundPage', () => {
  it('exposes the shared editorial class contracts', () => {
    const { container } = render(<NotFoundPage locale="en" />);

    expect(container.querySelector('main.not-found')).toBeInTheDocument();
    expect(container.querySelector('h1.not-found__code')).toHaveTextContent(
      '404',
    );
    expect(container.querySelector('.not-found__actions')).toBeInTheDocument();
    expect(container.querySelectorAll('.not-found__link')).toHaveLength(2);
  });
});
