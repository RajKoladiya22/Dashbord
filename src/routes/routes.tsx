import React, { ReactNode, useEffect } from "react";
import { createBrowserRouter, useLocation } from "react-router-dom";
import { ProjectsDashboardPage } from "../pages/dashboards";
import {
  DashboardLayout,
  // CorporateLayout,
  GuestLayout,
  UserAccountLayout,
} from "../layouts";
import {
  Error400Page,
  Error403Page,
  Error404Page,
  Error500Page,
  Error503Page,
  ErrorPage,
  HomePage,
  SignInPage,
  SignUpPage,
  AddCustomerPage,
  CustomerListPage,
  ReminderPage,
  TeamPage,
  PartnerPage,
  ProductPage,
  CustomFieldsListPage,
} from "../pages";
import ProtectedRoute from "../utils/ProtectedRoute";
import { PlanLayout } from "../pages/plan";

// Custom scroll restoration function
export const ScrollToTop: React.FC = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth",
    }); // Scroll to the top when the location changes
  }, [pathname]);

  return null; // This component doesn't render anything
};

type PageProps = {
  children: ReactNode;
};

// Create an HOC to wrap your route components with ScrollToTop
const PageWrapper = ({ children }: PageProps) => {
  return (
    <>
      <ScrollToTop />
      {children}
    </>
  );
};

// Create the router
const router = createBrowserRouter([
  // GuestLayout
  {
    path: "/",
    element: <PageWrapper children={<GuestLayout />} />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        path: "",
        element: <HomePage />,
      },
    ],
  },
  // auth
  {
    path: "/auth",
    errorElement: <ErrorPage />,
    children: [
      {
        path: "signup",
        element: <SignUpPage />,
      },
      {
        path: "signin",
        element: <SignInPage />,
      },
      //   {
      //     path: 'welcome',
      //     element: <WelcomePage />,
      //   },
      //   {
      //     path: 'verify-email',
      //     element: <VerifyEmailPage />,
      //   },
      //   {
      //     path: 'password-reset',
      //     element: <PasswordResetPage />,
      //   },
      //   {
      //     path: 'account-delete',
      //     element: <AccountDeactivePage />,
      //   },
    ],
  },
  // errors
  {
    path: "errors",
    errorElement: <ErrorPage />,
    children: [
      {
        path: "400",
        element: <Error400Page />,
      },
      {
        path: "403",
        element: <Error403Page />,
      },
      {
        path: "404",
        element: <Error404Page />,
      },
      {
        path: "500",
        element: <Error500Page />,
      },
      {
        path: "503",
        element: <Error503Page />,
      },
    ],
  },
  // ProtectedRoute : admin
  {
    element: <ProtectedRoute allowedRoles={["admin","super_admin"]} />,
    children: [
      // Partner Team
      {
        path: "/partner-team",
        element: <PageWrapper children={<DashboardLayout />} />,
        errorElement: <ErrorPage />,
        children: [
          {
            path: "team",
            element: <TeamPage />,
          },
          {
            path: "partner",
            element: <PartnerPage />,
          },
        ],
      },
      // Custom Fields
      {
        path: "/customfields",
        element: <PageWrapper children={<DashboardLayout />} />,
        errorElement: <ErrorPage />,
        children: [
          {
            path: "",
            element: <CustomFieldsListPage />,
          },
        ],
      },
      // Plan SuperAdmin
      {
        path: "/plan",
        element: <PageWrapper children={<DashboardLayout />} />,
        errorElement: <ErrorPage />,
        children: [
          {
            path: "",
            element: <PlanLayout />,
          },
        ],
      },
    ],
  },
  // ProtectedRoute : admin, partner, team_member
  {
    element: (
      <ProtectedRoute allowedRoles={["admin", "partner", "team_member", "super_admin"]} />
    ),
    children: [
      // dashboards
      {
        path: "/dashboards/home",
        element: <PageWrapper children={<DashboardLayout />} />,
        errorElement: <ErrorPage />,
        children: [
          {
            path: "",
            element: <ProjectsDashboardPage />,
          },
        ],
      },
      // customer
      {
        path: "/customer",
        element: <PageWrapper children={<DashboardLayout />} />,
        errorElement: <ErrorPage />,
        children: [
          {
            index: true,
            path: "addcustomer",
            element: <AddCustomerPage />,
          },
          {
            index: true,
            path: "customerlist",
            element: <CustomerListPage />,
          },
          {
            index: true,
            path: "reminder",
            element: <ReminderPage />,
          },
        ],
      },
      // product
      {
        path: "/product",
        element: <PageWrapper children={<DashboardLayout />} />,
        errorElement: <ErrorPage />,
        children: [
          {
            index: true,
            path: "",
            element: <ProductPage />,
          },
        ],
      },
      // user-profile
      {
        path: "/user-profile",
        element: <PageWrapper children={<DashboardLayout />} />,
        errorElement: <ErrorPage />,
        children: [
          {
            index: true,
            path: "",
            element: <UserAccountLayout />,
          },
        ],
      },
    ],
  },
]);

