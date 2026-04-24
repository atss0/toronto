export type RootStackParamList = {
    // Auth
    Login: undefined;
    Register: undefined;
    ForgotPassword: undefined;
    ResetPassword: { email: string };
    EmailVerification: { email: string };

    // Main tabs wrapper
    Main: undefined;

    // Detail / sub screens
    PlaceDetail: {
        placeId: string;
        name: string;
        category: string;
        rating: number;
        imageUrl: string;
        distance?: string;
        price?: string;
        reviewCount?: number;
    };
    RouteDetail: { routeId?: string; name: string };
    Notifications: undefined;
    EditProfile: undefined;
    NotificationSettings: undefined;
    LocationSettings: undefined;
    Interests: undefined;
    BudgetSettings: undefined;
    TravelStyle: undefined;
    CurrencySettings: undefined;
    HelpCenter: undefined;
    PrivacyPolicy: undefined;
    TermsOfService: undefined;
    CreateRoute: undefined;
    SeeAll: { type: 'nearbyGems' | 'trending' | 'savedRoutes' | 'explore'; title: string };
    PremiumUpgrade: undefined;
    ChatSettings: undefined;
    ChangePassword: undefined;

    // Onboarding
    Onboarding: undefined;

    // Important screens
    SearchResults: {
        query: string;
        filters?: {
            category?: string;
            distance?: string;
            minRating?: number;
            prices?: string[];
        };
    };
    MapFull: { title?: string };
    Navigation: { routeId: string; routeName: string; stops?: Array<{ id: string; name: string; description: string; duration: string; status: string }> };
    BookmarksSaved: undefined;
    Reviews: { placeId: string; placeName: string; rating: number };
    Filter: undefined;

    // Optional screens
    OfflineRoutes: undefined;
    TripHistory: undefined;
    ShareRoute: { routeId: string; routeName: string };
    WeatherDetail: { city: string };
    CityPicker: undefined;
};

declare global {
    namespace ReactNavigation {
        interface RootParamList extends RootStackParamList {}
    }
}
