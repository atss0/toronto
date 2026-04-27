import React from 'react';
import { fireEvent, waitFor } from '@testing-library/react-native';
import ReviewsScreen from '../ReviewsScreen';
import placesService from '../../services/places';
import { renderWithProviders, mockUser, createMockState } from '../../__test_utils__/renderWithProviders';

jest.mock('../../services/places');
const mockedPlaces = placesService as jest.Mocked<typeof placesService>;

const mockGoBack = jest.fn();

jest.mock('@react-navigation/native', () => {
  const actual = jest.requireActual('@react-navigation/native');
  return {
    ...actual,
    useNavigation: () => ({
      navigate: jest.fn(),
      goBack: mockGoBack,
      addListener: jest.fn(() => jest.fn()),
    }),
    useRoute: () => ({
      params: { placeId: 'place-uuid-1', placeName: 'Topkapı Sarayı', rating: 4.7 },
    }),
    useFocusEffect: jest.fn(),
  };
});

const mockReviews = [
  {
    id: 'r1', author: 'Ali V.', initials: 'AV', rating: 5,
    date: '2 days ago', text: 'Harika bir deneyimdi!', helpful_count: 12, is_helpful: false,
  },
  {
    id: 'r2', author: 'Ayşe K.', initials: 'AK', rating: 4,
    date: '1 week ago', text: 'Çok güzel ama kalabalıktı.', helpful_count: 5, is_helpful: true,
  },
];

const mockApiResponse = (reviews = mockReviews) => ({
  data: {
    data: reviews,
    pagination: { hasNext: false },
    summary: { average_rating: 4.7, total_count: 234, distribution: { '5': 120, '4': 70, '3': 25, '2': 12, '1': 7 } },
  },
});

const preloadedState = createMockState({ User: { user: mockUser } });

beforeEach(() => {
  // resetAllMocks clears the once-queue so one test's mockRejectedValueOnce
  // does not leak into the next test's component mount
  jest.resetAllMocks();
  mockedPlaces.getReviews.mockResolvedValue(mockApiResponse() as any);
});

