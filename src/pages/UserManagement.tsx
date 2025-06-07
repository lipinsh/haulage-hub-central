
import React, { useState } from 'react';
import { SimpleLayout } from '../components/SimpleLayout';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Users, Plus, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const UserManagement: React.FC = () => {
  const { user, createUser, removeUser, getUsers } = useAuth();
  const [newUsername, setNewUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newRole, setNewRole] = useState('user');
  const { toast } = useToast();

  // Redirect if not admin
  if (user?.role !== 'admin') {
    return <div>Access denied. Admin privileges required.</div>;
  }

  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newUsername || !newPassword) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    const success = createUser(newUsername, newPassword, newRole);
    if (success) {
      toast({
        title: "Success",
        description: `User ${newUsername} created successfully`,
      });
      setNewUsername('');
      setNewPassword('');
      setNewRole('user');
    } else {
      toast({
        title: "Error",
        description: "Username already exists",
        variant: "destructive",
      });
    }
  };

  const handleRemoveUser = (username: string) => {
    const success = removeUser(username);
    if (success) {
      toast({
        title: "Success",
        description: `User ${username} removed successfully`,
      });
    } else {
      toast({
        title: "Error",
        description: "Cannot remove admin user",
        variant: "destructive",
      });
    }
  };

  const users = getUsers();

  return (
    <SimpleLayout>
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <Users className="h-8 w-8 text-lime-500" />
          <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
        </div>

        {/* Create User */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5" />
              Create New User
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleCreateUser} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="username">Username</Label>
                  <Input
                    id="username"
                    type="text"
                    value={newUsername}
                    onChange={(e) => setNewUsername(e.target.value)}
                    placeholder="Enter username"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter password"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="role">Role</Label>
                  <Select value={newRole} onValueChange={setNewRole}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="user">User</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <Button type="submit" className="bg-lime-500 hover:bg-lime-600">
                <Plus className="h-4 w-4 mr-2" />
                Create User
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Users List */}
        <Card>
          <CardHeader>
            <CardTitle>Existing Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {users.map((u) => (
                <div key={u.username} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <span className="font-medium">{u.username}</span>
                    <span className="ml-2 text-sm text-gray-500">({u.role})</span>
                  </div>
                  {u.username !== 'admin' && (
                    <Button
                      onClick={() => handleRemoveUser(u.username)}
                      variant="destructive"
                      size="sm"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </SimpleLayout>
  );
};

export default UserManagement;
