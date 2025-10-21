import { LayoutTemplate, Settings, Camera, Layout } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { useSupabase, useUserInfo } from '@/lib/supabase/hooks';
import { useNavigate } from '@tanstack/react-router';

const MOCK_TEMPLATES = [
  { id: 1, name: 'Classic Single', photoCount: '1x' },
  { id: 2, name: 'Side by Side', photoCount: '2x' },
  { id: 3, name: 'Quad Layout', photoCount: '4x' },
  { id: 4, name: 'Strip Style', photoCount: '3x' },
  { id: 5, name: 'Square Duo', photoCount: '2x' },
  { id: 6, name: 'Portrait Frame', photoCount: '1x' },
];

export default function DashboardPage() {
    const supabase = useSupabase();
    const navigate = useNavigate();
    const { user } = useUserInfo();
  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-300 p-6">
        <div className="mb-8">
          <h2 className="text-black">Photoble</h2>
        </div>
        <nav className="space-y-2">
          <button className="w-full flex items-center gap-3 px-4 py-3 text-black bg-gray-100 rounded-lg hover:bg-gray-200">
            <LayoutTemplate className="w-5 h-5" />
            <span>Templates</span>
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-100 rounded-lg">
            <Layout className="w-5 h-5" />
            <span>Booth Setup</span>
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-100 rounded-lg">
            <Camera className="w-5 h-5" />
            <span>Captures</span>
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-100 rounded-lg">
            <Settings className="w-5 h-5" />
            <span>Settings</span>
          </button>
          <button onClick={() => {
              supabase.auth.signOut()
                navigate({ to: '/' });
            }} className="w-full flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-100 rounded-lg">
            <Settings className="w-5 h-5" />
            <span>Sign Out</span>
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-black">Welcome back, {user?.user_metadata.firstName} {user?.user_metadata.lastName}</h1>
            <Button className="rounded-lg bg-black text-white hover:bg-gray-800">
              Create New Template
            </Button>
          </div>

          {/* Template Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {MOCK_TEMPLATES.map((template) => (
              <Card key={template.id} className="border-gray-300 hover:border-gray-400 transition-colors">
                <CardHeader className="p-0">
                  <div className="bg-gray-100 h-48 border-b border-gray-300 flex items-center justify-center rounded-t-lg">
                    <span className="text-gray-400">Template Preview</span>
                  </div>
                </CardHeader>
                <CardContent className="p-4">
                  <h3 className="text-black mb-1">{template.name}</h3>
                  <p className="text-gray-600">{template.photoCount} photos</p>
                </CardContent>
                <CardFooter className="p-4 pt-0">
                  <Button 
                    variant="outline" 
                    className="w-full rounded-lg border-gray-300 hover:bg-gray-100"
                  >
                    Use Template
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