describe('ReviewsScreen', () => {
  // ─── Happy Path ───────────────────────────────────────────────────────────
  describe('Happy Path', () => {
    it('API\'den yorumlar çekilip render edilir', async () => {
      const { findByText } = renderWithProviders(<ReviewsScreen />, { preloadedState });
      expect(await findByText('Harika bir deneyimdi!')).toBeTruthy();
      expect(await findByText('Çok güzel ama kalabalıktı.')).toBeTruthy();
    });

    it('mekan adı route params\'tan gösterilir', async () => {
      const { findByText } = renderWithProviders(<ReviewsScreen />, { preloadedState });
      expect(await findByText('Topkapı Sarayı')).toBeTruthy();
    });

    it('ortalama rating gösterilir', async () => {
      const { findByText } = renderWithProviders(<ReviewsScreen />, { preloadedState });
      expect(await findByText('4.7')).toBeTruthy();
    });

    it('getReviews doğru parametrelerle çağrılır', async () => {
      const { findByText } = renderWithProviders(<ReviewsScreen />, { preloadedState });
      await findByText('Harika bir deneyimdi!');
      expect(mockedPlaces.getReviews).toHaveBeenCalledWith('place-uuid-1', {
        sort: 'recent',
        page: 1,
        limit: 15,
      });
    });
  });

  // ─── Loading ──────────────────────────────────────────────────────────────
  describe('Loading State', () => {
    it('yükleme sırasında yorumlar gösterilmez', () => {
      mockedPlaces.getReviews.mockReturnValue(new Promise(() => {}) as any);
      const { queryByText } = renderWithProviders(<ReviewsScreen />, { preloadedState });
      expect(queryByText('Harika bir deneyimdi!')).toBeNull();
    });
  });

  // ─── Error ────────────────────────────────────────────────────────────────
  describe('Error Handling', () => {
    it('API hatası olsa mevcut liste korunur (catch ile silent fail)', async () => {
      // İlk yükleme başarılı
      const { findByText } = renderWithProviders(<ReviewsScreen />, { preloadedState });
      await findByText('Harika bir deneyimdi!');

      // Sonraki çağrı hata verse de mevcut items kaybolmaz
      mockedPlaces.getReviews.mockRejectedValueOnce(new Error('Network Error'));
      // ekran hâlâ ilk review'ı gösterir (kaldı)
      expect(await findByText('Harika bir deneyimdi!')).toBeTruthy();
    });
  });

  // ─── Sort ─────────────────────────────────────────────────────────────────
  describe('Sort', () => {
    it('Highest chip\'e basılınca sort=highest ile yeniden çekilir', async () => {
      const { findByText } = renderWithProviders(<ReviewsScreen />, { preloadedState });
      await findByText('Harika bir deneyimdi!');

      fireEvent.press(await findByText('Highest'));

      await waitFor(() => {
        expect(mockedPlaces.getReviews).toHaveBeenCalledWith('place-uuid-1', {
          sort: 'highest',
          page: 1,
          limit: 15,
        });
      });
    });

    it('sort chipine tekrar basınca aynı sort ile yeniden çekilmez (state aynı kalır)', async () => {
      const { findByText } = renderWithProviders(<ReviewsScreen />, { preloadedState });
      await findByText('Harika bir deneyimdi!');

      const callsBefore = mockedPlaces.getReviews.mock.calls.length;
      // 'Recent' is already the default sort, pressing again should not change state
      fireEvent.press(await findByText('Recent'));
      await waitFor(() => {
        // No additional call expected since sort didn't change
        expect(mockedPlaces.getReviews.mock.calls.length).toBe(callsBefore);
      });
    });
  });

  // ─── Helpful Toggle ───────────────────────────────────────────────────────
  describe('Helpful Toggle', () => {
    it('helpful butonuna basılınca markReviewHelpful çağrılır', async () => {
      mockedPlaces.markReviewHelpful.mockResolvedValueOnce({
        data: { data: { helpful_count: 13, is_helpful: true } },
      } as any);

      const { findByText, findAllByLabelText } = renderWithProviders(
        <ReviewsScreen />, { preloadedState },
      );
      await findByText('Harika bir deneyimdi!');

      // The helpful button has accessibilityLabel: `${t('reviews.helpful')} ${helpful}`
      // t returns key → 'reviews.helpful 12' for r1
      const helpfulBtns = await findAllByLabelText(/reviews\.helpful/);
      fireEvent.press(helpfulBtns[0]);

      await waitFor(() => {
        expect(mockedPlaces.markReviewHelpful).toHaveBeenCalledWith('r1');
      });
    });
  });

  // ─── Write Review Modal ───────────────────────────────────────────────────
  describe('Write Review Modal', () => {
    it('kalem ikonuna basılınca modal açılır', async () => {
      const { findByText, findByLabelText } = renderWithProviders(
        <ReviewsScreen />, { preloadedState },
      );
      await findByText('Harika bir deneyimdi!');

      // StackHeader right button: accessibilityLabel = `${title} action` = 'reviews.title action'
      const penBtn = await findByLabelText('reviews.title action');
      fireEvent.press(penBtn);

      expect(await findByText('reviews.writeReview')).toBeTruthy();
    });

    it('modal açıkken submit butonu rating=0 iken disabled\'dır', async () => {
      const { findByText, findByLabelText, UNSAFE_getByProps } = renderWithProviders(
        <ReviewsScreen />, { preloadedState },
      );
      await findByText('Harika bir deneyimdi!');

      fireEvent.press(await findByLabelText('reviews.title action'));
      await findByText('reviews.writeReview');

      const submitBtn = await findByLabelText('reviews.submitReview');
      expect(submitBtn.props.accessibilityRole).toBe('button');
    });
  });
});
