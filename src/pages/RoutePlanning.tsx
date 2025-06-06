
import React, { useState } from 'react';
import { Layout } from '../components/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Route, MapPin, Clock, Fuel, Truck, Plus, Navigation } from 'lucide-react';

interface RouteStop {
  id: string;
  address: string;
  type: 'pickup' | 'delivery';
  timeWindow: string;
  duration: string;
}

interface PlannedRoute {
  id: string;
  driver: string;
  truck: string;
  status: 'Draft' | 'Approved' | 'Active' | 'Completed';
  totalDistance: string;
  estimatedTime: string;
  fuelCost: string;
  stops: RouteStop[];
}

const RoutePlanning = () => {
  const [routes] = useState<PlannedRoute[]>([
    {
      id: 'RT-001',
      driver: 'John Smith',
      truck: 'TRK-003',
      status: 'Active',
      totalDistance: '185 miles',
      estimatedTime: '6h 30m',
      fuelCost: '£95',
      stops: [
        { id: 'S1', address: 'London Depot', type: 'pickup', timeWindow: '08:00-09:00', duration: '30 min' },
        { id: 'S2', address: 'Birmingham Warehouse', type: 'delivery', timeWindow: '11:00-12:00', duration: '45 min' },
        { id: 'S3', address: 'Coventry Industrial', type: 'pickup', timeWindow: '13:30-14:00', duration: '20 min' },
        { id: 'S4', address: 'Leicester Distribution', type: 'delivery', timeWindow: '15:30-16:30', duration: '40 min' }
      ]
    },
    {
      id: 'RT-002',
      driver: 'Sarah Wilson',
      truck: 'TRK-001',
      status: 'Draft',
      totalDistance: '120 miles',
      estimatedTime: '4h 15m',
      fuelCost: '£62',
      stops: [
        { id: 'S5', address: 'Manchester Hub', type: 'pickup', timeWindow: '09:00-10:00', duration: '25 min' },
        { id: 'S6', address: 'Leeds Distribution', type: 'delivery', timeWindow: '12:00-13:00', duration: '35 min' },
        { id: 'S7', address: 'Sheffield Warehouse', type: 'delivery', timeWindow: '14:30-15:30', duration: '30 min' }
      ]
    }
  ]);

  const getStatusColor = (status: PlannedRoute['status']) => {
    switch (status) {
      case 'Draft': return 'bg-gray-100 text-gray-800';
      case 'Approved': return 'bg-blue-100 text-blue-800';
      case 'Active': return 'bg-green-100 text-green-800';
      case 'Completed': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Route Planning</h1>
            <p className="text-gray-600 mt-2">Optimize delivery routes and schedules</p>
          </div>
          <Button className="bg-orange-500 hover:bg-orange-600">
            <Plus className="h-4 w-4 mr-2" />
            Plan New Route
          </Button>
        </div>

        {/* Route Planning Tools */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Navigation className="h-5 w-5 text-blue-500" />
                <span>Auto Optimizer</span>
              </CardTitle>
              <CardDescription>Automatically optimize routes for efficiency</CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full" variant="outline">
                Optimize All Routes
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <MapPin className="h-5 w-5 text-green-500" />
                <span>Map View</span>
              </CardTitle>
              <CardDescription>Visual route planning interface</CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full" variant="outline">
                Open Map
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Clock className="h-5 w-5 text-orange-500" />
                <span>Time Analysis</span>
              </CardTitle>
              <CardDescription>Analyze delivery time windows</CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full" variant="outline">
                View Analysis
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Planned Routes */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-900">Planned Routes</h2>
          
          {routes.map((route) => (
            <Card key={route.id} className="hover:shadow-md transition-shadow">
              <CardContent className="pt-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="bg-blue-100 p-2 rounded-lg">
                      <Route className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">{route.id}</h3>
                      <p className="text-gray-600">{route.driver} • {route.truck}</p>
                    </div>
                  </div>
                  <Badge className={getStatusColor(route.status)}>
                    {route.status}
                  </Badge>
                </div>

                {/* Route Summary */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <MapPin className="h-4 w-4 text-gray-500" />
                    <span className="text-sm"><strong>Distance:</strong> {route.totalDistance}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4 text-gray-500" />
                    <span className="text-sm"><strong>Time:</strong> {route.estimatedTime}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Fuel className="h-4 w-4 text-gray-500" />
                    <span className="text-sm"><strong>Fuel Cost:</strong> {route.fuelCost}</span>
                  </div>
                </div>

                {/* Route Stops */}
                <div className="space-y-2 mb-4">
                  <h4 className="font-medium text-gray-900">Route Stops ({route.stops.length})</h4>
                  <div className="space-y-2">
                    {route.stops.map((stop, index) => (
                      <div key={stop.id} className="flex items-center space-x-3 p-2 border rounded-lg">
                        <div className="flex-shrink-0 w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                          <span className="text-sm font-medium text-orange-600">{index + 1}</span>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2">
                            <span className="font-medium text-gray-900">{stop.address}</span>
                            <Badge variant="outline" className={
                              stop.type === 'pickup' ? 'text-blue-600 border-blue-200' : 'text-green-600 border-green-200'
                            }>
                              {stop.type}
                            </Badge>
                          </div>
                          <div className="flex items-center space-x-4 text-sm text-gray-500 mt-1">
                            <span>{stop.timeWindow}</span>
                            <span>Duration: {stop.duration}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex justify-between items-center pt-4 border-t">
                  <Button variant="outline" size="sm">
                    <MapPin className="h-4 w-4 mr-2" />
                    View on Map
                  </Button>
                  <div className="flex space-x-2">
                    {route.status === 'Draft' && (
                      <Button size="sm" className="bg-green-500 hover:bg-green-600">
                        Approve Route
                      </Button>
                    )}
                    <Button variant="outline" size="sm">Edit</Button>
                    <Button variant="outline" size="sm">
                      <Truck className="h-4 w-4 mr-2" />
                      Assign Driver
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default RoutePlanning;
