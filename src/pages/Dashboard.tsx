
import React from 'react';
import { Layout } from '../components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Package, Truck, Route, TrendingUp, Clock, MapPin } from 'lucide-react';

const Dashboard = () => {
  const stats = [
    { title: 'Active Orders', value: '24', icon: Package, change: '+5 from yesterday' },
    { title: 'Trucks on Road', value: '8', icon: Truck, change: '2 returning today' },
    { title: 'Planned Routes', value: '12', icon: Route, change: '3 pending approval' },
    { title: 'Revenue Today', value: '£2,850', icon: TrendingUp, change: '+12% vs last week' },
  ];

  const recentOrders = [
    { id: 'ORD-001', customer: 'ABC Manufacturing', destination: 'Birmingham', status: 'In Transit', time: '2 hours ago' },
    { id: 'ORD-002', customer: 'XYZ Logistics', destination: 'Manchester', status: 'Pending', time: '4 hours ago' },
    { id: 'ORD-003', customer: 'DEF Industries', destination: 'Leeds', status: 'Delivered', time: '6 hours ago' },
  ];

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-2">Overview of your transport operations</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <Card key={stat.title}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">
                    {stat.title}
                  </CardTitle>
                  <Icon className="h-5 w-5 text-orange-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                  <p className="text-xs text-gray-500 mt-1">{stat.change}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Orders */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Clock className="h-5 w-5" />
                <span>Recent Orders</span>
              </CardTitle>
              <CardDescription>Latest order updates</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentOrders.map((order) => (
                  <div key={order.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <span className="font-medium text-gray-900">{order.id}</span>
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          order.status === 'Delivered' ? 'bg-green-100 text-green-800' :
                          order.status === 'In Transit' ? 'bg-blue-100 text-blue-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {order.status}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">{order.customer}</p>
                      <div className="flex items-center space-x-1 mt-1">
                        <MapPin className="h-3 w-3 text-gray-400" />
                        <span className="text-xs text-gray-500">{order.destination}</span>
                      </div>
                    </div>
                    <span className="text-xs text-gray-500">{order.time}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Common tasks and tools</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <button className="p-4 bg-orange-50 hover:bg-orange-100 rounded-lg transition-colors text-left">
                  <Package className="h-8 w-8 text-orange-500 mb-2" />
                  <h3 className="font-medium text-gray-900">New Order</h3>
                  <p className="text-sm text-gray-600">Create a new shipping order</p>
                </button>
                <button className="p-4 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors text-left">
                  <Route className="h-8 w-8 text-blue-500 mb-2" />
                  <h3 className="font-medium text-gray-900">Plan Route</h3>
                  <p className="text-sm text-gray-600">Optimize delivery routes</p>
                </button>
                <button className="p-4 bg-green-50 hover:bg-green-100 rounded-lg transition-colors text-left">
                  <Truck className="h-8 w-8 text-green-500 mb-2" />
                  <h3 className="font-medium text-gray-900">Track Vehicle</h3>
                  <p className="text-sm text-gray-600">Monitor truck locations</p>
                </button>
                <button className="p-4 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors text-left">
                  <TrendingUp className="h-8 w-8 text-purple-500 mb-2" />
                  <h3 className="font-medium text-gray-900">View Reports</h3>
                  <p className="text-sm text-gray-600">Performance analytics</p>
                </button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
