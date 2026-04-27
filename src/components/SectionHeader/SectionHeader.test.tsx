import React from 'react';
import { fireEvent, screen } from '@testing-library/react-native';
import renderWithProviders from '../../__test_utils__/renderWithProviders';
import SectionHeader from './SectionHeader';

describe('SectionHeader', () => {
  it('renders the title', () => {
    renderWithProviders(<SectionHeader title="Trending" />);
    expect(screen.getByText('Trending')).toBeTruthy();
  });

  it('shows "See all" button by default', () => {
    renderWithProviders(<SectionHeader title="Trending" />);
    expect(screen.getByText('See all')).toBeTruthy();
  });

  it('hides "See all" button when showSeeAll is false', () => {
    renderWithProviders(<SectionHeader title="Trending" showSeeAll={false} />);
    expect(screen.queryByText('See all')).toBeNull();
  });

  it('calls onPressSeeAll when "See all" is pressed', () => {
    const onPressSeeAll = jest.fn();
    renderWithProviders(
      <SectionHeader title="Trending" onPressSeeAll={onPressSeeAll} />,
    );
    fireEvent.press(screen.getByText('See all'));
    expect(onPressSeeAll).toHaveBeenCalledTimes(1);
  });
});
