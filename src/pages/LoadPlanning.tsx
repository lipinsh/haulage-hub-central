
import React, { useState } from 'react';
import { Layout } from '../components/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Package, Truck, Weight, Volume, Plus, AlertTriangle, CheckCircle } from 'lucide-react';

interface LoadItem {
  id: string;
  description: string;
  weight: number;
  volume: number;
  dimensions: string;
  priority: 'High' | 'Medium' | 'Low';
  fragile: boolean;
}

interface LoadPlan {
  id: string;
  truck: string;
  maxWeight: number;
  maxVolume: number;
  currentWeight: number;
  currentVolume: number;
  status: 'Planning' | 'Optimized' | 'Approved' | 'Loading';
  items: LoadItem[];
}

const LoadPlanning = () => {
  const [loadPlans] = useState<LoadPlan[]>([
    {
      id: 'LP-001',
      truck: 'TRK-003 (Large Van)',
      maxWeight: 3500,
      maxVolume: 15,
      currentWeight: 2850,
      currentVolume: 12.5,
      status: 'Optimized',
      items: [
        { id: 'I1', description: 'Electronics Equipment', weight: 450, volume: 2.5, dimensions: '120x80x40cm', priority: 'High', fragile: true },
        { id: 'I2', description: 'Industrial Parts', weight: 1200, volume: 4.0, dimensions: '150x100x60cm', priority: 'Medium', fragile: false },
        { id: 'I3', description: 'Packaging Materials', weight: 800, volume: 3.5, dimensions: '200x120x50cm', priority: 'Low', fragile: false },
        { id: 'I4', description: 'Medical Supplies', weight: 400, volume: 2.5, dimensions: '80x60x40cm', priority: 'High', fragile: true }
      ]
    },
    {
      id: 'LP-002',
      truck: 'TRK-001 (Medium Van)',
      maxWeight: 2500,
      maxVolume: 10,
      currentWeight: 1950,
      currentVolume: 8.2,
      status: 'Planning',
      items: [
        { id: 'I5', description: 'Office Furniture', weight: 950, volume: 4.2, dimensions: '180x90x80cm', priority: 'Medium', fragile: false },
        { id: 'I6', description: 'Computer Hardware', weight: 600, volume: 2.0, dimensions: '60x50x30cm', priority: 'High', fragile: true },
        { id: 'I7', description: 'Textiles', weight: 400, volume: 2.0, dimensions: '100x80x50cm', priority: 'Low', fragile: false }
      ]
    }
  ]);

  const getStatusColor = (status: LoadPlan['status']) => {
    switch (status) {
      case 'Planning': return 'bg-yellow-100 text-yellow-800';
      case 'Optimized': return 'bg-blue-100 text-blue-800';
      case 'Approved': return 'bg-green-100 text-green-800';
      case 'Loading': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: LoadItem['priority']) => {
    switch (priority) {
      case 'High': return 'bg-red-100 text-red-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'Low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getWeightPercentage = (current: number, max: number) => (current / max) * 100;
  const getVolumePercentage = (current: number, max: number) => (current / max) * 100;

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Load Planning</h1>
            <p className="text-gray-600 mt-2">Optimize cargo loading and weight distribution</p>
          </div>
          <Button className="bg-orange-500 hover:bg-orange-600">
            <Plus className="h-4 w-4 mr-2" />
            New Load Plan
          </Button>
        </div>

        {/* Load Planning Tools */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Package className="h-5 w-5 text-blue-500" />
                <span>Auto Pack</span>
              </CardTitle>
              <CardDescription>Optimize item placement</CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full" variant="outline" size="sm">
                Optimize
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Weight className="h-5 w-5 text-green-500" />
                <span>Weight Check</span>
              </CardTitle>
              <CardDescription>Validate weight limits</CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full" variant="outline" size="sm">
                Check All
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Volume className="h-5 w-5 text-purple-500" />
                <span>3D View</span>
              </CardTitle>
              <CardDescription>Visualize load layout</CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full" variant="outline" size="sm">
                View 3D
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <CheckCircle className="h-5 w-5 text-orange-500" />
                <span>Generate List</span>
              </CardTitle>
              <CardDescription>Create loading checklist</CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full" variant="outline" size="sm">
                Generate
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Load Plans */}
        <div className="space-y-6">
          <h2 className="text-xl font-semibold text-gray-900">Active Load Plans</h2>
          
          {loadPlans.map((plan) => {
            const weightPercentage = getWeightPercentage(plan.currentWeight, plan.maxWeight);
            const volumePercentage = getVolumePercentage(plan.currentVolume, plan.maxVolume);
            const isOverweight = weightPercentage > 100;
            const isOvervolume = volumePercentage > 100;
            
            return (
              <Card key={plan.id} className="hover:shadow-md transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex justify-between items-start mb-6">
                    <div className="flex items-center space-x-3">
                      <div className="bg-orange-100 p-2 rounded-lg">
                        <Truck className="h-5 w-5 text-orange-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg">{plan.id}</h3>
                        <p className="text-gray-600">{plan.truck}</p>
                      </div>
                    </div>
                    <Badge className={getStatusColor(plan.status)}>
                      {plan.status}
                    </Badge>
                  </div>

                  {/* Capacity Overview */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium flex items-center space-x-2">
                          <Weight className="h-4 w-4" />
                          <span>Weight Capacity</span>
                          {isOverweight && <AlertTriangle className="h-4 w-4 text-red-500" />}
                        </span>
                        <span className={`text-sm ${isOverweight ? 'text-red-600 font-medium' : 'text-gray-600'}`}>
                          {plan.currentWeight}kg / {plan.maxWeight}kg
                        </span>
                      </div>
                      <Progress 
                        value={Math.min(weightPercentage, 100)} 
                        className={`h-2 ${isOverweight ? '[&>div]:bg-red-500' : ''}`}
                      />
                      {isOverweight && (
                        <p className="text-xs text-red-600">Exceeds weight limit by {plan.currentWeight - plan.maxWeight}kg</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium flex items-center space-x-2">
                          <Volume className="h-4 w-4" />
                          <span>Volume Capacity</span>
                          {isOvervolume && <AlertTriangle className="h-4 w-4 text-red-500" />}
                        </span>
                        <span className={`text-sm ${isOvervolume ? 'text-red-600 font-medium' : 'text-gray-600'}`}>
                          {plan.currentVolume}m³ / {plan.maxVolume}m³
                        </span>
                      </div>
                      <Progress 
                        value={Math.min(volumePercentage, 100)} 
                        className={`h-2 ${isOvervolume ? '[&>div]:bg-red-500' : ''}`}
                      />
                      {isOvervolume && (
                        <p className="text-xs text-red-600">Exceeds volume limit by {(plan.currentVolume - plan.maxVolume).toFixed(1)}m³</p>
                      )}
                    </div>
                  </div>

                  {/* Load Items */}
                  <div className="space-y-3 mb-4">
                    <h4 className="font-medium text-gray-900">Load Items ({plan.items.length})</h4>
                    <div className="space-y-2">
                      {plan.items.map((item) => (
                        <div key={item.id} className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex items-center space-x-3">
                            <div className="flex items-center space-x-2">
                              <Package className="h-4 w-4 text-gray-400" />
                              {item.fragile && <AlertTriangle className="h-4 w-4 text-orange-500" />}
                            </div>
                            <div>
                              <h5 className="font-medium text-gray-900">{item.description}</h5>
                              <p className="text-sm text-gray-600">{item.dimensions}</p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-4">
                            <Badge className={getPriorityColor(item.priority)}>
                              {item.priority}
                            </Badge>
                            <div className="text-right text-sm">
                              <p><strong>{item.weight}kg</strong></p>
                              <p className="text-gray-500">{item.volume}m³</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex justify-between items-center pt-4 border-t">
                    <Button variant="outline" size="sm">
                      <Package className="h-4 w-4 mr-2" />
                      3D Preview
                    </Button>
                    <div className="flex space-x-2">
                      {plan.status === 'Planning' && (
                        <Button size="sm" className="bg-blue-500 hover:bg-blue-600">
                          Optimize Load
                        </Button>
                      )}
                      {plan.status === 'Optimized' && (
                        <Button size="sm" className="bg-green-500 hover:bg-green-600">
                          Approve Plan
                        </Button>
                      )}
                      <Button variant="outline" size="sm">Edit Items</Button>
                      <Button variant="outline" size="sm">Print Checklist</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </Layout>
  );
};

export default LoadPlanning;
