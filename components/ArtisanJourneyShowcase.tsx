'use client';

import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { useTranslations } from 'next-intl';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  Play, 
  Award, 
  Users, 
  Camera, 
  ShoppingCart, 
  Building2,
  Star,
  CheckCircle,
  Clock,
  Globe
} from 'lucide-react';

interface ArtisanJourneyData {
  artisan: any;
  piece: any;
  journey: any;
  practice: any;
}

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function ArtisanJourneyShowcase() {
  const t = useTranslations('artisan_journey');
  const [data, setData] = useState<ArtisanJourneyData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    loadJourneyData();
  }, []);

  const loadJourneyData = async () => {
    try {
      // Load Hassan Benali's pottery journey
      const { data: artisan } = await supabase
        .from('artisans')
        .select('*')
        .eq('name', 'Hassan Benali')
        .single();

      const { data: piece } = await supabase
        .from('artisan_pieces')
        .select('*')
        .eq('slug', 'traditional-fez-blue-pottery-vase-hassan-benali')
        .single();

      const { data: journey } = await supabase
        .from('artisan_journey_documentation')
        .select('*')
        .eq('piece_id', piece.id)
        .single();

      const { data: practice } = await supabase
        .from('traditional_practices_database')
        .select('*')
        .eq('technique_name', 'Fez Blue Pottery')
        .single();

      setData({ artisan, piece, journey, practice });
    } catch (error) {
      console.error('Error loading journey data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="text-center p-8">
        <p className="text-gray-500">Unable to load journey data</p>
      </div>
    );
  }

  const { artisan, piece, journey, practice } = data;

  // Calculate demo metrics
  const aiValidationScore = 91;
  const expertScore = 92;
  const finalScore = Math.round((aiValidationScore * 0.4) + (expertScore * 0.6));
  const certificationLevel = finalScore >= 90 ? t('gold_certification') : finalScore >= 80 ? 'Silver' : 'Bronze';

  const tabs = [
    { id: 'overview', label: t('tabs.overview'), icon: Globe },
    { id: 'journey', label: t('tabs.journey'), icon: Camera },
    { id: 'validation', label: t('tabs.validation'), icon: CheckCircle },
    { id: 'marketplace', label: t('tabs.marketplace'), icon: ShoppingCart },
    { id: 'museum', label: t('tabs.museum'), icon: Building2 }
  ];

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-gray-900">
          🎨 {t('title')}
        </h1>
        <p className="text-xl text-gray-600">
          {t('subtitle')}
        </p>
      </div>

      {/* Hero Card */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-200">
        <CardContent className="p-8">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-4">{t('piece_title')}</h2>
              <p className="text-lg text-gray-700 mb-4">{t('piece_description')}</p>
              
              <div className="flex items-center gap-4 mb-4">
                <Badge variant="secondary" className="text-lg px-4 py-2">
                  <Award className="w-4 h-4 mr-2" />
                  {certificationLevel}
                </Badge>
                <Badge variant="outline" className="text-lg px-4 py-2">
                  <Star className="w-4 h-4 mr-2" />
                  {finalScore}% {t('authenticity')}
                </Badge>
              </div>

              <div className="space-y-2">
                <p><strong>{t('artisan')}:</strong> {artisan.name} ({artisan.verification_level} level)</p>
                <p><strong>{t('technique')}:</strong> {practice.technique_name}</p>
                <p><strong>{t('origin')}:</strong> {practice.origin_period}</p>
                <p><strong>{t('cultural_significance')}:</strong> {practice.cultural_significance}</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="font-semibold mb-4">{t('journey_progress')}</h3>
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span>{t('documentation')}</span>
                      <span>100%</span>
                    </div>
                    <Progress value={100} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span>{t('ai_validation')}</span>
                      <span>{aiValidationScore}%</span>
                    </div>
                    <Progress value={aiValidationScore} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span>{t('expert_review')}</span>
                      <span>{expertScore}%</span>
                    </div>
                    <Progress value={expertScore} className="h-2" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Navigation Tabs */}
      <div className="flex flex-wrap gap-2 justify-center">
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
      <div className="grid gap-6">
        {activeTab === 'overview' && (
          <div className="grid md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  {t('content_team')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {Object.entries(journey.content_team.roles).map(([role, person]) => (
                    <div key={role} className="flex justify-between">
                      <span className="capitalize">{role.replace(/([A-Z])/g, ' $1')}</span>
                      <span className="font-medium">
                        {Array.isArray(person) ? (person as string[]).join(', ') : String(person)}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  {t('timeline')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>{t('stages.pre_production')} (2h)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>{t('stages.clay_preparation')} (4h)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>{t('stages.wheel_throwing')} (3h)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>{t('stages.glazing')} (2h)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>{t('stages.firing')} (8h)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>{t('stages.post_production')} (6h)</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="w-5 h-5" />
                  {t('achievements')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Badge variant="secondary" className="w-full justify-center py-2">
                    🏆 {certificationLevel}
                  </Badge>
                  <Badge variant="outline" className="w-full justify-center py-2">
                    🤖 {aiValidationScore}% {t('ai_validation_title')}
                  </Badge>
                  <Badge variant="outline" className="w-full justify-center py-2">
                    👨‍🎓 3/3 {t('expert_approval')}
                  </Badge>
                  <Badge variant="outline" className="w-full justify-center py-2">
                    ⛓️ {t('blockchain_ready')}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === 'journey' && (
          <Card>
            <CardHeader>
              <CardTitle>📹 {t('journey_documentation')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-4">{t('content_creation_stages')}</h3>
                  <div className="space-y-4">
                    {[
                      { stage: t('stages.pre_production'), desc: 'Equipment setup and artisan consultation', time: '2 hours' },
                      { stage: t('stages.clay_preparation'), desc: 'Documenting traditional clay aging process', time: '4 hours' },
                      { stage: t('stages.wheel_throwing'), desc: 'Capturing pottery wheel techniques', time: '3 hours' },
                      { stage: t('stages.glazing'), desc: 'Recording traditional Fez blue glazing', time: '2 hours' },
                      { stage: t('stages.firing'), desc: 'Kiln firing process documentation', time: '8 hours' },
                      { stage: t('stages.post_production'), desc: 'Video editing and narrative creation', time: '6 hours' }
                    ].map((item, index) => (
                      <div key={index} className="border-l-4 border-blue-500 pl-4">
                        <h4 className="font-medium">{item.stage}</h4>
                        <p className="text-sm text-gray-600">{item.desc}</p>
                        <span className="text-xs text-blue-600">{item.time}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold mb-4">{t('multimedia_assets')}</h3>
                  <div className="space-y-3">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-medium">📸 Photography</h4>
                      <p className="text-sm text-gray-600">High-resolution process documentation</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-medium">🎥 Videography</h4>
                      <p className="text-sm text-gray-600">Time-lapse and detailed technique capture</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-medium">🎙️ Audio</h4>
                      <p className="text-sm text-gray-600">Artisan interviews and cultural narration</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-medium">📝 Documentation</h4>
                      <p className="text-sm text-gray-600">Technical specifications and cultural context</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {activeTab === 'validation' && (
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>🤖 {t('ai_validation_results')}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-2">
                      <span>🖼️ Image Analysis</span>
                      <span className="font-bold">92%</span>
                    </div>
                    <Progress value={92} className="h-2" />
                    <p className="text-xs text-gray-600 mt-1">Technique recognition and material identification</p>
                  </div>
                  <div>
                    <div className="flex justify-between mb-2">
                      <span>🎥 Video Analysis</span>
                      <span className="font-bold">94%</span>
                    </div>
                    <Progress value={94} className="h-2" />
                    <p className="text-xs text-gray-600 mt-1">Motion patterns and sequence accuracy</p>
                  </div>
                  <div>
                    <div className="flex justify-between mb-2">
                      <span>🔊 Audio Analysis</span>
                      <span className="font-bold">87%</span>
                    </div>
                    <Progress value={87} className="h-2" />
                    <p className="text-xs text-gray-600 mt-1">Cultural terminology and language authenticity</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>👨‍🎓 {t('expert_reviews')}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { name: 'Dr. Amina Tazi', role: 'Cultural Historian', score: 95, status: 'approved' },
                    { name: 'Master Craftsman Omar', role: 'Pottery Expert', score: 92, status: 'approved' },
                    { name: 'Prof. Youssef Alami', role: 'Traditional Arts', score: 89, status: 'approved_with_conditions' }
                  ].map((expert, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h4 className="font-medium">{expert.name}</h4>
                          <p className="text-sm text-gray-600">{expert.role}</p>
                        </div>
                        <Badge variant={expert.status === 'approved' ? 'default' : 'secondary'}>
                          {expert.score}%
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <span className="text-sm capitalize">{expert.status.replace('_', ' ')}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === 'marketplace' && (
          <Card>
            <CardHeader>
              <CardTitle>🛒 {t('virtual_store_features')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-4">{t('premium_listing_features')}</h3>
                  <div className="space-y-3">
                    {[
                      t('features.hero_video'),
                      t('features.360_viewer'),
                      t('features.artisan_booking'),
                      t('features.cultural_storytelling'),
                      t('features.blockchain_display'),
                      t('features.community_reviews')
                    ].map((feature, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold mb-4">{t('pricing_value')}</h3>
                  <div className="bg-gradient-to-r from-green-50 to-blue-50 p-6 rounded-lg">
                    <div className="text-center">
                      <p className="text-3xl font-bold text-green-600">{piece.pricing.base_price} MAD</p>
                      <p className="text-sm text-gray-600">{t('base_price')}</p>
                      <div className="mt-4 space-y-2">
                        <Badge variant="secondary">{t('premium_documentation')}</Badge>
                        <Badge variant="outline">{t('global_shipping')}</Badge>
                        <Badge variant="outline">{t('certificate_included')}</Badge>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {activeTab === 'museum' && (
          <Card>
            <CardHeader>
              <CardTitle>🏛️ {t('digital_museum_integration')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-4">{t('museum_features')}</h3>
                  <div className="space-y-3">
                    {[
                      t('features.public_exhibition'),
                      t('features.educational_content'),
                      t('features.cultural_connections'),
                      t('features.discussion_forum'),
                      t('features.virtual_tour'),
                      t('features.preservation_docs')
                    ].map((feature, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <Building2 className="w-4 h-4 text-blue-500" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold mb-4">{t('cultural_impact')}</h3>
                  <div className="space-y-4">
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <h4 className="font-medium">🌍 {t('global_reach')}</h4>
                      <p className="text-sm text-gray-600">Accessible to worldwide audiences</p>
                    </div>
                    <div className="bg-green-50 p-4 rounded-lg">
                      <h4 className="font-medium">🎓 {t('educational_value')}</h4>
                      <p className="text-sm text-gray-600">Interactive learning experiences</p>
                    </div>
                    <div className="bg-purple-50 p-4 rounded-lg">
                      <h4 className="font-medium">🔗 {t('cultural_preservation')}</h4>
                      <p className="text-sm text-gray-600">Immutable heritage documentation</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Call to Action */}
      <Card className="bg-gradient-to-r from-purple-50 to-blue-50 border-2 border-purple-200">
        <CardContent className="p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">🚀 {t('ready_for_production')}</h2>
          <p className="text-lg text-gray-700 mb-6">
            {t('production_description')}
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button size="lg" className="flex items-center gap-2">
              <Play className="w-4 h-4" />
              {t('start_journey')}
            </Button>
            <Button variant="outline" size="lg" className="flex items-center gap-2">
              <ShoppingCart className="w-4 h-4" />
              {t('visit_store')}
            </Button>
            <Button variant="outline" size="lg" className="flex items-center gap-2">
              <Building2 className="w-4 h-4" />
              {t('explore_museum')}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 