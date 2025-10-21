import { Link } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import { Facebook, Instagram, Twitter } from 'lucide-react'
import { useUserInfo } from '@/lib/supabase/hooks';

function MarketingPage() {
    const { user } = useUserInfo();
    return (
        <div className="min-h-screen flex flex-col bg-white">
        {/* Header */}
        <header className="border-b border-gray-300 py-4">
            <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
            <div className="text-black">Photoble</div>
            <nav className="flex gap-8 text-black">
                {
                    user ? (
                        <Link to="/dashboard" className="hover:text-gray-600">Dashboard</Link>
                    ) : (
                        <Link to="/signin" className="hover:text-gray-600">Sign In</Link>
                    )
                }
            </nav>
            </div>
        </header>

        {/* Hero Section */}
        <main className="flex-1 flex items-center">
            <div className="max-w-7xl mx-auto px-6 py-20 w-full">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                <div>
                <h1 className="text-black mb-4">
                    Create Your Event Photobooth in Minutes
                </h1>
                <p className="text-gray-600 mb-8">
                    Customize your photo templates, capture moments, and print instantly.
                </p>
                <Link to="/" preload={false}>
                    <Button className="rounded-lg bg-black text-white hover:bg-gray-800">
                    Get Started
                    </Button>
                </Link>
                </div>
                <div className="bg-gray-100 rounded-lg aspect-video border-2 border-gray-300 flex items-center justify-center">
                <span className="text-gray-400">Booth Preview</span>
                </div>
            </div>
            </div>
        </main>

        {/* Footer */}
        <footer className="border-t border-gray-300 py-6">
            <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
            <p className="text-gray-600">© 2025 Photoble</p>
            <div className="flex gap-4 text-gray-400">
                <Facebook className="w-5 h-5 hover:text-gray-600 cursor-pointer" />
                <Twitter className="w-5 h-5 hover:text-gray-600 cursor-pointer" />
                <Instagram className="w-5 h-5 hover:text-gray-600 cursor-pointer" />
            </div>
            </div>
        </footer>
        </div>
    )
}

export default MarketingPage