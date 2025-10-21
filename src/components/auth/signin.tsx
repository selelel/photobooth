import { Link, useNavigate } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useLoginWithPassword } from '@/lib/supabase/hooks';
import { toast } from 'sonner';

// ✅ Validation schema
const signInSchema = z.object({
  email: z.string().email('Please enter a valid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type SignInFormValues = z.infer<typeof signInSchema>;

export default function SignInPage() {
  const signIn = useLoginWithPassword()
  const navigate = useNavigate();

  // ✅ Setup form with validation and default values
  const form = useForm<SignInFormValues>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const handleSubmit = (data: SignInFormValues) => {
    signIn({
      email: data.email,
      password: data.password,
    }).then(({ error }) => {
      if (error) {
        toast.error('Error signing up: ' + error.message);
      } else {
        toast.success('Logged in successfully');
        navigate({ to: '/dashboard' });
      }
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Header */}
      <header className="border-b border-gray-300 py-4">
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <Link to="/" className="text-black font-semibold text-lg">
            Photoble
          </Link>
        </div>
      </header>

      {/* Login Form */}
      <main className="flex-1 flex items-center justify-center py-12">
        <div className="w-full max-w-md px-6">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="border border-gray-300 rounded-lg p-8 bg-white space-y-6"
            >
              <div>
                <h1 className="text-black text-2xl font-semibold mb-2 text-center">
                  Welcome Back
                </h1>
                <p className="text-gray-600 text-center mb-6">
                  Log in to your Photoble account
                </p>
              </div>

              {/* Email */}
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="you@example.com"
                        className="border-gray-300 rounded-lg"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Password */}
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="••••••••"
                        className="border-gray-300 rounded-lg"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex items-center justify-between">
                <button
                  type="button"
                  className="text-gray-600 hover:text-black text-sm"
                >
                  Forgot password?
                </button>
              </div>

              <Button
                type="submit"
                className="w-full rounded-lg bg-black text-white hover:bg-gray-800"
              >
                Log In
              </Button>

              <div className="mt-4 text-center">
                <span className="text-gray-600">Don’t have an account? </span>
                <Link to="/signup" className="text-black hover:underline">
                  Sign up
                </Link>
              </div>
            </form>
          </Form>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-300 py-6">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-gray-600">© 2025 Photoble</p>
        </div>
      </footer>
    </div>
  );
}