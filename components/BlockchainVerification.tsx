'use client';

import React, { useState } from 'react';
import { useTranslations } from 'next-intl';
import { BlockchainService, ArtisanProfile, AuthenticityCertificate } from '@/lib/blockchain-service';

interface BlockchainVerificationProps {
  locale: string;
}

export default function BlockchainVerification({ locale }: BlockchainVerificationProps) {
  const t = useTranslations('blockchain');
  const [activeTab, setActiveTab] = useState<'verify' | 'register' | 'certificate'>('verify');
  const [verificationResult, setVerificationResult] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [certificateId, setCertificateId] = useState('');
  const [artisanId, setArtisanId] = useState('');

  const blockchainService = new BlockchainService();

  const handleVerifyCertificate = async () => {
    if (!certificateId.trim()) return;
    
    setIsLoading(true);
    try {
      const result = await blockchainService.verifyCertificate(certificateId);
      setVerificationResult(result);
    } catch (error) {
      console.error('Error verifying certificate:', error);
      setVerificationResult({
        isValid: false,
        blockchainConfirmed: false,
        error: 'Verification failed'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGetArtisanStatus = async () => {
    if (!artisanId.trim()) return;
    
    setIsLoading(true);
    try {
      const status = await blockchainService.getArtisanVerificationStatus(artisanId);
      setVerificationResult(status);
    } catch (error) {
      console.error('Error getting artisan status:', error);
      setVerificationResult({
        isVerified: false,
        error: 'Failed to get artisan status'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const TabButton = ({ tab, label, isActive, onClick }: {
    tab: string;
    label: string;
    isActive: boolean;
    onClick: () => void;
  }) => (
    <button
      onClick={onClick}
      className={`px-6 py-3 font-semibold rounded-t-lg transition-colors duration-200 ${
        isActive
          ? 'bg-moroccan-blue text-white border-b-2 border-moroccan-gold'
          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
      }`}
    >
      {label}
    </button>
  );

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-moroccan-blue mb-4">
          🔗 {t('title') || 'Blockchain Verification System'}
        </h2>
        <p className="text-gray-600">
          {t('description') || 'Verify authenticity and artisan credentials using blockchain technology.'}
        </p>
      </div>

      {/* Tab Navigation */}
      <div className="flex space-x-1 mb-6">
        <TabButton
          tab="verify"
          label={t('verify_tab') || 'Verify Certificate'}
          isActive={activeTab === 'verify'}
          onClick={() => setActiveTab('verify')}
        />
        <TabButton
          tab="register"
          label={t('artisan_tab') || 'Artisan Status'}
          isActive={activeTab === 'register'}
          onClick={() => setActiveTab('register')}
        />
        <TabButton
          tab="certificate"
          label={t('certificate_tab') || 'Create Certificate'}
          isActive={activeTab === 'certificate'}
          onClick={() => setActiveTab('certificate')}
        />
      </div>

      {/* Tab Content */}
      <div className="bg-gray-50 p-6 rounded-lg">
        {activeTab === 'verify' && (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-800">
              {t('verify_title') || 'Verify Authenticity Certificate'}
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('certificate_id_label') || 'Certificate ID'}
                </label>
                <input
                  type="text"
                  value={certificateId}
                  onChange={(e) => setCertificateId(e.target.value)}
                  placeholder="cert_1234567890_abcdef"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-moroccan-gold"
                />
              </div>
              
              <button
                onClick={handleVerifyCertificate}
                disabled={isLoading || !certificateId.trim()}
                className="w-full bg-moroccan-blue hover:bg-moroccan-blue/90 disabled:bg-gray-300 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-200"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>{t('verifying') || 'Verifying...'}</span>
                  </div>
                ) : (
                  t('verify_button') || 'Verify Certificate'
                )}
              </button>
            </div>

            {verificationResult && activeTab === 'verify' && (
              <div className={`p-4 rounded-lg ${
                verificationResult.isValid ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
              }`}>
                <div className="flex items-center space-x-2 mb-3">
                  {verificationResult.isValid ? (
                    <div className="flex items-center space-x-2 text-green-800">
                      <span className="text-2xl">✅</span>
                      <span className="font-semibold">Certificate Valid</span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2 text-red-800">
                      <span className="text-2xl">❌</span>
                      <span className="font-semibold">Certificate Invalid</span>
                    </div>
                  )}
                </div>

                {verificationResult.certificate && (
                  <div className="space-y-3">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="font-medium">Item ID:</span>
                        <span className="ml-2">{verificationResult.certificate.itemId}</span>
                      </div>
                      <div>
                        <span className="font-medium">Artisan ID:</span>
                        <span className="ml-2">{verificationResult.certificate.artisanId}</span>
                      </div>
                      <div>
                        <span className="font-medium">Authenticity Score:</span>
                        <span className="ml-2">{(verificationResult.certificate.authenticity_score * 100).toFixed(1)}%</span>
                      </div>
                      <div>
                        <span className="font-medium">Verification Method:</span>
                        <span className="ml-2 capitalize">{verificationResult.certificate.verificationMethod.replace('_', ' ')}</span>
                      </div>
                    </div>

                    <div className="bg-white p-3 rounded border">
                      <h4 className="font-semibold text-gray-800 mb-2">Certificate Details:</h4>
                      <div className="space-y-1 text-sm">
                        <div><span className="font-medium">Materials:</span> {verificationResult.certificate.metadata.materials.join(', ')}</div>
                        <div><span className="font-medium">Techniques:</span> {verificationResult.certificate.metadata.techniques.join(', ')}</div>
                        <div><span className="font-medium">Cultural Significance:</span> {verificationResult.certificate.metadata.cultural_significance}</div>
                        <div><span className="font-medium">Estimated Value:</span> {verificationResult.certificate.metadata.estimated_value} MAD</div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium">Blockchain Status:</span>
                      {verificationResult.blockchainConfirmed ? (
                        <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">
                          ✓ Confirmed on Blockchain
                        </span>
                      ) : (
                        <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs">
                          ⏳ Pending Confirmation
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {verificationResult.error && (
                  <p className="text-red-700 text-sm mt-2">{verificationResult.error}</p>
                )}
              </div>
            )}
          </div>
        )}

        {activeTab === 'register' && (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-800">
              {t('artisan_status_title') || 'Check Artisan Verification Status'}
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('artisan_id_label') || 'Artisan ID'}
                </label>
                <input
                  type="text"
                  value={artisanId}
                  onChange={(e) => setArtisanId(e.target.value)}
                  placeholder="artisan_12345678"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-moroccan-gold"
                />
              </div>
              
              <button
                onClick={handleGetArtisanStatus}
                disabled={isLoading || !artisanId.trim()}
                className="w-full bg-moroccan-gold hover:bg-moroccan-gold/90 disabled:bg-gray-300 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-200"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>{t('checking') || 'Checking...'}</span>
                  </div>
                ) : (
                  t('check_status_button') || 'Check Status'
                )}
              </button>
            </div>

            {verificationResult && activeTab === 'register' && (
              <div className={`p-4 rounded-lg ${
                verificationResult.isVerified ? 'bg-green-50 border border-green-200' : 'bg-yellow-50 border border-yellow-200'
              }`}>
                <div className="flex items-center space-x-2 mb-3">
                  {verificationResult.isVerified ? (
                    <div className="flex items-center space-x-2 text-green-800">
                      <span className="text-2xl">🏆</span>
                      <span className="font-semibold">Verified Artisan</span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2 text-yellow-800">
                      <span className="text-2xl">⚠️</span>
                      <span className="font-semibold">Unverified Artisan</span>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium">Verification Level:</span>
                    <span className={`ml-2 px-2 py-1 rounded-full text-xs ${
                      verificationResult.verificationLevel === 'master' ? 'bg-purple-100 text-purple-800' :
                      verificationResult.verificationLevel === 'gold' ? 'bg-yellow-100 text-yellow-800' :
                      verificationResult.verificationLevel === 'silver' ? 'bg-gray-100 text-gray-800' :
                      'bg-orange-100 text-orange-800'
                    }`}>
                      {verificationResult.verificationLevel.toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <span className="font-medium">Reputation:</span>
                    <span className="ml-2">⭐ {verificationResult.reputation}/5.0</span>
                  </div>
                  <div>
                    <span className="font-medium">Certificates:</span>
                    <span className="ml-2">{verificationResult.certificatesCount}</span>
                  </div>
                  <div>
                    <span className="font-medium">Blockchain Transactions:</span>
                    <span className="ml-2">{verificationResult.blockchainTransactions.length}</span>
                  </div>
                </div>

                {verificationResult.blockchainTransactions.length > 0 && (
                  <div className="mt-4">
                    <h4 className="font-semibold text-gray-800 mb-2">Recent Blockchain Activity:</h4>
                    <div className="space-y-1">
                      {verificationResult.blockchainTransactions.slice(0, 3).map((tx: string, index: number) => (
                        <div key={index} className="text-xs font-mono bg-gray-100 p-2 rounded">
                          {tx}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {activeTab === 'certificate' && (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-800">
              {t('create_certificate_title') || 'Create Authenticity Certificate'}
            </h3>
            
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <div className="flex items-center space-x-2 text-blue-800">
                <span className="text-xl">ℹ️</span>
                <span className="font-semibold">For Verified Artisans Only</span>
              </div>
              <p className="text-blue-700 text-sm mt-2">
                This feature is available only to verified artisans. To create authenticity certificates for your products, 
                you must first complete the artisan verification process.
              </p>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Product Name
                  </label>
                  <input
                    type="text"
                    placeholder="Traditional Zellige Tile"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-moroccan-gold"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Craft Type
                  </label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-moroccan-gold">
                    <option>Pottery & Ceramics</option>
                    <option>Textiles & Weaving</option>
                    <option>Metalwork</option>
                    <option>Woodwork</option>
                    <option>Leather Goods</option>
                    <option>Jewelry</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Materials Used
                </label>
                <input
                  type="text"
                  placeholder="Clay, natural pigments, traditional glazes"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-moroccan-gold"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Traditional Techniques
                </label>
                <textarea
                  placeholder="Hand-thrown pottery using traditional Fes techniques, fired in wood-burning kilns..."
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-moroccan-gold"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Estimated Value (MAD)
                  </label>
                  <input
                    type="number"
                    placeholder="500"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-moroccan-gold"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Product Image
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-moroccan-gold"
                  />
                </div>
              </div>

              <button
                disabled
                className="w-full bg-gray-300 text-gray-500 font-bold py-3 px-6 rounded-lg cursor-not-allowed"
              >
                🔒 Verification Required to Create Certificates
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Blockchain Info Footer */}
      <div className="mt-8 p-4 bg-gradient-to-r from-moroccan-blue/10 to-moroccan-gold/10 rounded-lg border">
        <h4 className="font-semibold text-gray-800 mb-2">🔗 Blockchain Technology</h4>
        <p className="text-sm text-gray-600">
          Our verification system uses Polygon blockchain for fast, low-cost transactions. 
          All certificates and artisan verifications are permanently recorded and publicly verifiable.
        </p>
        <div className="flex items-center space-x-4 mt-3 text-xs text-gray-500">
          <span>⚡ Low Gas Fees</span>
          <span>🔒 Immutable Records</span>
          <span>🌍 Globally Accessible</span>
          <span>♻️ Eco-Friendly</span>
        </div>
      </div>
    </div>
  );
} 