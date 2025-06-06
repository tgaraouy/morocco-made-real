'use client';

import React from 'react';
import ArtisanDashboard from '@/components/ArtisanDashboard';

export default function ArtisanPage() {
  // In a real implementation, this would come from authentication/routing
  const artisanId = 'ART-2024-001';

  return <ArtisanDashboard artisanId={artisanId} userRole="admin" />;
} 