// const router = createBrowserRouter([
//   {
//     path: '/',
//     element: <PageWrapper children={<GuestLayout />} />,
//     errorElement: <ErrorPage />,
//     children: [
//       {
//         index: true,
//         path: '',
//         element: <HomePage />,
//       },
//     ],
//   },
//   {
//     path: '/dashboards',
//     element: <PageWrapper children={<DashboardLayout />} />,
//     errorElement: <ErrorPage />,
//     children: [
//       {
//         index: true,
//         path: 'default',
//         element: <DefaultDashboardPage />,
//       },
//       {
//         path: 'projects',
//         element: <ProjectsDashboardPage />,
//       },
//       {
//         path: 'ecommerce',
//         element: <EcommerceDashboardPage />,
//       },
//       {
//         path: 'marketing',
//         element: <MarketingDashboardPage />,
//       },
//       {
//         path: 'social',
//         element: <SocialDashboardPage />,
//       },
//       {
//         path: 'bidding',
//         element: <BiddingDashboardPage />,
//       },
//       {
//         path: 'learning',
//         element: <LearningDashboardPage />,
//       },
//       {
//         path: 'logistics',
//         element: <LogisticsDashboardPage />,
//       },
//     ],
//   },
//   {
//     path: '/sitemap',
//     element: <PageWrapper children={<DashboardLayout />} />,
//     errorElement: <ErrorPage />,
//     children: [
//       {
//         index: true,
//         path: '',
//         element: <SitemapPage />,
//       },
//     ],
//   },
//   {
//     path: '/corporate',
//     element: <PageWrapper children={<CorporateLayout />} />,
//     errorElement: <ErrorPage />,
//     children: [
//       {
//         index: true,
//         path: 'about',
//         element: <CorporateAboutPage />,
//       },
//       {
//         path: 'team',
//         element: <CorporateTeamPage />,
//       },
//       {
//         path: 'faqs',
//         element: <CorporateFaqPage />,
//       },
//       {
//         path: 'contact',
//         element: <CorporateContactPage />,
//       },
//       {
//         path: 'pricing',
//         element: <CorporatePricingPage />,
//       },
//       {
//         path: 'license',
//         element: <CorporateLicensePage />,
//       },
//     ],
//   },
//   {
//     path: '/user-profile',
//     element: <PageWrapper children={<UserAccountLayout />} />,
//     errorElement: <ErrorPage />,
//     children: [
//       {
//         index: true,
//         path: 'details',
//         element: <UserProfileDetailsPage />,
//       },
//       {
//         path: 'preferences',
//         element: <UserProfilePreferencesPage />,
//       },
//       {
//         path: 'information',
//         element: <UserProfileInformationPage />,
//       },
//       {
//         path: 'security',
//         element: <UserProfileSecurityPage />,
//       },
//       {
//         path: 'activity',
//         element: <UserProfileActivityPage />,
//       },
//       {
//         path: 'actions',
//         element: <UserProfileActionsPage />,
//       },
//       {
//         path: 'help',
//         element: <UserProfileHelpPage />,
//       },
//       {
//         path: 'feedback',
//         element: <UserProfileFeedbackPage />,
//       },
//     ],
//   },
//   {
//     path: '/auth',
//     errorElement: <ErrorPage />,
//     children: [
//       {
//         path: 'signup',
//         element: <SignUpPage />,
//       },
//       {
//         path: 'signin',
//         element: <SignInPage />,
//       },
//       {
//         path: 'welcome',
//         element: <WelcomePage />,
//       },
//       {
//         path: 'verify-email',
//         element: <VerifyEmailPage />,
//       },
//       {
//         path: 'password-reset',
//         element: <PasswordResetPage />,
//       },
//       {
//         path: 'account-delete',
//         element: <AccountDeactivePage />,
//       },
//     ],
//   },
//   {
//     path: 'errors',
//     errorElement: <ErrorPage />,
//     children: [
//       {
//         path: '400',
//         element: <Error400Page />,
//       },
//       {
//         path: '403',
//         element: <Error403Page />,
//       },
//       {
//         path: '404',
//         element: <Error404Page />,
//       },
//       {
//         path: '500',
//         element: <Error500Page />,
//       },
//       {
//         path: '503',
//         element: <Error503Page />,
//       },
//     ],
//   },
//   {
//     path: '/about',
//     element: <PageWrapper children={<DashboardLayout />} />,
//     errorElement: <ErrorPage />,
//     children: [
//       {
//         index: true,
//         path: '',
//         element: <AboutPage />,
//       },
//     ],
//   },
// ]);

export default router;
