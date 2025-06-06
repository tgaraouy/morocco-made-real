'use client';

import React, { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import AdminAuthWrapper from '@/components/AdminAuthWrapper';
import { useRouter } from 'next/navigation';
import { 
  Users, 
  Brain,
  Database,
  Link,
  Globe,
  Shield,
  CheckCircle,
  Clock,
  AlertCircle,
  TrendingUp,
  BarChart3,
  Filter,
  Search,
  Download,
  Settings,
  Eye,
  Edit,
  Trash2,
  Play,
  Pause,
  MoreHorizontal,
  Calendar,
  MapPin,
  Award,
  Target,
  Zap,
  Heart,
  Star
} from 'lucide-react';

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

interface ArtisanPreservationRecord {
  id: string;
  artisanName: string;
  craft: string;
  region: string;
  currentStage: string;
  stageProgress: number;
  overallProgress: number;
  status: 'active' | 'completed' | 'paused' | 'failed';
  lastUpdated: Date;
  fieldLiaison: string;
  endangermentLevel: 'stable' | 'vulnerable' | 'endangered' | 'critical';
  validationLevel: 0 | 1 | 2 | 3;
  culturalDnaHash?: string;
  blockchainCertificate?: string;
  touristMatches: number;
  communityImpact: number;
}

interface PreservationMetrics {
  totalArtisans: number;
  activePreservations: number;
  completedPreservations: number;
  stageDistribution: {
    intake: number;
    consent: number;
    documentation: number;
    culturalDna: number;
    blockchain: number;
    experience: number;
  };
  urgentCases: number;
  averageCompletionTime: number;
  touristEngagement: number;
  communityImpactScore: number;
}

// ============================================================================
// MAIN DASHBOARD COMPONENT
// ============================================================================

function PreservationDashboardContent() {
  const router = useRouter();
  const t = useTranslations('preservation_dashboard');
  const tCommon = useTranslations('common');
  const [activeTab, setActiveTab] = useState('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStage, setFilterStage] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

  // Mock data - In production, this would come from your API
  const [metrics, setMetrics] = useState<PreservationMetrics>({
    totalArtisans: 1247,
    activePreservations: 356,
    completedPreservations: 891,
    stageDistribution: {
      intake: 89,
      consent: 67,
      documentation: 124,
      culturalDna: 76,
      blockchain: 45,
      experience: 234
    },
    urgentCases: 23,
    averageCompletionTime: 18.5,
    touristEngagement: 92.4,
    communityImpactScore: 87.3
  });

  const [artisanRecords, setArtisanRecords] = useState<ArtisanPreservationRecord[]>([
    {
      id: 'ART-2024-001',
      artisanName: 'Hassan Al-Drawi',
      craft: 'blue_pottery',
      region: 'draa_valley',
      currentStage: 'cultural-dna',
      stageProgress: 75,
      overallProgress: 65,
      status: 'active',
      lastUpdated: new Date('2024-01-15T14:30:00'),
      fieldLiaison: 'Fatima Benali',
      endangermentLevel: 'vulnerable',
      validationLevel: 1,
      touristMatches: 12,
      communityImpact: 850
    },
    {
      id: 'ART-2024-002',
      artisanName: 'Aicha Tazi',
      craft: 'berber_carpet_weaving',
      region: 'atlas_mountains',
      currentStage: 'blockchain',
      stageProgress: 90,
      overallProgress: 85,
      status: 'active',
      lastUpdated: new Date('2024-01-14T16:45:00'),
      fieldLiaison: 'Omar Kabbaj',
      endangermentLevel: 'endangered',
      validationLevel: 2,
      touristMatches: 8,
      communityImpact: 1200
    },
    {
      id: 'ART-2024-003',
      artisanName: 'Mohammed Senhaji',
      craft: 'traditional_metalwork',
      region: 'fez_region',
      currentStage: 'experience',
      stageProgress: 100,
      overallProgress: 100,
      status: 'completed',
      lastUpdated: new Date('2024-01-12T09:15:00'),
      fieldLiaison: 'Laila Amrani',
      endangermentLevel: 'stable',
      validationLevel: 3,
      culturalDnaHash: '0x7f9c4a2b8e5d3f1a',
      blockchainCertificate: 'CERT-2024-003',
      touristMatches: 23,
      communityImpact: 2100
    }
  ]);

  const tabs = [
    { id: 'overview', label: t('tabs.overview'), icon: BarChart3 },
    { id: 'artisans', label: t('tabs.artisans'), icon: Users },
    { id: 'stages', label: t('tabs.stages'), icon: Target },
    { id: 'analytics', label: t('tabs.analytics'), icon: TrendingUp },
    { id: 'urgent', label: t('tabs.urgent'), icon: AlertCircle },
    { id: 'settings', label: t('tabs.settings'), icon: Settings }
  ];

  const stages = [
    { id: 'intake', name: t('stages.intake'), icon: Users, color: 'blue' },
    { id: 'consent', name: t('stages.consent'), icon: Shield, color: 'red' },
    { id: 'documentation', name: t('stages.documentation'), icon: Brain, color: 'purple' },
    { id: 'cultural-dna', name: t('stages.cultural_dna'), icon: Database, color: 'green' },
    { id: 'blockchain', name: t('stages.blockchain'), icon: Link, color: 'indigo' },
    { id: 'experience', name: t('stages.experience'), icon: Globe, color: 'teal' }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-blue-600 bg-blue-100';
      case 'completed': return 'text-green-600 bg-green-100';
      case 'paused': return 'text-yellow-600 bg-yellow-100';
      case 'failed': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getEndangermentColor = (level: string) => {
    switch (level) {
      case 'stable': return 'text-green-600 bg-green-100';
      case 'vulnerable': return 'text-yellow-600 bg-yellow-100';
      case 'endangered': return 'text-orange-600 bg-orange-100';
      case 'critical': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const filteredRecords = artisanRecords.filter(record => {
    const matchesSearch = record.artisanName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         record.craft.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         record.region.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStage = filterStage === 'all' || record.currentStage === filterStage;
    const matchesStatus = filterStatus === 'all' || record.status === filterStatus;
    return matchesSearch && matchesStage && matchesStatus;
  });

  // ========================================================================
  // RENDER METHODS
  // ========================================================================

  const renderOverviewTab = () => (
    <div className="space-y-6">
      {/* Metrics Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <Users className="w-8 h-8 mx-auto mb-2 text-blue-600" />
            <div className="text-2xl font-bold">{metrics.totalArtisans}</div>
            <div className="text-sm text-gray-600">{t('metrics.total_artisans')}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Clock className="w-8 h-8 mx-auto mb-2 text-orange-600" />
            <div className="text-2xl font-bold">{metrics.activePreservations}</div>
            <div className="text-sm text-gray-600">{t('metrics.active_preservations')}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <CheckCircle className="w-8 h-8 mx-auto mb-2 text-green-600" />
            <div className="text-2xl font-bold">{metrics.completedPreservations}</div>
            <div className="text-sm text-gray-600">{t('metrics.completed')}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <AlertCircle className="w-8 h-8 mx-auto mb-2 text-red-600" />
            <div className="text-2xl font-bold">{metrics.urgentCases}</div>
            <div className="text-sm text-gray-600">{t('metrics.urgent_cases')}</div>
          </CardContent>
        </Card>
      </div>

      {/* Stage Distribution */}
      <Card>
        <CardHeader>
          <CardTitle>{t('pipeline.title')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {stages.map((stage) => {
              const count = metrics.stageDistribution[stage.id as keyof typeof metrics.stageDistribution];
              const Icon = stage.icon;
              return (
                <div key={stage.id} className="text-center p-3 border rounded-lg">
                  <Icon className={`w-6 h-6 mx-auto mb-2 text-${stage.color}-600`} />
                  <div className="text-lg font-bold">{count}</div>
                  <div className="text-xs text-gray-600">{stage.name}</div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Key Performance Indicators */}
      <div className="grid md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-green-600" />
              {t('metrics.completion_rate')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600 mb-2">71.4%</div>
            <Progress value={71.4} className="mb-2" />
            <p className="text-sm text-gray-600">
              {t('metrics.average_completion_time')}: {metrics.averageCompletionTime} {t('pipeline.completion_time_days')}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Heart className="w-5 h-5 text-pink-600" />
              {t('metrics.tourist_engagement')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-pink-600 mb-2">{metrics.touristEngagement}%</div>
            <Progress value={metrics.touristEngagement} className="mb-2" />
            <p className="text-sm text-gray-600">
              {t('metrics.cultural_experience_satisfaction')}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="w-5 h-5 text-yellow-600" />
              {t('metrics.community_impact_score')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-yellow-600 mb-2">{metrics.communityImpactScore}%</div>
            <Progress value={metrics.communityImpactScore} className="mb-2" />
            <p className="text-sm text-gray-600">
              {t('metrics.economic_and_cultural_benefits')}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>{t('pipeline.recent_activity')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center gap-4 p-3 bg-green-50 rounded-lg">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <div className="flex-1">
                <p className="font-medium">Mohammed Senhaji {t('activity.completed_preservation')}</p>
                <p className="text-sm text-gray-600">{t('crafts.traditional_metalwork')} - {t('activity.blockchain_anchored')}</p>
              </div>
              <span className="text-sm text-gray-500">2{t('activity.time_ago.hours')}</span>
            </div>
            <div className="flex items-center gap-4 p-3 bg-blue-50 rounded-lg">
              <Brain className="w-5 h-5 text-blue-600" />
              <div className="flex-1">
                <p className="font-medium">{t('activity.ai_documentation_completed')} Hassan Al-Drawi</p>
                <p className="text-sm text-gray-600">{t('crafts.blue_pottery')} - {t('activity.moving_to_cultural_dna')}</p>
              </div>
              <span className="text-sm text-gray-500">4{t('activity.time_ago.hours')}</span>
            </div>
            <div className="flex items-center gap-4 p-3 bg-orange-50 rounded-lg">
              <AlertCircle className="w-5 h-5 text-orange-600" />
              <div className="flex-1">
                <p className="font-medium">{t('activity.urgent_endangerment')}</p>
                <p className="text-sm text-gray-600">{t('crafts.amazigh_silver_jewelry')} - Only 3 {t('activity.practitioners_remaining')}</p>
              </div>
              <span className="text-sm text-gray-500">6{t('activity.time_ago.hours')}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderArtisansTab = () => (
    <div className="space-y-6">
      {/* Search and Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex-1 min-w-64">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search artisans, crafts, regions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border rounded-lg"
                />
              </div>
            </div>
            <select
              value={filterStage}
              onChange={(e) => setFilterStage(e.target.value)}
              className="px-3 py-2 border rounded-lg"
            >
              <option value="all">All Stages</option>
              {stages.map(stage => (
                <option key={stage.id} value={stage.id}>{stage.name}</option>
              ))}
            </select>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 border rounded-lg"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="completed">Completed</option>
              <option value="paused">Paused</option>
              <option value="failed">Failed</option>
            </select>
            <Button variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Artisan Records Table */}
      <Card>
        <CardHeader>
          <CardTitle>Artisan Preservation Records ({filteredRecords.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-3">Artisan</th>
                  <th className="text-left p-3">Current Stage</th>
                  <th className="text-left p-3">Progress</th>
                  <th className="text-left p-3">Status</th>
                  <th className="text-left p-3">Endangerment</th>
                  <th className="text-left p-3">Impact</th>
                  <th className="text-left p-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredRecords.map((record) => (
                  <tr key={record.id} className="border-b hover:bg-gray-50">
                    <td className="p-3">
                      <div>
                        <div className="font-medium">{record.artisanName}</div>
                        <div className="text-gray-600 text-xs">{record.craft} • {record.region}</div>
                        <div className="text-gray-500 text-xs">ID: {record.id}</div>
                      </div>
                    </td>
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        {stages.find(s => s.id === record.currentStage)?.icon && 
                          React.createElement(stages.find(s => s.id === record.currentStage)!.icon, {
                            className: "w-4 h-4"
                          })
                        }
                        <span className="text-sm">{stages.find(s => s.id === record.currentStage)?.name}</span>
                      </div>
                    </td>
                    <td className="p-3">
                      <div className="space-y-1">
                        <Progress value={record.overallProgress} className="h-2" />
                        <div className="text-xs text-gray-600">{record.overallProgress}% overall</div>
                      </div>
                    </td>
                    <td className="p-3">
                      <Badge className={getStatusColor(record.status)}>
                        {record.status}
                      </Badge>
                    </td>
                    <td className="p-3">
                      <Badge className={getEndangermentColor(record.endangermentLevel)}>
                        {record.endangermentLevel}
                      </Badge>
                    </td>
                    <td className="p-3">
                      <div className="text-sm">
                        <div className="flex items-center gap-1">
                          <Heart className="w-3 h-3 text-pink-600" />
                          <span>{record.touristMatches} matches</span>
                        </div>
                        <div className="text-gray-600 text-xs">{record.communityImpact} MAD impact</div>
                      </div>
                    </td>
                    <td className="p-3">
                      <div className="flex gap-1">
                        <Button size="sm" variant="outline">
                          <Eye className="w-3 h-3" />
                        </Button>
                        <Button size="sm" variant="outline">
                          <Edit className="w-3 h-3" />
                        </Button>
                        <Button size="sm" variant="outline">
                          <MoreHorizontal className="w-3 h-3" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderUrgentCasesTab = () => (
    <div className="space-y-6">
      <Alert>
        <AlertCircle className="w-4 h-4" />
        <AlertDescription>
          {metrics.urgentCases} urgent preservation cases require immediate attention. 
          Critical endangerment levels detected for traditional crafts.
        </AlertDescription>
      </Alert>

      <div className="grid gap-4">
        <Card className="border-red-200 bg-red-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-800">
              <AlertCircle className="w-5 h-5" />
              Critical: Amazigh Silver Jewelry
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-red-700 mb-3">
                  Only 3 master artisans remaining in the Souss Valley. 
                  Traditional techniques at risk of complete loss.
                </p>
                <div className="space-y-2 text-sm">
                  <div><strong>Last Documentation:</strong> 2019</div>
                  <div><strong>Artisans Available:</strong> 3 (ages 67, 71, 78)</div>
                  <div><strong>Estimated Time to Loss:</strong> 5-8 years</div>
                </div>
              </div>
              <div className="space-y-2">
                <Button className="w-full bg-red-600 hover:bg-red-700">
                  <Zap className="w-4 h-4 mr-2" />
                  Launch Emergency Documentation
                </Button>
                <Button variant="outline" className="w-full">
                  <Calendar className="w-4 h-4 mr-2" />
                  Schedule Field Mission
                </Button>
                <Button variant="outline" className="w-full">
                  <Users className="w-4 h-4 mr-2" />
                  Find Additional Artisans
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-orange-200 bg-orange-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-orange-800">
              <AlertCircle className="w-5 h-5" />
              High Priority: Atlas Mountain Pottery
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-orange-700 mb-3">
                  Traditional clay preparation techniques being replaced by modern methods. 
                  Only 12 artisans still use ancestral firing techniques.
                </p>
                <div className="space-y-2 text-sm">
                  <div><strong>Documentation Status:</strong> 45% complete</div>
                  <div><strong>Active Artisans:</strong> 12 (declining)</div>
                  <div><strong>Tourism Interest:</strong> High (127 inquiries)</div>
                </div>
              </div>
              <div className="space-y-2">
                <Button className="w-full bg-orange-600 hover:bg-orange-700">
                  <Play className="w-4 h-4 mr-2" />
                  Resume Documentation
                </Button>
                <Button variant="outline" className="w-full">
                  <Globe className="w-4 h-4 mr-2" />
                  Connect with Tourists
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  // ========================================================================
  // MAIN RENDER
  // ========================================================================

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold text-gray-900">
              🏛️ Cultural Preservation Dashboard
            </h1>
            <p className="text-xl text-gray-600">
              Administrative Control Center for Heritage Protection
            </p>
          </div>
          <div className="flex gap-3">
            <Button 
              variant="outline"
              onClick={() => router.push('/en/artisan/preservation')}
            >
              <Eye className="w-4 h-4 mr-2" />
              View Portal
            </Button>
            <Button className="bg-gradient-to-r from-blue-600 to-purple-600">
              <Settings className="w-4 h-4 mr-2" />
              System Settings
            </Button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex flex-wrap gap-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <Button
                key={tab.id}
                variant={activeTab === tab.id ? "default" : "outline"}
                onClick={() => setActiveTab(tab.id)}
                className="flex items-center gap-2"
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </Button>
            );
          })}
        </div>

        {/* Tab Content */}
        <div>
          {activeTab === 'overview' && renderOverviewTab()}
          {activeTab === 'artisans' && renderArtisansTab()}
          {activeTab === 'urgent' && renderUrgentCasesTab()}
          {activeTab === 'stages' && (
            <div className="text-center py-12 text-gray-500">
              <Target className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p>Stage Management Dashboard Coming Soon</p>
            </div>
          )}
          {activeTab === 'analytics' && (
            <div className="text-center py-12 text-gray-500">
              <TrendingUp className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p>Advanced Analytics Dashboard Coming Soon</p>
            </div>
          )}
          {activeTab === 'settings' && (
            <div className="text-center py-12 text-gray-500">
              <Settings className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p>System Configuration Panel Coming Soon</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function PreservationDashboard() {
  return (
    <AdminAuthWrapper fallbackMessage="Administrative access required for Cultural Preservation Dashboard">
      <PreservationDashboardContent />
    </AdminAuthWrapper>
  );
} 