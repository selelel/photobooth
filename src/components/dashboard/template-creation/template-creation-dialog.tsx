import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useEditorStore } from '@/lib/zustand/feature/editor';
import { getInitialPictures } from '@/components/editor-poc';
import { useNavigate } from '@tanstack/react-router';

// Form validation schema
const formSchema = z.object({
  templateName: z.string().min(1, 'Template name is required'),
  photoCount: z.enum(['1', '2', '3', '4']),
  orientation: z.enum(['portrait', 'landscape']),
  eventName: z.string().min(1, 'Event name is required'),
});

type FormData = z.infer<typeof formSchema>;

interface CreateTemplateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function CreateTemplateDialog({ open, onOpenChange }: CreateTemplateDialogProps) {
  const navigate = useNavigate()
  const {setOrientation, setTemplateName, setEventName, setPictureTemplate } = useEditorStore((state) => state);
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      templateName: '',
      photoCount: "1",
      orientation: 'portrait',
      eventName: '',
    },
  });



  const onSubmit = (data: FormData) => {
    setOrientation(data.orientation);
    setTemplateName(data.templateName);
    setEventName(data.eventName);
    setPictureTemplate(getInitialPictures(Number(data.photoCount), data.orientation));
    navigate({ to: '/dashboard/template-creation' });
    form.reset();
    onOpenChange(false);
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
                        value={field.value.toString()}
                        className="flex flex-col space-y-1"
                      >
                        {[1,2,3,4].map((value) => (
                          <div key={value} className="flex items-center space-x-2">
                            <RadioGroupItem value={value.toString()} id={value.toString()} />
                            <Label htmlFor={value.toString()}>{value} photo{value !== 1 && 's'}</Label>
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