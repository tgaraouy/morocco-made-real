'use client';

import React, { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { useRouter } from 'next/navigation';
import AdminAuthWrapper from '@/components/AdminAuthWrapper';
import { 
  Camera, 
  Upload, 
  Shield, 
  Users, 
  Brain,
  FileText,
  Link,
  CheckCircle,
  AlertCircle,
  Clock,
  Award,
  Mic,
  Image,
  Video,
  Languages,
  Database,
  Lock,
  UserCheck,
  Globe,
  ArrowLeft,
  Home
} from 'lucide-react';

function CulturalPreservationPortalContent() {
  const router = useRouter();
  const t = useTranslations('cultural_preservation_portal');
  const tCommon = useTranslations('common');
  const [activeStage, setActiveStage] = useState('intake');
  
  // Mock authentication state (for admin demo)
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [userRole, setUserRole] = useState('admin'); // 'admin' | 'artisan'

  const [preservationData, setPreservationData] = useState({
    consent: { signed: false, informed: false, revocable: true },
    interview: { voice: null, video: null, images: [] },
    culturalDna: { 
      region: '', 
      craft: '', 
      endangerment: '', 
      validation: 0 
    },
    aiProcessing: { transcription: '', profile: '', status: 'pending' },
    blockchain: { hash: '', certificate: '', status: 'pending' }
  });

  // Authentication simulation
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-moroccan-sand via-white to-moroccan-sand/30 flex items-center justify-center">
        <Card className="max-w-md w-full mx-4">
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center gap-2">
              <Shield className="w-8 h-8 text-blue-600" />
              {t('navigation.portal_badge')}
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-gray-600">{t('security.admin_access_required')}</p>
            <Button 
              onClick={() => setIsAuthenticated(true)}
              className="w-full"
            >
              <Shield className="w-4 h-4 mr-2" />
              {t('security.admin_login')}
            </Button>
            <Button 
              variant="outline" 
              onClick={() => router.push('/en/artisan')}
              className="w-full"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              {t('security.back_to_artisan')}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const preservationStages = [
    { 
      id: 'intake', 
      name: `🤝 ${t('stages.intake.name')}`, 
      status: 'active',
      description: t('stages.intake.description')
    },
    { 
      id: 'consent', 
      name: `⛑️ ${t('stages.consent.name')}`, 
      status: 'pending',
      description: t('stages.consent.description')
    },
    { 
      id: 'documentation', 
      name: `🤖 ${t('stages.documentation.name')}`, 
      status: 'pending',
      description: t('stages.documentation.description')
    },
    { 
      id: 'cultural-dna', 
      name: `📦 ${t('stages.cultural_dna.name')}`, 
      status: 'pending',
      description: t('stages.cultural_dna.description')
    },
    { 
      id: 'blockchain', 
      name: `🔗 ${t('stages.blockchain.name')}`, 
      status: 'pending',
      description: t('stages.blockchain.description')
    },
    { 
      id: 'experience', 
      name: `🎟️ ${t('stages.experience.name')}`, 
      status: 'pending',
      description: t('stages.experience.description')
    }
  ];

  const getStageIcon = (stageId: string) => {
    const icons = {
      intake: Users,
      consent: Shield,
      documentation: Brain,
      'cultural-dna': Database,
      blockchain: Link,
      experience: Globe
    };
    return icons[stageId] || Clock;
  };

  const renderIntakeStage = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-6 h-6 text-blue-600" />
            {t('intake.title')}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <Card className="border-2 border-dashed border-gray-300 p-6">
              <div className="text-center space-y-2">
                <Mic className="w-12 h-12 mx-auto text-green-600" />
                <h3 className="font-semibold">{t('intake.voice_interview.title')}</h3>
                <p className="text-sm text-gray-600">{t('intake.voice_interview.description')}</p>
                <Button className="w-full">
                  <Upload className="w-4 h-4 mr-2" />
                  {t('intake.voice_interview.button')}
                </Button>
              </div>
            </Card>
            
            <Card className="border-2 border-dashed border-gray-300 p-6">
              <div className="text-center space-y-2">
                <Video className="w-12 h-12 mx-auto text-purple-600" />
                <h3 className="font-semibold">{t('intake.video_documentation.title')}</h3>
                <p className="text-sm text-gray-600">{t('intake.video_documentation.description')}</p>
                <Button className="w-full">
                  <Upload className="w-4 h-4 mr-2" />
                  {t('intake.video_documentation.button')}
                </Button>
              </div>
            </Card>
            
            <Card className="border-2 border-dashed border-gray-300 p-6">
              <div className="text-center space-y-2">
                <Image className="w-12 h-12 mx-auto text-orange-600" />
                <h3 className="font-semibold">{t('intake.visual_portfolio.title')}</h3>
                <p className="text-sm text-gray-600">{t('intake.visual_portfolio.description')}</p>
                <Button className="w-full">
                  <Upload className="w-4 h-4 mr-2" />
                  {t('intake.visual_portfolio.button')}
                </Button>
              </div>
            </Card>
            
            <Card className="border-2 border-dashed border-gray-300 p-6">
              <div className="text-center space-y-2">
                <Languages className="w-12 h-12 mx-auto text-blue-600" />
                <h3 className="font-semibold">{t('intake.cultural_context.title')}</h3>
                <p className="text-sm text-gray-600">{t('intake.cultural_context.description')}</p>
                <Button className="w-full">
                  <FileText className="w-4 h-4 mr-2" />
                  {t('intake.cultural_context.button')}
                </Button>
              </div>
            </Card>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderConsentStage = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-6 h-6 text-red-600" />
            Consent Collection & Artisan Protection
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="font-semibold text-blue-800 mb-2">🛡️ Smart Contract Ethics</h3>
            <ul className="text-sm space-y-1 text-blue-700">
              <li>• Opt-out switch for artisans</li>
              <li>• Royalty options for artisan families</li>
              <li>• Community benefit sharing</li>
            </ul>
          </div>
          
          <div className="grid md:grid-cols-3 gap-4">
            <Card className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <span className="font-semibold">Signed Release</span>
              </div>
              <p className="text-sm text-gray-600">Image and voice usage rights</p>
              <Button className="w-full mt-3" variant="outline">
                Sign Digitally
              </Button>
            </Card>
            
            <Card className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="w-5 h-5 text-blue-600" />
                <span className="font-semibold">Informed Consent</span>
              </div>
              <p className="text-sm text-gray-600">NFTs and data usage explanation</p>
              <Button className="w-full mt-3" variant="outline">
                Review & Agree
              </Button>
            </Card>
            
            <Card className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <Lock className="w-5 h-5 text-orange-600" />
                <span className="font-semibold">Revocation Clause</span>
              </div>
              <p className="text-sm text-gray-600">Option to withdraw consent</p>
              <Button className="w-full mt-3" variant="outline">
                Set Preferences
              </Button>
            </Card>
          </div>
          
          <div className="bg-green-50 p-4 rounded-lg">
            <h3 className="font-semibold text-green-800 mb-2">🔐 Privacy Controls (GDPR-compliant)</h3>
            <ul className="text-sm space-y-1 text-green-700">
              <li>• Anonymized tourist data collection</li>
              <li>• WhatsApp consent prompts</li>
              <li>• Right to data deletion</li>
              <li>• Transparent data usage policies</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderAIDocumentationStage = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="w-6 h-6 text-purple-600" />
            AI Co-Documentation System
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <Card className="p-4 border-l-4 border-purple-500">
                <h3 className="font-semibold mb-2">🎯 AI Processing Pipeline</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span>Transcribe (Darija → Arabic/French/English)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-yellow-600" />
                    <span>Summarize voice → artisan profile</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-yellow-600" />
                    <span>Generate cultural bio</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-yellow-600" />
                    <span>Create craft descriptions</span>
                  </div>
                </div>
              </Card>
              
              <Card className="p-4 border-l-4 border-blue-500">
                <h3 className="font-semibold mb-2">⚖️ AI Use Policy</h3>
                <Badge variant="outline" className="mb-2">
                  "AI-assisted, human-approved"
                </Badge>
                <p className="text-sm text-gray-600">
                  All AI-generated content reviewed by cultural experts
                </p>
              </Card>
            </div>
            
            <div className="space-y-4">
              <Card className="p-4">
                <h3 className="font-semibold mb-3">Generated Content Preview</h3>
                <div className="bg-gray-50 p-3 rounded text-sm">
                  <p className="font-medium">Cultural Bio (Auto-generated):</p>
                  <p className="mt-1 text-gray-700">
                    "Hassan is a master potter from the Draa Valley, continuing a 
                    500-year family tradition of blue pottery making..."
                  </p>
                </div>
                <Button className="w-full mt-3" variant="outline">
                  Review & Edit
                </Button>
              </Card>
              
              <Card className="p-4">
                <h3 className="font-semibold mb-3">Suggested Tags</h3>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary">#DraaValley</Badge>
                  <Badge variant="secondary">#BluePottery</Badge>
                  <Badge variant="secondary">#TraditionalFiring</Badge>
                  <Badge variant="secondary">#FamilyTradition</Badge>
                </div>
              </Card>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderCulturalDNAStage = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="w-6 h-6 text-green-600" />
            Cultural DNA Framework
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <Card className="p-4">
                <h3 className="font-semibold mb-3">Cultural Classification</h3>
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium">Region</label>
                    <select className="w-full mt-1 p-2 border rounded">
                      <option>Draa Valley (South)</option>
                      <option>Atlas Mountains (Central)</option>
                      <option>Rif Mountains (North)</option>
                      <option>Sahara Desert (South)</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Craft Category</label>
                    <select className="w-full mt-1 p-2 border rounded">
                      <option>Pottery</option>
                      <option>Weaving</option>
                      <option>Metalwork</option>
                      <option>Leather</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Technique Type</label>
                    <input className="w-full mt-1 p-2 border rounded" 
                           placeholder="Traditional wheel throwing, blue glazing" />
                  </div>
                </div>
              </Card>
            </div>
            
            <div className="space-y-4">
              <Card className="p-4">
                <h3 className="font-semibold mb-3">Validation Levels</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-sm font-bold">0</div>
                    <div>
                      <div className="font-medium">Pending</div>
                      <div className="text-sm text-gray-600">Initial submission</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">1</div>
                    <div>
                      <div className="font-medium">Human Verified</div>
                      <div className="text-sm text-gray-600">Expert validation complete</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-purple-500 text-white rounded-full flex items-center justify-center text-sm font-bold">2</div>
                    <div>
                      <div className="font-medium">AI Pattern Validated</div>
                      <div className="text-sm text-gray-600">Machine learning confirmation</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-bold">3</div>
                    <div>
                      <div className="font-medium">Blockchain Anchored</div>
                      <div className="text-sm text-gray-600">Immutable cultural record</div>
                    </div>
                  </div>
                </div>
              </Card>
              
              <Card className="p-4 bg-orange-50">
                <h3 className="font-semibold mb-2 text-orange-800">Endangerment Status</h3>
                <select className="w-full p-2 border rounded">
                  <option>Vulnerable - Declining practitioners</option>
                  <option>Stable - Active community</option>
                  <option>Endangered - Few practitioners</option>
                  <option>Critically Endangered - Urgent preservation</option>
                </select>
              </Card>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderBlockchainStage = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Link className="w-6 h-6 text-indigo-600" />
            Blockchain Anchoring (Polygon)
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="bg-indigo-50 p-4 rounded-lg mb-4">
            <p className="text-indigo-800 text-sm">
              <strong>Security Framework:</strong> Only sending hash to blockchain for maximum privacy and efficiency
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <Card className="p-4 border-l-4 border-indigo-500">
                <h3 className="font-semibold mb-3">Blockchain Components</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <UserCheck className="w-4 h-4 text-green-600" />
                    <span>Artisan Identity (Minimal KYC)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Award className="w-4 h-4 text-blue-600" />
                    <span>Certificate of Craft Authenticity</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Database className="w-4 h-4 text-purple-600" />
                    <span>Cultural Profile Hash (IPFS+Metadata)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-orange-600" />
                    <span>Stamp Log: Experience-Based Proofs</span>
                  </div>
                </div>
              </Card>
              
              <Card className="p-4">
                <h3 className="font-semibold mb-2">Generated Hash</h3>
                <div className="bg-gray-100 p-2 rounded text-xs font-mono break-all">
                  0x7f9c4a2b8e5d3f1a6c9b2e8d5f3a1c6b9e2d5f8a3c6b9e2d5f1a7c4b8e5d3f2a
                </div>
                <Button className="w-full mt-3" variant="outline">
                  <Link className="w-4 h-4 mr-2" />
                  Anchor to Polygon
                </Button>
              </Card>
            </div>
            
            <div className="space-y-4">
              <Card className="p-4">
                <h3 className="font-semibold mb-3">Smart Contract Ethics</h3>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span>Opt-out switch enabled</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span>Royalty system configured</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span>Family inheritance rights</span>
                  </div>
                </div>
              </Card>
              
              <Card className="p-4 bg-green-50">
                <h3 className="font-semibold mb-2 text-green-800">Certificate Status</h3>
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="w-4 h-4 text-yellow-600" />
                  <span className="text-sm">Preparing for blockchain deployment</span>
                </div>
                <Progress value={75} className="mb-2" />
                <p className="text-xs text-green-700">Estimated completion: 2 minutes</p>
              </Card>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderExperienceStage = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="w-6 h-6 text-teal-600" />
            Tourist Experience Engine
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="p-4">
              <h3 className="font-semibold mb-3">Smart Matching System</h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span>Cultural DNA compatibility analysis</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span>Dynamic experience levels (Intro/Advanced)</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span>Blockchain travel pass integration</span>
                </div>
              </div>
            </Card>
            
            <Card className="p-4">
              <h3 className="font-semibold mb-3">Community Impact</h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-blue-600" />
                  <span>Artisan tip distribution system</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-blue-600" />
                  <span>Community reinvestment loop</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-blue-600" />
                  <span>Cultural preservation funding</span>
                </div>
              </div>
            </Card>
          </div>
          
          <Card className="p-4 bg-gradient-to-r from-teal-50 to-blue-50">
            <h3 className="font-semibold mb-3">Ready for Tourist Matching!</h3>
            <p className="text-sm text-gray-700 mb-4">
              Your cultural profile is now complete and ready to be matched with compatible tourists 
              who will appreciate and respect your traditional craft.
            </p>
            <Button className="w-full bg-gradient-to-r from-teal-600 to-blue-600 text-white">
              <Globe className="w-4 h-4 mr-2" />
              Activate Experience Matching
            </Button>
          </Card>
        </CardContent>
      </Card>
    </div>
  );

  const renderStageContent = () => {
    switch (activeStage) {
      case 'intake': return renderIntakeStage();
      case 'consent': return renderConsentStage();
      case 'documentation': return renderAIDocumentationStage();
      case 'cultural-dna': return renderCulturalDNAStage();
      case 'blockchain': return renderBlockchainStage();
      case 'experience': return renderExperienceStage();
      default: return renderIntakeStage();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-moroccan-sand via-white to-moroccan-sand/30">
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {/* Navigation Header */}
        <div className="flex items-center justify-between mb-6">
          <Button 
            variant="outline" 
            onClick={() => router.push('/en/artisan')}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            {t('navigation.back_to_dashboard')}
          </Button>
          <Badge variant="outline" className="text-lg px-4 py-2">
            <Database className="w-4 h-4 mr-2" />
            {t('navigation.portal_badge')}
          </Badge>
        </div>

        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-gray-900">
            🏛️ {t('title')}
          </h1>
          <p className="text-xl text-gray-600">
            {t('subtitle')}
          </p>
          <div className="flex justify-center">
            <Badge variant="secondary" className="text-lg px-4 py-2">
              <Shield className="w-4 h-4 mr-2" />
              {t('security.all_frameworks_applied')}
            </Badge>
          </div>
        </div>

        {/* Progress Overview */}
        <Card>
          <CardHeader>
            <CardTitle>{t('progress.title')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {preservationStages.map((stage, index) => {
                const Icon = getStageIcon(stage.id);
                const isActive = activeStage === stage.id;
                const isCompleted = index < preservationStages.findIndex(s => s.id === activeStage);
                
                return (
                  <button
                    key={stage.id}
                    onClick={() => setActiveStage(stage.id)}
                    className={`p-3 rounded-lg text-center transition-all ${
                      isActive 
                        ? 'bg-blue-100 border-2 border-blue-500' 
                        : isCompleted 
                        ? 'bg-green-100 border-2 border-green-500'
                        : 'bg-gray-50 border-2 border-gray-200 hover:bg-gray-100'
                    }`}
                  >
                    <Icon className={`w-6 h-6 mx-auto mb-2 ${
                      isActive ? 'text-blue-600' : isCompleted ? 'text-green-600' : 'text-gray-400'
                    }`} />
                    <div className="text-xs font-medium">{stage.name}</div>
                    <div className="text-xs text-gray-500 mt-1">{stage.description}</div>
                  </button>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Stage Content */}
        {renderStageContent()}

        {/* Navigation */}
        <div className="flex justify-between">
          <Button 
            variant="outline" 
            onClick={() => {
              const currentIndex = preservationStages.findIndex(s => s.id === activeStage);
              if (currentIndex > 0) {
                setActiveStage(preservationStages[currentIndex - 1].id);
              }
            }}
            disabled={preservationStages.findIndex(s => s.id === activeStage) === 0}
          >
            {t('navigation_buttons.previous_stage')}
          </Button>
          
          <Button 
            onClick={() => {
              const currentIndex = preservationStages.findIndex(s => s.id === activeStage);
              if (currentIndex < preservationStages.length - 1) {
                setActiveStage(preservationStages[currentIndex + 1].id);
              }
            }}
            disabled={preservationStages.findIndex(s => s.id === activeStage) === preservationStages.length - 1}
          >
            {t('navigation_buttons.next_stage')}
          </Button>
        </div>
      </div>
    </div>
  );
}

export default function CulturalPreservationPortal() {
  return (
    <AdminAuthWrapper fallbackMessage="Access to the Cultural Preservation Engine requires admin privileges">
      <CulturalPreservationPortalContent />
    </AdminAuthWrapper>
  );
} 