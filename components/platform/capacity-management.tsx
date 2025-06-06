'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  TrendingUp, 
  TrendingDown, 
  Users, 
  Calendar, 
  DollarSign,
  AlertTriangle,
  CheckCircle,
  Clock
} from 'lucide-react';

interface CapacityData {
  artisanId: string;
  artisanName: string;
  craft: string;
  dailySlots: number;
  weeklySlots: number;
  currentBookings: number;
  availableSlots: number;
  demandRatio: number;
  basePrice: number;
  currentPrice: number;
  nextAvailable: string;
  groupSizes: number[];
}

interface CapacityManagementProps {
  artisanData: CapacityData[];
}

export function CapacityManagement({ artisanData }: CapacityManagementProps) {
  const [selectedArtisan, setSelectedArtisan] = useState<string | null>(null);
  const [timeRange, setTimeRange] = useState<'today' | 'week' | 'month'>('week');

  const calculateDynamicPrice = (basePrice: number, demandRatio: number, hoursToNext: number) => {
    const demandMultiplier = demandRatio > 0.8 ? 1.3 : 
                            demandRatio > 0.6 ? 1.1 : 
                            demandRatio < 0.3 ? 0.8 : 1.0;
    
    const urgencyMultiplier = hoursToNext < 24 ? 1.2 :
                             hoursToNext < 72 ? 1.1 : 1.0;
    
    return Math.round(basePrice * demandMultiplier * urgencyMultiplier);
  };

  const getCapacityStatus = (ratio: number) => {
    if (ratio > 0.9) return { status: 'high', color: 'text-red-600 bg-red-100', label: 'High Demand' };
    if (ratio > 0.7) return { status: 'medium', color: 'text-orange-600 bg-orange-100', label: 'Moderate' };
    if (ratio > 0.4) return { status: 'low', color: 'text-green-600 bg-green-100', label: 'Available' };
    return { status: 'very-low', color: 'text-blue-600 bg-blue-100', label: 'Low Demand' };
  };

  const generateSmartCoupon = (demandRatio: number, artisanId: string) => {
    if (demandRatio < 0.3) {
      return {
        code: `BOOST${artisanId.toUpperCase()}`,
        discount: 40,
        message: "🚀 Help us fill this amazing workshop!"
      };
    }
    if (demandRatio < 0.5) {
      return {
        code: `SAVE${artisanId.toUpperCase()}`,
        discount: 25,
        message: "💰 Great value opportunity!"
      };
    }
    return null;
  };

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Capacity</p>
                <p className="text-2xl font-bold">
                  {artisanData.reduce((sum, a) => sum + a.weeklySlots, 0)}
                </p>
              </div>
              <Calendar className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Bookings</p>
                <p className="text-2xl font-bold">
                  {artisanData.reduce((sum, a) => sum + a.currentBookings, 0)}
                </p>
              </div>
              <Users className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Utilization</p>
                <p className="text-2xl font-bold">
                  {Math.round((artisanData.reduce((sum, a) => sum + a.currentBookings, 0) / 
                              artisanData.reduce((sum, a) => sum + a.weeklySlots, 0)) * 100)}%
                </p>
              </div>
              <TrendingUp className="w-8 h-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Avg Price</p>
                <p className="text-2xl font-bold">
                  ${Math.round(artisanData.reduce((sum, a) => sum + a.currentPrice, 0) / artisanData.length)}
                </p>
              </div>
              <DollarSign className="w-8 h-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Time Range Selector */}
      <div className="flex gap-2">
        {(['today', 'week', 'month'] as const).map((range) => (
          <Button
            key={range}
            variant={timeRange === range ? 'default' : 'outline'}
            size="sm"
            onClick={() => setTimeRange(range)}
          >
            {range.charAt(0).toUpperCase() + range.slice(1)}
          </Button>
        ))}
      </div>

      {/* Artisan Capacity Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {artisanData.map((artisan) => {
          const capacityStatus = getCapacityStatus(artisan.demandRatio);
          const smartCoupon = generateSmartCoupon(artisan.demandRatio, artisan.artisanId);
          const utilizationPercent = (artisan.currentBookings / artisan.weeklySlots) * 100;

          return (
            <Card 
              key={artisan.artisanId}
              className={`cursor-pointer transition-all hover:shadow-lg ${
                selectedArtisan === artisan.artisanId ? 'ring-2 ring-blue-500' : ''
              }`}
              onClick={() => setSelectedArtisan(
                selectedArtisan === artisan.artisanId ? null : artisan.artisanId
              )}
            >
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{artisan.artisanName}</CardTitle>
                    <p className="text-gray-600 capitalize">{artisan.craft}</p>
                  </div>
                  <Badge className={capacityStatus.color}>
                    {capacityStatus.label}
                  </Badge>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Capacity Utilization */}
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Capacity Utilization</span>
                    <span>{Math.round(utilizationPercent)}%</span>
                  </div>
                  <Progress value={utilizationPercent} className="h-2" />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>{artisan.currentBookings} booked</span>
                    <span>{artisan.availableSlots} available</span>
                  </div>
                </div>

                {/* Pricing Information */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Base Price</p>
                    <p className="text-lg font-semibold">${artisan.basePrice}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Current Price</p>
                    <div className="flex items-center gap-2">
                      <p className="text-lg font-semibold text-green-600">
                        ${artisan.currentPrice}
                      </p>
                      {artisan.currentPrice !== artisan.basePrice && (
                        <Badge variant="outline" className="text-xs">
                          {artisan.currentPrice > artisan.basePrice ? (
                            <TrendingUp className="w-3 h-3 mr-1" />
                          ) : (
                            <TrendingDown className="w-3 h-3 mr-1" />
                          )}
                          {Math.round(((artisan.currentPrice - artisan.basePrice) / artisan.basePrice) * 100)}%
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>

                {/* Smart Coupon */}
                {smartCoupon && (
                  <div className="bg-blue-50 p-3 rounded-lg">
                    <div className="flex items-center gap-2 mb-1">
                      <AlertTriangle className="w-4 h-4 text-blue-600" />
                      <span className="font-semibold text-blue-800">Smart Coupon Available</span>
                    </div>
                    <p className="text-sm text-blue-700">{smartCoupon.message}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge className="bg-blue-600 text-white">
                        {smartCoupon.code}
                      </Badge>
                      <span className="text-sm font-semibold text-blue-800">
                        {smartCoupon.discount}% OFF
                      </span>
                    </div>
                  </div>
                )}

                {/* Next Available */}
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Clock className="w-4 h-4" />
                  <span>Next available: {artisan.nextAvailable}</span>
                </div>

                {/* Group Sizes */}
                <div>
                  <p className="text-sm text-gray-600 mb-2">Supported Group Sizes</p>
                  <div className="flex gap-1">
                    {artisan.groupSizes.map((size) => (
                      <Badge key={size} variant="outline" className="text-xs">
                        {size === 1 ? 'Solo' : `${size} people`}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 pt-2">
                  <Button size="sm" variant="outline" className="flex-1">
                    View Details
                  </Button>
                  <Button size="sm" className="flex-1">
                    Manage Capacity
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Detailed View for Selected Artisan */}
      {selectedArtisan && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Detailed Capacity Management</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Demand Forecast */}
              <div>
                <h4 className="font-semibold mb-3">7-Day Demand Forecast</h4>
                <div className="space-y-2">
                  {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, index) => {
                    const demand = Math.random() * 100;
                    return (
                      <div key={day} className="flex items-center gap-3">
                        <span className="w-8 text-sm">{day}</span>
                        <Progress value={demand} className="flex-1 h-2" />
                        <span className="text-sm w-12">{Math.round(demand)}%</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Pricing Strategy */}
              <div>
                <h4 className="font-semibold mb-3">Dynamic Pricing</h4>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm">Low Demand (&lt;30%)</span>
                    <span className="text-sm font-semibold text-green-600">-20%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Normal (30-70%)</span>
                    <span className="text-sm font-semibold">Base Price</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">High Demand (&gt;70%)</span>
                    <span className="text-sm font-semibold text-orange-600">+10%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Peak (&gt;90%)</span>
                    <span className="text-sm font-semibold text-red-600">+30%</span>
                  </div>
                </div>
              </div>

              {/* Optimization Suggestions */}
              <div>
                <h4 className="font-semibold mb-3">Optimization Tips</h4>
                <div className="space-y-2">
                  <div className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600 mt-0.5" />
                    <span className="text-sm">Offer group discounts for low-demand slots</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600 mt-0.5" />
                    <span className="text-sm">Create last-minute booking incentives</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600 mt-0.5" />
                    <span className="text-sm">Split long experiences into shorter slots</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

// Sample data for testing
export const sampleCapacityData: CapacityData[] = [
  {
    artisanId: 'hassan-pottery',
    artisanName: 'Hassan Benali',
    craft: 'pottery',
    dailySlots: 3,
    weeklySlots: 18,
    currentBookings: 14,
    availableSlots: 4,
    demandRatio: 0.78,
    basePrice: 150,
    currentPrice: 165,
    nextAvailable: 'Tomorrow 2 PM',
    groupSizes: [1, 2, 4]
  },
  {
    artisanId: 'fatima-weaving',
    artisanName: 'Fatima Zahra',
    craft: 'weaving',
    dailySlots: 2,
    weeklySlots: 12,
    currentBookings: 4,
    availableSlots: 8,
    demandRatio: 0.33,
    basePrice: 120,
    currentPrice: 96,
    nextAvailable: 'Today 4 PM',
    groupSizes: [1, 2, 3, 6]
  },
  {
    artisanId: 'ahmed-leather',
    artisanName: 'Ahmed Tazi',
    craft: 'leather',
    dailySlots: 2,
    weeklySlots: 14,
    currentBookings: 13,
    availableSlots: 1,
    demandRatio: 0.93,
    basePrice: 200,
    currentPrice: 260,
    nextAvailable: 'Next week',
    groupSizes: [1, 2]
  },
  {
    artisanId: 'youssef-metal',
    artisanName: 'Youssef El Fassi',
    craft: 'metalwork',
    dailySlots: 1,
    weeklySlots: 7,
    currentBookings: 5,
    availableSlots: 2,
    demandRatio: 0.71,
    basePrice: 180,
    currentPrice: 198,
    nextAvailable: 'Friday 10 AM',
    groupSizes: [1, 2, 3]
  }
]; 