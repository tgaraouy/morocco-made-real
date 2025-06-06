'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
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
  Upload,
  Mic,
  Video,
  Image,
  FileText,
  Award,
  Star,
  TrendingUp
} from 'lucide-react';

// ============================================================================
// TYPES
// ============================================================================

interface PreservationStage {
  id: string;
  name: string;
  icon: React.ComponentType<any>;
  status: 'pending' | 'in-progress' | 'completed' | 'needs-review';
  progress: number;
  description: string;
  data?: any;
}

interface ArtisanProfile {
  id: string;
  name: string;
  craft: string;
  region: string;
  validationLevel: 0 | 1 | 2 | 3;
  preservationStatus: string;
  culturalDnaHash?: string;
  blockchainCertificate?: string;
}

// ============================================================================
// CULTURAL PRESERVATION ENGINE COMPONENT
// ============================================================================

export default function CulturalPreservationEngine({ artisanId }: { artisanId: string }) {
  const [currentStage, setCurrentStage] = useState('intake');
  const [profile, setProfile] = useState<ArtisanProfile | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);

  const stages: PreservationStage[] = [
    {
      id: 'intake',
      name: 'Field Liaison Intake',
      icon: Users,
      status: 'completed',
      progress: 100,
      description: 'Human-guided interview and documentation collection',
      data: {
        voiceRecording: true,
        videoDocumentation: true,
        imagePortfolio: true,
        culturalContext: true
      }
    },
    {
      id: 'consent',
      name: 'Consent & Security',
      icon: Shield,
      status: 'completed',
      progress: 100,
      description: 'Legal frameworks and artisan protection protocols',
      data: {
        signedRelease: true,
        informedConsent: true,
        revocationRights: true,
        gdprCompliance: true
      }
    },
    {
      id: 'ai-documentation',
      name: 'AI Co-Documentation',
      icon: Brain,
      status: 'in-progress',
      progress: 75,
      description: 'AI-assisted transcription and profile generation',
      data: {
        transcription: 'completed',
        translation: 'completed',
        profileGeneration: 'in-progress',
        humanReview: 'pending'
      }
    },
    {
      id: 'cultural-dna',
      name: 'Cultural DNA Framework',
      icon: Database,
      status: 'pending',
      progress: 0,
      description: 'Cultural categorization and validation',
      data: null
    },
    {
      id: 'blockchain',
      name: 'Blockchain Anchoring',
      icon: Link,
      status: 'pending',
      progress: 0,
      description: 'Immutable cultural record creation',
      data: null
    },
    {
      id: 'experience',
      name: 'Tourist Experience Engine',
      icon: Globe,
      status: 'pending',
      progress: 0,
      description: 'Smart matching and community impact activation',
      data: null
    }
  ];

  useEffect(() => {
    // Simulate loading artisan profile
    setProfile({
      id: artisanId,
      name: 'Hassan Al-Drawi',
      craft: 'Traditional Blue Pottery',
      region: 'Draa Valley',
      validationLevel: 1,
      preservationStatus: 'AI Documentation In Progress'
    });
  }, [artisanId]);

  const handleStageAction = async (stageId: string, action: string) => {
    setIsProcessing(true);
    
    try {
      switch (stageId) {
        case 'ai-documentation':
          await processAIDocumentation(action);
          break;
        case 'cultural-dna':
          await processCulturalDNA(action);
          break;
        case 'blockchain':
          await processBlockchainAnchoring(action);
          break;
        case 'experience':
          await activateExperienceEngine(action);
          break;
      }
    } catch (error) {
      console.error(`Stage ${stageId} action failed:`, error);
    } finally {
      setIsProcessing(false);
    }
  };

  const processAIDocumentation = async (action: string) => {
    // Simulate AI processing pipeline
    const steps = [
      'Transcribing voice recording...',
      'Translating to multiple languages...',
      'Generating cultural profile...',
      'Extracting cultural context...',
      'Requesting human approval...'
    ];

    for (let i = 0; i < steps.length; i++) {
      setProgress((i + 1) / steps.length * 100);
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  };

  const processCulturalDNA = async (action: string) => {
    // Simulate Cultural DNA extraction and classification
    const steps = [
      'Analyzing cultural context...',
      'Classifying craft category...',
      'Determining endangerment level...',
      'Generating cultural DNA hash...',
      'Awaiting expert validation...'
    ];

    for (let i = 0; i < steps.length; i++) {
      setProgress((i + 1) / steps.length * 100);
      await new Promise(resolve => setTimeout(resolve, 800));
    }
  };

  const processBlockchainAnchoring = async (action: string) => {
    // Simulate blockchain certificate minting
    const steps = [
      'Generating secure hashes...',
      'Preparing smart contract transaction...',
      'Minting cultural certificate...',
      'Confirming blockchain transaction...',
      'Certificate anchored successfully!'
    ];

    for (let i = 0; i < steps.length; i++) {
      setProgress((i + 1) / steps.length * 100);
      await new Promise(resolve => setTimeout(resolve, 1500));
    }
  };

  const activateExperienceEngine = async (action: string) => {
    // Simulate experience engine activation
    const steps = [
      'Creating cultural matching profile...',
      'Setting up smart recommendations...',
      'Configuring community impact tracking...',
      'Activating tourist matching system...',
      'Preservation engine fully operational!'
    ];

    for (let i = 0; i < steps.length; i++) {
      setProgress((i + 1) / steps.length * 100);
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  };

  const renderStageCard = (stage: PreservationStage) => {
    const Icon = stage.icon;
    const isActive = currentStage === stage.id;
    
    return (
      <Card 
        key={stage.id} 
        className={`cursor-pointer transition-all ${
          isActive ? 'ring-2 ring-blue-500 shadow-lg' : 'hover:shadow-md'
        }`}
        onClick={() => setCurrentStage(stage.id)}
      >
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-3 text-lg">
            <Icon className={`w-6 h-6 ${
              stage.status === 'completed' ? 'text-green-600' :
              stage.status === 'in-progress' ? 'text-blue-600' :
              stage.status === 'needs-review' ? 'text-orange-600' :
              'text-gray-400'
            }`} />
            <span>{stage.name}</span>
            <Badge variant={
              stage.status === 'completed' ? 'default' :
              stage.status === 'in-progress' ? 'secondary' :
              stage.status === 'needs-review' ? 'destructive' :
              'outline'
            }>
              {stage.status === 'completed' ? 'Complete' :
               stage.status === 'in-progress' ? 'Active' :
               stage.status === 'needs-review' ? 'Review' :
               'Pending'}
            </Badge>
          </CardTitle>
          <p className="text-sm text-gray-600">{stage.description}</p>
        </CardHeader>
        <CardContent>
          <Progress value={stage.progress} className="mb-3" />
          <div className="text-xs text-gray-500">{stage.progress}% Complete</div>
        </CardContent>
      </Card>
    );
  };

  const renderActiveStageContent = () => {
    const activeStage = stages.find(s => s.id === currentStage);
    if (!activeStage) return null;

    const Icon = activeStage.icon;

    return (
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <Icon className="w-6 h-6 text-blue-600" />
            {activeStage.name}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {currentStage === 'intake' && renderIntakeContent()}
          {currentStage === 'consent' && renderConsentContent()}
          {currentStage === 'ai-documentation' && renderAIDocumentationContent()}
          {currentStage === 'cultural-dna' && renderCulturalDNAContent()}
          {currentStage === 'blockchain' && renderBlockchainContent()}
          {currentStage === 'experience' && renderExperienceContent()}
        </CardContent>
      </Card>
    );
  };

  const renderIntakeContent = () => (
    <div className="grid md:grid-cols-2 gap-4">
      <div className="space-y-4">
        <Alert>
          <CheckCircle className="w-4 h-4" />
          <AlertDescription>
            Field liaison interview completed successfully
          </AlertDescription>
        </Alert>
        <div className="grid grid-cols-2 gap-2">
          <div className="flex items-center gap-2 text-sm">
            <Mic className="w-4 h-4 text-green-600" />
            <span>Voice Recording ✓</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Video className="w-4 h-4 text-green-600" />
            <span>Video Documentation ✓</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Image className="w-4 h-4 text-green-600" />
            <span>Image Portfolio ✓</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <FileText className="w-4 h-4 text-green-600" />
            <span>Cultural Context ✓</span>
          </div>
        </div>
      </div>
      <div className="bg-blue-50 p-4 rounded-lg">
        <h4 className="font-semibold mb-2">Interview Summary</h4>
        <p className="text-sm text-gray-700">
          Hassan shared his family's 500-year pottery tradition from the Draa Valley. 
          Detailed documentation of blue glazing techniques and cultural significance 
          has been collected by our field liaison team.
        </p>
      </div>
    </div>
  );

  const renderConsentContent = () => (
    <div className="space-y-4">
      <Alert>
        <Shield className="w-4 h-4" />
        <AlertDescription>
          All security frameworks and consent protocols have been applied
        </AlertDescription>
      </Alert>
      <div className="grid md:grid-cols-3 gap-4">
        <div className="bg-green-50 p-3 rounded">
          <div className="flex items-center gap-2 mb-1">
            <CheckCircle className="w-4 h-4 text-green-600" />
            <span className="font-medium text-sm">Signed Release</span>
          </div>
          <p className="text-xs text-gray-600">Image/voice usage rights secured</p>
        </div>
        <div className="bg-green-50 p-3 rounded">
          <div className="flex items-center gap-2 mb-1">
            <CheckCircle className="w-4 h-4 text-green-600" />
            <span className="font-medium text-sm">Informed Consent</span>
          </div>
          <p className="text-xs text-gray-600">NFT and data usage explained</p>
        </div>
        <div className="bg-green-50 p-3 rounded">
          <div className="flex items-center gap-2 mb-1">
            <CheckCircle className="w-4 h-4 text-green-600" />
            <span className="font-medium text-sm">Revocation Rights</span>
          </div>
          <p className="text-xs text-gray-600">Opt-out mechanism enabled</p>
        </div>
      </div>
    </div>
  );

  const renderAIDocumentationContent = () => (
    <div className="space-y-4">
      {isProcessing && (
        <Alert>
          <Clock className="w-4 h-4" />
          <AlertDescription>
            AI processing in progress... {Math.round(progress)}% complete
          </AlertDescription>
        </Alert>
      )}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-3">
          <h4 className="font-semibold">Processing Pipeline</h4>
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-600" />
              <span>Darija → Arabic/French/English transcription</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-600" />
              <span>Cultural context analysis</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-blue-600" />
              <span>Profile generation in progress</span>
            </div>
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-orange-600" />
              <span>Human approval pending</span>
            </div>
          </div>
        </div>
        <div className="space-y-3">
          <h4 className="font-semibold">Generated Content Preview</h4>
          <div className="bg-gray-50 p-3 rounded text-sm">
            <p className="font-medium mb-1">Cultural Bio (AI-generated):</p>
            <p className="text-gray-700">
              "Hassan continues a five-century family tradition of blue pottery in Morocco's 
              Draa Valley, where his ancestors first developed the distinctive cobalt glazing 
              techniques that make their work uniquely recognizable..."
            </p>
            <Badge className="mt-2 text-xs">AI-assisted, human-approved</Badge>
          </div>
        </div>
      </div>
      <Button 
        onClick={() => handleStageAction('ai-documentation', 'complete')}
        disabled={isProcessing}
        className="w-full"
      >
        {isProcessing ? 'Processing...' : 'Complete AI Documentation'}
      </Button>
    </div>
  );

  const renderCulturalDNAContent = () => (
    <div className="space-y-4">
      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-3">
          <h4 className="font-semibold">Cultural Classification</h4>
          <div className="space-y-2 text-sm">
            <div><strong>Region:</strong> South (Draa Valley)</div>
            <div><strong>Craft Category:</strong> Pottery</div>
            <div><strong>Technique:</strong> Traditional wheel throwing, blue glazing</div>
            <div><strong>Heritage Level:</strong> Master craftsman (500+ year lineage)</div>
            <div><strong>Endangerment:</strong> Vulnerable (declining practitioners)</div>
          </div>
        </div>
        <div className="space-y-3">
          <h4 className="font-semibold">Validation Levels</h4>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-white text-xs font-bold">1</div>
              <span className="text-sm">Human Verified ✓</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center text-gray-600 text-xs font-bold">2</div>
              <span className="text-sm">AI Pattern Validation (Pending)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center text-gray-600 text-xs font-bold">3</div>
              <span className="text-sm">Blockchain Anchored (Pending)</span>
            </div>
          </div>
        </div>
      </div>
      <Button 
        onClick={() => handleStageAction('cultural-dna', 'process')}
        disabled={isProcessing}
        className="w-full"
      >
        {isProcessing ? 'Processing Cultural DNA...' : 'Generate Cultural DNA Profile'}
      </Button>
    </div>
  );

  const renderBlockchainContent = () => (
    <div className="space-y-4">
      <Alert>
        <Shield className="w-4 h-4" />
        <AlertDescription>
          Security Framework: Only hashes sent to blockchain for maximum privacy
        </AlertDescription>
      </Alert>
      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-3">
          <h4 className="font-semibold">Blockchain Components</h4>
          <div className="space-y-2 text-sm">
            <div>• Artisan Identity (Minimal KYC)</div>
            <div>• Certificate of Craft Authenticity</div>
            <div>• Cultural Profile Hash (IPFS+Metadata)</div>
            <div>• Stamp Log: Experience-Based Proofs</div>
          </div>
        </div>
        <div className="space-y-3">
          <h4 className="font-semibold">Smart Contract Ethics</h4>
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-600" />
              <span>Opt-out switch enabled</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-600" />
              <span>Royalty options configured</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-600" />
              <span>Family inheritance rights</span>
            </div>
          </div>
        </div>
      </div>
      <div className="bg-gray-100 p-3 rounded">
        <h5 className="font-medium mb-1">Generated Hash Preview:</h5>
        <code className="text-xs break-all">
          0x7f9c4a2b8e5d3f1a6c9b2e8d5f3a1c6b9e2d5f8a3c6b9e2d5f1a7c4b8e5d3f2a
        </code>
      </div>
      <Button 
        onClick={() => handleStageAction('blockchain', 'anchor')}
        disabled={isProcessing}
        className="w-full"
      >
        {isProcessing ? 'Anchoring to Polygon...' : 'Anchor to Blockchain'}
      </Button>
    </div>
  );

  const renderExperienceContent = () => (
    <div className="space-y-4">
      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-3">
          <h4 className="font-semibold">Smart Matching System</h4>
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-600" />
              <span>Cultural DNA compatibility analysis</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-600" />
              <span>Dynamic experience levels</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-600" />
              <span>Blockchain travel pass integration</span>
            </div>
          </div>
        </div>
        <div className="space-y-3">
          <h4 className="font-semibold">Community Impact</h4>
          <div className="space-y-2 text-sm">
            <div>• Artisan tip distribution system</div>
            <div>• Community reinvestment loop</div>
            <div>• Cultural preservation funding</div>
            <div>• Heritage documentation incentives</div>
          </div>
        </div>
      </div>
      <Alert>
        <TrendingUp className="w-4 h-4" />
        <AlertDescription>
          Ready for tourist matching! Your authentic cultural profile will connect with 
          compatible travelers who appreciate traditional craftsmanship.
        </AlertDescription>
      </Alert>
      <Button 
        onClick={() => handleStageAction('experience', 'activate')}
        disabled={isProcessing}
        className="w-full bg-gradient-to-r from-teal-600 to-blue-600"
      >
        {isProcessing ? 'Activating Experience Engine...' : 'Activate Tourist Matching'}
      </Button>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-gray-900">
          🏛️ Cultural Preservation Engine
        </h1>
        <p className="text-xl text-gray-600">
          Comprehensive Artisan Documentation & Heritage Protection System
        </p>
        {profile && (
          <div className="flex justify-center gap-4 flex-wrap">
            <Badge variant="secondary" className="text-lg px-4 py-2">
              <Award className="w-4 h-4 mr-2" />
              {profile.name}
            </Badge>
            <Badge variant="outline" className="text-lg px-4 py-2">
              <Star className="w-4 h-4 mr-2" />
              {profile.craft}
            </Badge>
            <Badge variant="outline" className="text-lg px-4 py-2">
              Validation Level {profile.validationLevel}
            </Badge>
          </div>
        )}
      </div>

      {/* Stage Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {stages.map(stage => renderStageCard(stage))}
      </div>

      {/* Active Stage Content */}
      {renderActiveStageContent()}

      {/* Processing Progress */}
      {isProcessing && (
        <Card>
          <CardContent className="p-6">
            <div className="text-center space-y-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <Progress value={progress} className="w-full" />
              <p className="text-sm text-gray-600">Processing stage: {progress.toFixed(0)}% complete</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
} 