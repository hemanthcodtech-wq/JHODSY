import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';
import { AppLayout } from './components/layout/AppLayout';
import { GoogleOAuthProvider } from '@react-oauth/google';

// Auth and Admin imports
import { LoginPage } from './pages/LoginPage';
import { SignupPage } from './pages/SignupPage';
import { AdminLayout } from './components/admin/AdminLayout';
import { AdminDashboardPage } from './pages/admin/AdminDashboardPage';
import { AdminOrdersPage } from './pages/admin/AdminOrdersPage';
import { AdminCustomersPage } from './pages/admin/AdminCustomersPage';
import { AdminProductsPage } from './pages/admin/AdminProductsPage';
import { AdminOffersPage } from './pages/admin/AdminOffersPage';
import { AdminReviewsPage } from './pages/admin/AdminReviewsPage';
import { AdminVacationPage } from './pages/admin/AdminVacationPage';
import { AdminBannersPage } from './pages/admin/AdminBannersPage';
import { AdminCouponsPage } from './pages/admin/AdminCouponsPage';
import { AdminReportsPage } from './pages/admin/AdminReportsPage';
import { AdminSettingsPage } from './pages/admin/AdminSettingsPage';
// Real Application Pages
import { HomePage } from './pages/HomePage';
import { ShopPage } from './pages/ShopPage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { CartPage } from './pages/CartPage';
import { CheckoutAddressPage } from './pages/CheckoutAddressPage';
import { CheckoutPaymentPage } from './pages/CheckoutPaymentPage';
import { CheckoutReviewPage } from './pages/CheckoutReviewPage';
import { OrderSuccessPage } from './pages/OrderSuccessPage';
import { AccountPage } from './pages/AccountPage';
import { OrdersPage } from './pages/OrdersPage';
import { OrderDetailsPage } from './pages/OrderDetailsPage';
import { TrackOrderPage } from './pages/TrackOrderPage';
import { WishlistPage } from './pages/WishlistPage';
import { SearchPage } from './pages/SearchPage';
import { AboutPage } from './pages/AboutPage';
import { StoryPage } from './pages/StoryPage';
import { SciencePage } from './pages/SciencePage';
import { ContactPage } from './pages/ContactPage';
import { FAQPage } from './pages/FAQPage';
import { PolicyPage } from './pages/PolicyPage';
import { ShowcasePage } from './pages/ShowcasePage';

import { useAuthStore } from './store/useAuthStore';

export const App: React.FC = () => {
  const { token, fetchProfile } = useAuthStore();

  React.useEffect(() => {
    if (token) {
      fetchProfile();
    }
  }, [token, fetchProfile]);

  return (
    <GoogleOAuthProvider clientId="YOUR_GOOGLE_CLIENT_ID">
    <CartProvider>
      <WishlistProvider>
        <Router basename={import.meta.env.BASE_URL}>
          <Routes>
            {/* Auth Routes */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />

            {/* Admin Routes */}
            <Route path="/admin/*" element={
              <AdminLayout>
                <Routes>
                  <Route path="/" element={<AdminDashboardPage />} />
                  <Route path="/orders" element={<AdminOrdersPage />} />
                  <Route path="/customers" element={<AdminCustomersPage />} />
                  <Route path="/products" element={<AdminProductsPage />} />
                  <Route path="/offers" element={<AdminOffersPage />} />
                  <Route path="/reviews" element={<AdminReviewsPage />} />
                  <Route path="/vacation" element={<AdminVacationPage />} />
                  <Route path="/banners" element={<AdminBannersPage />} />
                  <Route path="/coupons" element={<AdminCouponsPage />} />
                  <Route path="/reports" element={<AdminReportsPage />} />
                  <Route path="/settings" element={<AdminSettingsPage />} />
                </Routes>
              </AdminLayout>
            } />

            {/* Showcase Route (Isolated Presentation Page) */}
            <Route path="/showcase" element={<ShowcasePage />} />

            {/* REAL E-COMMERCE APPLICATION ROUTES */}
            <Route
              path="/"
              element={
                <AppLayout>
                  <HomePage />
                </AppLayout>
              }
            />

            <Route
              path="/shop"
              element={
                <AppLayout>
                  <ShopPage />
                </AppLayout>
              }
            />

            <Route
              path="/product/:id"
              element={
                <AppLayout>
                  <ProductDetailPage />
                </AppLayout>
              }
            />

            <Route
              path="/cart"
              element={
                <AppLayout>
                  <CartPage />
                </AppLayout>
              }
            />

            <Route
              path="/checkout/address"
              element={
                <AppLayout hideFooter={true}>
                  <CheckoutAddressPage />
                </AppLayout>
              }
            />

            <Route
              path="/checkout/payment"
              element={
                <AppLayout hideFooter={true}>
                  <CheckoutPaymentPage />
                </AppLayout>
              }
            />

            <Route
              path="/checkout/review"
              element={
                <AppLayout hideFooter={true}>
                  <CheckoutReviewPage />
                </AppLayout>
              }
            />

            <Route
              path="/order-success"
              element={
                <AppLayout>
                  <OrderSuccessPage />
                </AppLayout>
              }
            />

            <Route
              path="/account"
              element={
                <AppLayout>
                  <AccountPage />
                </AppLayout>
              }
            />

            <Route
              path="/orders"
              element={
                <AppLayout>
                  <OrdersPage />
                </AppLayout>
              }
            />

            <Route
              path="/order-details"
              element={
                <AppLayout>
                  <OrderDetailsPage />
                </AppLayout>
              }
            />

            <Route
              path="/track-order"
              element={
                <AppLayout>
                  <TrackOrderPage />
                </AppLayout>
              }
            />

            <Route
              path="/wishlist"
              element={
                <AppLayout>
                  <WishlistPage />
                </AppLayout>
              }
            />

            <Route
              path="/search"
              element={
                <AppLayout>
                  <SearchPage />
                </AppLayout>
              }
            />

            <Route
              path="/about"
              element={
                <AppLayout>
                  <AboutPage />
                </AppLayout>
              }
            />

            <Route
              path="/story"
              element={
                <AppLayout>
                  <StoryPage />
                </AppLayout>
              }
            />

            <Route
              path="/science"
              element={
                <AppLayout>
                  <SciencePage />
                </AppLayout>
              }
            />

            <Route
              path="/contact"
              element={
                <AppLayout>
                  <ContactPage />
                </AppLayout>
              }
            />

            <Route
              path="/faq"
              element={
                <AppLayout>
                  <FAQPage />
                </AppLayout>
              }
            />

            <Route
              path="/shipping"
              element={
                <AppLayout>
                  <PolicyPage type="shipping" />
                </AppLayout>
              }
            />

            <Route
              path="/returns"
              element={
                <AppLayout>
                  <PolicyPage type="returns" />
                </AppLayout>
              }
            />

            <Route
              path="/terms"
              element={
                <AppLayout>
                  <PolicyPage type="terms" />
                </AppLayout>
              }
            />

            <Route
              path="/privacy"
              element={
                <AppLayout>
                  <PolicyPage type="privacy" />
                </AppLayout>
              }
            />

            {/* Fallback route */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
      </WishlistProvider>
    </CartProvider>
    </GoogleOAuthProvider>
  );
};

export default App;
