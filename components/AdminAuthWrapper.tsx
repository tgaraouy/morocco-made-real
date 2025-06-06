'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Shield, Lock, UserCheck, AlertCircle } from 'lucide-react';

interface AdminAuthWrapperProps {
  children: React.ReactNode;
  fallbackMessage?: string;
  redirectUrl?: string;
}

export default function AdminAuthWrapper({ 
  children, 
  fallbackMessage = "Admin access required to view this content",
  redirectUrl = "/en/artisan"
}: AdminAuthWrapperProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState<'admin' | 'artisan' | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Simulate authentication check
  useEffect(() => {
    const checkAuth = () => {
      // In a real application, this would check actual authentication state
      // For demo purposes, we'll use localStorage or default to admin for testing
      const storedAuth = localStorage.getItem('adminAuth');
      const storedRole = localStorage.getItem('userRole') as 'admin' | 'artisan' | null;
      
      if (storedAuth === 'true') {
        setIsAuthenticated(true);
        setUserRole(storedRole || 'admin');
      } else {
        // Default to admin for demo - in production this would be false
        setIsAuthenticated(true);
        setUserRole('admin');
        localStorage.setItem('adminAuth', 'true');
        localStorage.setItem('userRole', 'admin');
      }
      
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  const handleLogin = () => {
    setIsAuthenticated(true);
    setUserRole('admin');
    localStorage.setItem('adminAuth', 'true');
    localStorage.setItem('userRole', 'admin');
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUserRole(null);
    localStorage.removeItem('adminAuth');
    localStorage.removeItem('userRole');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-moroccan-sand via-white to-moroccan-sand/30 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!isAuthenticated || userRole !== 'admin') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-moroccan-sand via-white to-moroccan-sand/30 flex items-center justify-center">
        <Card className="max-w-md w-full mx-4">
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center gap-2">
              <Shield className="w-8 h-8 text-blue-600" />
              Admin Access Required
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <div className="flex items-center justify-center gap-2 text-orange-600 mb-4">
              <AlertCircle className="w-5 h-5" />
              <span className="text-sm">Restricted Content</span>
            </div>
            
            <p className="text-gray-600">{fallbackMessage}</p>
            
            <div className="space-y-3">
              <Button 
                onClick={handleLogin}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600"
              >
                <Shield className="w-4 h-4 mr-2" />
                Admin Login (Demo Mode)
              </Button>
              
              <Button 
                variant="outline" 
                onClick={() => window.location.href = redirectUrl}
                className="w-full"
              >
                Back to Public Area
              </Button>
            </div>
            
            <div className="text-xs text-gray-500 mt-4 p-3 bg-gray-50 rounded">
              <p><strong>Demo Mode:</strong> In production, this would integrate with your authentication system.</p>
              <p className="mt-1">Currently simulating admin access for testing purposes.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // User is authenticated as admin, show the protected content
  return (
    <div>
      {/* Admin Status Bar */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <UserCheck className="w-4 h-4" />
              <span className="text-sm font-medium">Admin Mode Active</span>
            </div>
            <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
              <Lock className="w-3 h-3 mr-1" />
              Full Access
            </Badge>
          </div>
          
          <Button 
            variant="outline" 
            size="sm"
            onClick={handleLogout}
            className="border-white/30 text-white hover:bg-white/10"
          >
            Logout
          </Button>
        </div>
      </div>
      
      {children}
    </div>
  );
}

// Export utility functions for checking auth state
export const useAdminAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState<'admin' | 'artisan' | null>(null);

  useEffect(() => {
    const storedAuth = localStorage.getItem('adminAuth');
    const storedRole = localStorage.getItem('userRole') as 'admin' | 'artisan' | null;
    
    if (storedAuth === 'true') {
      setIsAuthenticated(true);
      setUserRole(storedRole || 'admin');
    }
  }, []);

  return { isAuthenticated, userRole, isAdmin: userRole === 'admin' };
}; 