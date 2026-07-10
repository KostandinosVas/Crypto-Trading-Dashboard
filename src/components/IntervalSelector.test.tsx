import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { IntervalSelector } from './IntervalSelector';

describe('IntervalSelector', () => {
  it('renders all three interval options', () => {
    render(<IntervalSelector selected="1h" onSelect={vi.fn()} />);

    expect(screen.getByText('1h')).toBeInTheDocument();
    expect(screen.getByText('4h')).toBeInTheDocument();
    expect(screen.getByText('1d')).toBeInTheDocument();
  });

  it('calls onSelect with the clicked interval', async () => {
    const user = userEvent.setup();
    const handleSelect = vi.fn();

    render(<IntervalSelector selected="1h" onSelect={handleSelect} />);
    await user.click(screen.getByText('4h'));

    expect(handleSelect).toHaveBeenCalledWith('4h');
    expect(handleSelect).toHaveBeenCalledTimes(1);
  });
});