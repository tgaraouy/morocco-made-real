'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Play, X, Clock, BookOpen } from 'lucide-react';
import { ExperienceNarration } from '@/lib/narration-service';

interface LearnMoreModalProps {
  isOpen: boolean;
  onClose: () => void;
  narration: ExperienceNarration;
}

export default function LearnMoreModal({ isOpen, onClose, narration }: LearnMoreModalProps) {
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b p-4 flex items-center justify-between">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-orange-500" />
            {narration.title}
          </h2>
          <Button variant="outline" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>

        <div className="p-6 space-y-6">
          {/* Summary */}
          <div className="bg-orange-50 rounded-lg p-4">
            <h3 className="font-semibold mb-2 text-gray-900">Story Behind the Craft</h3>
            <p className="text-gray-700 leading-relaxed">{narration.summary}</p>
          </div>

          {/* Images Gallery */}
          <div className="space-y-3">
            <h3 className="font-semibold text-gray-900">Artisan Workshop</h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="relative group">
                <img
                  src={narration.image_1_url}
                  alt="Workshop image 1"
                  className="w-full h-48 object-cover rounded-lg transition-transform group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-opacity rounded-lg" />
              </div>
              <div className="relative group">
                <img
                  src={narration.image_2_url}
                  alt="Workshop image 2"
                  className="w-full h-48 object-cover rounded-lg transition-transform group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-opacity rounded-lg" />
              </div>
            </div>
          </div>

          {/* Video Section */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-gray-900">Master at Work</h3>
              <div className="flex items-center gap-1 text-sm text-gray-600">
                <Clock className="w-4 h-4" />
                {formatDuration(narration.video_duration)}
              </div>
            </div>
            
            <div className="relative bg-gray-100 rounded-lg overflow-hidden">
              <video
                className="w-full h-64 object-cover"
                poster={narration.image_1_url}
                controls={isVideoPlaying}
                onPlay={() => setIsVideoPlaying(true)}
                onPause={() => setIsVideoPlaying(false)}
              >
                <source src={narration.video_url} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
              
              {!isVideoPlaying && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <Button
                    size="lg"
                    className="bg-orange-500 hover:bg-orange-600 rounded-full w-16 h-16"
                    onClick={() => {
                      setIsVideoPlaying(true);
                      const video = document.querySelector('video');
                      if (video) video.play();
                    }}
                  >
                    <Play className="w-6 h-6 ml-1" />
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Artisan Voice Script */}
          <div className="bg-blue-50 rounded-lg p-4">
            <h3 className="font-semibold mb-2 text-gray-900 flex items-center gap-2">
              🎙️ Artisan's Voice
            </h3>
            <p className="text-gray-700 leading-relaxed italic">
              "{narration.artisan_voice_script}"
            </p>
          </div>

          {/* Cultural Context */}
          <div className="bg-green-50 rounded-lg p-4">
            <h3 className="font-semibold mb-2 text-gray-900 flex items-center gap-2">
              🏛️ Cultural Heritage
            </h3>
            <p className="text-gray-700 leading-relaxed">{narration.cultural_context}</p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4 border-t">
            <Button
              onClick={onClose}
              variant="outline"
              className="flex-1"
            >
              <X className="w-4 h-4 mr-2" />
              Close
            </Button>
            <Button
              className="flex-1 bg-green-500 hover:bg-green-600"
              onClick={() => {
                onClose();
              }}
            >
              Book This Experience
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
} 