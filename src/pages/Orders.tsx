
import React, { useState } from 'react';
import { Layout } from '../components/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, Search, Filter, Package, MapPin, Calendar, Truck } from 'lucide-react';

interface Order {
  id: string;
  customer: string;
  pickup: string;
  destination: string;
  weight: string;
  value: string;
  status: 'Pending' | 'Assigned' | 'In Transit' | 'Delivered';
  date: string;
  driver?: string;
  truck?: string;
}

const Orders = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [orders] = useState<Order[]>([
    {
      id: 'ORD-001',
      customer: 'ABC Manufacturing Ltd',
      pickup: 'London Depot',
      destination: 'Birmingham Warehouse',
      weight: '2.5 tonnes',
      value: '£450',
      status: 'In Transit',
      date: '2024-06-06',
      driver: 'John Smith',
      truck: 'TRK-003'
    },
    {
      id: 'ORD-002',
      customer: 'XYZ Logistics',
      pickup: 'Manchester Hub',
      destination: 'Leeds Distribution',
      weight: '1.8 tonnes',
      value: '£320',
      status: 'Pending',
      date: '2024-06-06'
    },
    {
      id: 'ORD-003',
      customer: 'DEF Industries',
      pickup: 'Bristol Port',
      destination: 'Cardiff Central',
      weight: '3.2 tonnes',
      value: '£580',
      status: 'Delivered',
      date: '2024-06-05',
      driver: 'Sarah Wilson',
      truck: 'TRK-001'
    },
    {
      id: 'ORD-004',
      customer: 'GHI Construction',
      pickup: 'Sheffield Yard',
      destination: 'Nottingham Site',
      weight: '4.1 tonnes',
      value: '£750',
      status: 'Assigned',
      date: '2024-06-06',
      driver: 'Mike Johnson',
      truck: 'TRK-002'
    }
  ]);

  const filteredOrders = orders.filter(order =>
    order.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.destination.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'Pending': return 'bg-yellow-100 text-yellow-800';
      case 'Assigned': return 'bg-blue-100 text-blue-800';
      case 'In Transit': return 'bg-orange-100 text-orange-800';
      case 'Delivered': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Order Management</h1>
            <p className="text-gray-600 mt-2">Manage and track all shipping orders</p>
          </div>
          <Button className="bg-orange-500 hover:bg-orange-600">
            <Plus className="h-4 w-4 mr-2" />
            New Order
          </Button>
        </div>

        {/* Search and Filters */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex space-x-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search orders by ID, customer, or destination..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button variant="outline">
                <Filter className="h-4 w-4 mr-2" />
                Filters
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Orders List */}
        <div className="grid gap-4">
          {filteredOrders.map((order) => (
            <Card key={order.id} className="hover:shadow-md transition-shadow">
              <CardContent className="pt-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="bg-orange-100 p-2 rounded-lg">
                      <Package className="h-5 w-5 text-orange-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">{order.id}</h3>
                      <p className="text-gray-600">{order.customer}</p>
                    </div>
                  </div>
                  <Badge className={getStatusColor(order.status)}>
                    {order.status}
                  </Badge>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div className="flex items-center space-x-2">
                    <MapPin className="h-4 w-4 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium">Pickup</p>
                      <p className="text-sm text-gray-600">{order.pickup}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <MapPin className="h-4 w-4 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium">Destination</p>
                      <p className="text-sm text-gray-600">{order.destination}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium">Date</p>
                      <p className="text-sm text-gray-600">{order.date}</p>
                    </div>
                  </div>
                </div>

                <div className="flex justify-between items-center pt-4 border-t">
                  <div className="flex space-x-6 text-sm">
                    <span><strong>Weight:</strong> {order.weight}</span>
                    <span><strong>Value:</strong> {order.value}</span>
                    {order.driver && (
                      <span className="flex items-center space-x-1">
                        <Truck className="h-4 w-4" />
                        <span>{order.driver} ({order.truck})</span>
                      </span>
                    )}
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm">View</Button>
                    <Button variant="outline" size="sm">Edit</Button>
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

export default Orders;
