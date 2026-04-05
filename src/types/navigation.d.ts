export type RootStackParamList = {
    Login: undefined;
    Register: undefined;
    ForgotPassword: undefined;
    Home: undefined;
    Explore: undefined;
    Belen: undefined;
    Routes: undefined;
    Profile: undefined;

    // Örnek: Eğer bir sayfa parametre alacaksa böyle tanımlanır:
    // Detail: { itemId: string };
};

declare global {
    namespace ReactNavigation {
        interface RootParamList extends RootStackParamList { }
    }
}