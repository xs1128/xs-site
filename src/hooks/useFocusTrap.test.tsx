import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { fireEvent } from '@testing-library/dom';
import { useFocusTrap } from './useFocusTrap';

function Overlay({ isOpen, onDismiss }: { isOpen: boolean; onDismiss: () => void }) {
  const ref = useFocusTrap<HTMLDivElement>(isOpen, onDismiss);
  if (!isOpen) return null;
  return (
    <div ref={ref} tabIndex={-1} role="dialog">
      <button>close</button>
      <button>middle</button>
      <button>last</button>
    </div>
  );
}

describe('useFocusTrap', () => {
  it('focuses the container, not the first control', () => {
    render(<Overlay isOpen onDismiss={() => {}} />);
    expect(document.activeElement).toBe(screen.getByRole('dialog'));
  });

  it('wraps forward from the last control to the first', () => {
    render(<Overlay isOpen onDismiss={() => {}} />);
    screen.getByText('last').focus();
    fireEvent.keyDown(document, { key: 'Tab' });
    expect(document.activeElement).toBe(screen.getByText('close'));
  });

  it('wraps backward from the container to the last control', () => {
    render(<Overlay isOpen onDismiss={() => {}} />);
    fireEvent.keyDown(document, { key: 'Tab', shiftKey: true });
    expect(document.activeElement).toBe(screen.getByText('last'));
  });

  it('dismisses on Escape', () => {
    const onDismiss = vi.fn();
    render(<Overlay isOpen onDismiss={onDismiss} />);
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(onDismiss).toHaveBeenCalledOnce();
  });

  it('restores focus to the trigger on close', () => {
    const trigger = document.createElement('button');
    document.body.appendChild(trigger);
    trigger.focus();

    const { rerender } = render(<Overlay isOpen onDismiss={() => {}} />);
    rerender(<Overlay isOpen={false} onDismiss={() => {}} />);

    expect(document.activeElement).toBe(trigger);
  });
});
