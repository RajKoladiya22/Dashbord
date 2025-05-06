import React, { memo } from 'react';
import { Outlet } from 'react-router-dom';
import { AppLayout } from '../app';

export const DashboardLayout = memo(() => (
  <AppLayout>
    <Outlet />
  </AppLayout>
));

export default React.memo(DashboardLayout);