'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  MessageCircle, 
  QrCode, 
  TrendingUp, 
  Users, 
  Clock, 
  CheckCircle, 
  XCircle,
  AlertTriangle,
  RefreshCw,
  Search,
  Download,
  Filter,
  BarChart3,
  Globe,
  Smartphone
} from 'lucide-react';

interface VerificationStats {
  total: number;
  whatsapp: number;
  sms: number;
  qr_auto: number;
  success_rate: number;
  avg_time: number;
  countries: { [key: string]: number };
}

interface QRSession {
  id: string;
  phone: string;
  country: string;
  status: 'pending' | 'verified' | 'expired';
  created_at: string;
  expires_at: string;
  method: string;
}

export default function WhatsAppAdminPage() {
  const [stats, setStats] = useState<VerificationStats>({
    total: 0,
    whatsapp: 0,
    sms: 0,
    qr_auto: 0,
    success_rate: 0,
    avg_time: 0,
    countries: {}
  });
  
  const [recentSessions, setRecentSessions] = useState<QRSession[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTimeRange, setSelectedTimeRange] = useState('24h');
  const [isClient, setIsClient] = useState(false);

  // Fix hydration
  useEffect(() => {
    setIsClient(true);
    loadDashboardData();
    
    // Auto-refresh every 30 seconds
    const interval = setInterval(loadDashboardData, 30000);
    return () => clearInterval(interval);
  }, [selectedTimeRange]);

  const loadDashboardData = async () => {
    setIsLoading(true);
    try {
      // Simulate loading stats (in production, these would come from your API)
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock data - replace with real API calls
      setStats({
        total: 1247,
        whatsapp: 1089,
        sms: 158,
        qr_auto: 892,
        success_rate: 94.2,
        avg_time: 12.5,
        countries: {
          'MA': 534, // Morocco
          'FR': 289, // France
          'ES': 187, // Spain
          'DE': 124, // Germany
          'US': 98,  // USA
          'CA': 15   // Canada
        }
      });
      
      setRecentSessions([
        {
          id: 'qr_1735689234_abc123',
          phone: '+212-6-12-34-56-78',
          country: 'MA',
          status: 'verified',
          created_at: new Date(Date.now() - 2 * 60 * 1000).toISOString(),
          expires_at: new Date(Date.now() + 8 * 60 * 1000).toISOString(),
          method: 'qr_auto'
        },
        {
          id: 'qr_1735689134_def456',
          phone: '+33-6-98-76-54-32',
          country: 'FR',
          status: 'pending',
          created_at: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
          expires_at: new Date(Date.now() + 5 * 60 * 1000).toISOString(),
          method: 'qr_auto'
        },
        {
          id: 'qr_1735689034_ghi789',
          phone: '+1-555-123-4567',
          country: 'US',
          status: 'expired',
          created_at: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
          expires_at: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
          method: 'sms'
        }
      ]);
      
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getCountryFlag = (countryCode: string) => {
    const flags = {
      'MA': '🇲🇦',
      'FR': '🇫🇷',
      'ES': '🇪🇸',
      'DE': '🇩🇪',
      'US': '🇺🇸',
      'CA': '🇨🇦'
    };
    return flags[countryCode] || '🌍';
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'verified': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'pending': return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'expired': return <XCircle className="w-4 h-4 text-red-500" />;
      default: return <AlertTriangle className="w-4 h-4 text-gray-500" />;
    }
  };

  const exportData = () => {
    // In production, this would download a CSV/Excel file
    console.log('Exporting verification data...');
    alert('Export functionality would be implemented here');
  };

  const filteredSessions = recentSessions.filter(session =>
    session.phone.toLowerCase().includes(searchTerm.toLowerCase()) ||
    session.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Prevent hydration mismatch
  if (!isClient) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Loading...</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">WhatsApp Verification Dashboard</h1>
            <p className="text-gray-600">Monitor and manage phone verification analytics</p>
          </div>
          
          <div className="flex gap-3">
            <Button onClick={loadDashboardData} variant="outline" disabled={isLoading}>
              <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            <Button onClick={exportData} variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          
          {/* Total Verifications */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Verifications</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">Last {selectedTimeRange}</p>
            </CardContent>
          </Card>

          {/* WhatsApp Success Rate */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{stats.success_rate}%</div>
              <p className="text-xs text-muted-foreground">+2.4% from last period</p>
            </CardContent>
          </Card>

          {/* WhatsApp vs SMS */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">WhatsApp Preference</CardTitle>
              <MessageCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {Math.round((stats.whatsapp / stats.total) * 100)}%
              </div>
              <p className="text-xs text-muted-foreground">
                {stats.whatsapp} WhatsApp vs {stats.sms} SMS
              </p>
            </CardContent>
          </Card>

          {/* QR Auto-Validation */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">QR Auto-Validation</CardTitle>
              <QrCode className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">{stats.qr_auto}</div>
              <p className="text-xs text-muted-foreground">
                {Math.round((stats.qr_auto / stats.whatsapp) * 100)}% of WhatsApp verifications
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          
          {/* Country Distribution */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="w-5 h-5" />
                Country Distribution
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {Object.entries(stats.countries)
                  .sort(([,a], [,b]) => b - a)
                  .map(([country, count]) => (
                    <div key={country} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{getCountryFlag(country)}</span>
                        <span className="text-sm font-medium">{country}</span>
                      </div>
                      <div className="text-sm text-gray-600">{count}</div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Sessions */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                Recent Verification Sessions
              </CardTitle>
              <div className="flex gap-2">
                <Input
                  placeholder="Search phone or session ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="max-w-sm"
                />
                <Button variant="outline" size="sm">
                  <Filter className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {filteredSessions.map((session) => (
                  <div key={session.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div>{getStatusIcon(session.status)}</div>
                      <div>
                        <div className="font-medium text-sm">{session.phone}</div>
                        <div className="text-xs text-gray-500">
                          {session.id} • {session.method}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <span className="text-lg">{getCountryFlag(session.country)}</span>
                      <div className="text-right">
                        <div className="text-sm font-medium capitalize">{session.status}</div>
                        <div className="text-xs text-gray-500">
                          {new Date(session.created_at).toLocaleTimeString()}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* System Health */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Smartphone className="w-5 h-5" />
              System Health & Performance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              
              {/* Webhook Status */}
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <div>
                  <div className="font-medium">WhatsApp Webhook</div>
                  <div className="text-sm text-gray-600">Online • Last message 2m ago</div>
                </div>
              </div>
              
              {/* Database Status */}
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <div>
                  <div className="font-medium">Database</div>
                  <div className="text-sm text-gray-600">Healthy • 45ms avg response</div>
                </div>
              </div>
              
              {/* SMS Fallback */}
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <div>
                  <div className="font-medium">SMS Fallback</div>
                  <div className="text-sm text-gray-600">Active • Twilio connected</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 