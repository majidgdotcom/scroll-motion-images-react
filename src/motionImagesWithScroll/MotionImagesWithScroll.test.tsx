import { render, screen, waitFor } from '@testing-library/react';
import ScrollMotionImageSequence, {
  ScrollMotionImageSequenceProps,
} from './MotionImagesWithScroll';

// Mock Image so preloadImage resolves immediately in jsdom
beforeAll(() => {
  Object.defineProperty(window, 'Image', {
    writable: true,
    value: class {
      onload: (() => void) | null = null;
      onerror: ((err: unknown) => void) | null = null;
      set src(_: string) {
        setTimeout(() => this.onload?.(), 0);
      }
    },
  });
});

const defaultProps: ScrollMotionImageSequenceProps = {
  id: 'test',
  folder: 'testFolder',
  length: 5,
  distance: 100,
  fileFormat: '.jpg',
  scrollY: 0,
  windowSize: { width: 1024, height: 768 },
};

describe('ScrollMotionImageSequence', () => {
  it('shows Loading indicator before images are ready', () => {
    render(<ScrollMotionImageSequence {...defaultProps} />);
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('renders the first image once preloading completes', async () => {
    render(<ScrollMotionImageSequence {...defaultProps} />);
    await waitFor(() => {
      expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
    });
    const img = screen.getByRole('img');
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute('src', expect.stringContaining('testFolder/0.jpg'));
  });

  it('renders a container with the correct id', () => {
    render(<ScrollMotionImageSequence {...defaultProps} />);
    expect(document.getElementById('imageItemtest')).toBeInTheDocument();
  });

  it('uses fullscreen dimensions when fullScreen prop is true', async () => {
    render(<ScrollMotionImageSequence {...defaultProps} fullScreen={true} />);
    await waitFor(() => expect(screen.queryByText('Loading...')).not.toBeInTheDocument());
    const img = screen.getByRole('img');
    expect(img).toHaveStyle({ width: '100vw', height: '100vh' });
  });

  it('respects widthSize.after768 when not fullscreen and width > 768', async () => {
    render(
      <ScrollMotionImageSequence
        {...defaultProps}
        fullScreen={false}
        widthSize={{ after768: '400px', before768: '200px' }}
        windowSize={{ width: 1024, height: 768 }}
      />
    );
    await waitFor(() => expect(screen.queryByText('Loading...')).not.toBeInTheDocument());
    const img = screen.getByRole('img');
    expect(img).toHaveStyle({ width: '400px' });
  });

  it('respects widthSize.before768 when not fullscreen and width < 768', async () => {
    render(
      <ScrollMotionImageSequence
        {...defaultProps}
        fullScreen={false}
        widthSize={{ after768: '400px', before768: '200px' }}
        windowSize={{ width: 480, height: 768 }}
      />
    );
    await waitFor(() => expect(screen.queryByText('Loading...')).not.toBeInTheDocument());
    const img = screen.getByRole('img');
    expect(img).toHaveStyle({ width: '200px' });
  });
});
