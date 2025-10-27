import { Upload } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';

// Form validation schema
const formSchema = z.object({
  templateName: z.string().min(1, 'Template name is required'),
  photoCount: z.enum(['1x', '2x', '3x', '4x']),
  orientation: z.enum(['portrait', 'landscape']),
  eventName: z.string().min(1, 'Event name is required'),
  logoFile: z.instanceof(File).optional(),
});

type FormData = z.infer<typeof formSchema>;

interface CreateTemplateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function CreateTemplateDialog({ open, onOpenChange }: CreateTemplateDialogProps) {
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      templateName: '',
      photoCount: '1x',
      orientation: 'portrait',
      eventName: '',
      logoFile: undefined,
    },
  });

  const onSubmit = (data: FormData) => {
    console.log('Form data:', data);
    form.reset();
    onOpenChange(false);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, onChange: (file: File | undefined) => void) => {
    if (e.target.files && e.target.files[0]) {
      onChange(e.target.files[0]);
    } else {
      onChange(undefined);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md h-[80vh] flex flex-col overflow-hidden">
        <DialogHeader className="shrink-0">
          <DialogTitle>Create New Template</DialogTitle>
        </DialogHeader>

        {/* Scrollable section */}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col flex-1 overflow-hidden">
            <div className="flex-1 overflow-y-auto space-y-6 pr-2">
              {/* Template Name */}
              <FormField
                control={form.control}
                name="templateName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-black">Template Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g. Wedding Classic"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Photo Count */}
              <FormField
                control={form.control}
                name="photoCount"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel className="text-black">Number of Photos</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        value={field.value}
                        className="flex flex-col space-y-1"
                      >
                        {['1x', '2x', '3x', '4x'].map((value) => (
                          <div key={value} className="flex items-center space-x-2">
                            <RadioGroupItem value={value} id={value} />
                            <Label htmlFor={value}>{value.replace('x', '')} photo{value !== '1x' && 's'}</Label>
                          </div>
                        ))}
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Orientation */}
              <FormField
                control={form.control}
                name="orientation"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel className="text-black">Orientation</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        value={field.value}
                        className="flex flex-col space-y-1"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="portrait" id="portrait" />
                          <Label htmlFor="portrait">Portrait</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="landscape" id="landscape" />
                          <Label htmlFor="landscape">Landscape</Label>
                        </div>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Event Name */}
              <FormField
                control={form.control}
                name="eventName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-black">Event Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g. Sarah & John's Wedding"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Event Logo */}
              <FormField
                control={form.control}
                name="logoFile"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-black">Event Logo (Optional)</FormLabel>
                    <FormControl>
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                        <input
                          id="logo"
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleFileChange(e, field.onChange)}
                          className="hidden"
                        />
                        <label htmlFor="logo" className="cursor-pointer">
                          <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                          {field.value ? (
                            <p className="text-black">{field.value.name}</p>
                          ) : (
                            <>
                              <p className="text-gray-600">Click to upload logo</p>
                              <p className="text-gray-400 mt-1">PNG, JPG, SVG</p>
                            </>
                          )}
                        </label>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Footer Buttons */}
            <div className="flex gap-3 pt-4 shrink-0">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="flex-1 bg-black text-white hover:bg-gray-800"
              >
                Edit Template
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}