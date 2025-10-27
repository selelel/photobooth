import { useEffect } from 'react';
import { Button } from '../../ui/button';
import Canvas from './canvas';
import { useEditorStore } from '@/lib/zustand/feature/editor';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Upload } from 'lucide-react';
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
} from '@/components/ui/form';

// 🎨 Background color options
const COLORS = [
  { name: 'Black', value: '#000000' },
  { name: 'White', value: '#FFFFFF' },
  { name: 'Red', value: '#EF4444' },
  { name: 'Blue', value: '#3B82F6' },
  { name: 'Green', value: '#10B981' },
  { name: 'Yellow', value: '#F59E0B' },
  { name: 'Purple', value: '#8B5CF6' },
  { name: 'Pink', value: '#d28383' },
];

// 🧩 Zod Schema
const TemplateSchema = z.object({
  backgroundColor: z.string(),
  showGrid: z.boolean(),
  showMargins: z.boolean(),
  backgroundFile: z
    .instanceof(File)
    .or(z.null())
    .or(z.undefined())
    .transform((f) => f ?? null),
  pictureFile: z
    .instanceof(File)
    .or(z.null())
    .or(z.undefined())
    .transform((f) => f ?? null),
});

type TemplateFormValues = z.infer<typeof TemplateSchema>;

export function Editor() {
  const { setBgColor, pictureTemplate, setPictureTemplate, addPicture, setBgPicture } =
    useEditorStore((state) => state);

  // 🧠 Initialize form
  const form = useForm<TemplateFormValues>({
    resolver: zodResolver(TemplateSchema) as any,
    defaultValues: {
      backgroundColor: '#FFFFFF',
      showGrid: true,
      showMargins: true,
      backgroundFile: null,
      pictureFile: null,
    },
  });

  const [backgroundColor, backgroundFile] = form.watch(['backgroundColor', 'backgroundFile']);

  // Todo: find the base64, just store it then upload in aws-amplify then use it in the app.
  console.log(backgroundFile)

  useEffect(() => {
    setBgPicture({
      id: 'bg-picture',
      x: 0,
      y: 0,
      width: 0,
      height: 0
    });
  }, [backgroundColor, setBgColor]);

  // 🔄 Update Zustand background color whenever form value changes
  useEffect(() => {
    setBgColor(backgroundColor);
  }, [backgroundColor, setBgColor]);

  // 📸 Handle image uploads from form-controlled file inputs
  const handleFileRead = (
    file: File,
    isBackground: boolean
  ) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      if (isBackground) {
        const bgPic = pictureTemplate.find((p) => p.id === 'pic-background');
        if (bgPic) {
          setBgPicture({ ...bgPic, src: dataUrl });
          setPictureTemplate(
            pictureTemplate.map((p) =>
              p.id === 'pic-background' ? { ...p, src: dataUrl } : p
            )
          );
        }
      } else {
        const newPicture = {
          id: `pic-${Date.now()}`,
          x: 100,
          y: 100,
          width: 200,
          height: 200,
          src: dataUrl,
          label: 'New Picture',
        };
        addPicture(newPicture);
      }
    };
    reader.readAsDataURL(file);
  };

  // 🧾 On Submit
  const onSubmit = (values: TemplateFormValues) => {
    if (values.backgroundFile) handleFileRead(values.backgroundFile, true);
    if (values.pictureFile) handleFileRead(values.pictureFile, false);
    console.log('✅ Template Saved:', values);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="!min-h-screen overflow-hidden flex flex-col bg-white"
      >
        {/* Header */}
        <header className="z-50 bg-white border-b border-gray-300 py-4">
          <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
            <div className="text-black font-medium">Photoble Editor</div>
            <div className="flex gap-3">
              <Button
                type="submit"
                variant="outline"
                className="rounded-lg border-gray-300 text-black hover:bg-gray-100"
              >
                Save Template
              </Button>
              <Button
                type="button"
                className="rounded-lg bg-black text-white hover:bg-gray-800"
              >
                Export
              </Button>
            </div>
          </div>
        </header>

        {/* Main Editor Area */}
        <div className="flex-1 flex min-h-full">
          {/* Left Toolbar */}
          <aside className="z-50 w-64 border-r border-gray-300 p-6 bg-white overflow-y-auto">
            <div className="space-y-6">
              {/* Background Color */}
              <FormField
                control={form.control}
                name="backgroundColor"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-black mb-3 font-semibold">
                      Background
                    </FormLabel>
                    <div className="grid grid-cols-4 gap-2 mb-4">
                      {COLORS.map((color) => (
                        <button
                          key={color.value}
                          type="button"
                          onClick={() => field.onChange(color.value)}
                          className="w-12 h-12 rounded-lg border-2 hover:scale-105 transition-transform"
                          style={{
                            backgroundColor: color.value,
                            borderColor:
                              field.value === color.value
                                ? '#000000'
                                : '#D1D5DB',
                          }}
                          title={color.name}
                        />
                      ))}
                    </div>

                    {/* Background File Upload */}
                    <FormField
                      control={form.control}
                      name="backgroundFile"
                      render={({ field: { onChange } }) => (
                        <FormControl>
                          <Button
                            variant="outline"
                            size="sm"
                            type="button"
                            className="flex-1 w-full"
                            onClick={() => {
                              const input = document.createElement('input');
                              input.type = 'file';
                              input.accept = 'image/*';
                              input.onchange = (e: any) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                  onChange(file);
                                  handleFileRead(file, true);
                                }
                              };
                              input.click();
                            }}
                          >
                            <Upload className="w-4 h-4 mr-2" />
                            Upload Background
                          </Button>
                        </FormControl>
                      )}
                    />
                  </FormItem>
                )}
              />

              {/* Add Picture */}
              <FormField
                control={form.control}
                name="pictureFile"
                render={({ field: { onChange } }) => (
                  <FormItem>
                    <FormLabel className="text-black mb-3 font-semibold">
                      Pictures
                    </FormLabel>
                    <FormControl>
                      <Button
                        variant="outline"
                        size="sm"
                        type="button"
                        className="flex-1 w-full"
                        onClick={() => {
                          const input = document.createElement('input');
                          input.type = 'file';
                          input.accept = 'image/*';
                          input.onchange = (e: any) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              onChange(file);
                              handleFileRead(file, false);
                            }
                          };
                          input.click();
                        }}
                      >
                        <Upload className="w-4 h-4 mr-2" />
                        Upload Picture
                      </Button>
                    </FormControl>
                  </FormItem>
                )}
              />

              {/* Grid + Margins */}
              <FormField
                control={form.control}
                name="showGrid"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-black mb-3 font-semibold">
                      View
                    </FormLabel>
                    <label className="flex items-center gap-2 cursor-pointer mb-3">
                      <input
                        type="checkbox"
                        checked={field.value}
                        onChange={field.onChange}
                        className="w-4 h-4 rounded border-gray-300"
                      />
                      <span className="text-black">Show Grid</span>
                    </label>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="showMargins"
                render={({ field }) => (
                  <FormItem>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={field.value}
                        onChange={field.onChange}
                        className="w-4 h-4 rounded border-gray-300"
                      />
                      <span className="text-black">Show Margins</span>
                    </label>
                  </FormItem>
                )}
              />
            </div>
          </aside>

          {/* Canvas */}
          <main className="max-h-full flex-1 bg-gray-100">
            <div className="max-w-4xl mx-auto">
              <Canvas />
            </div>
          </main>
        </div>
      </form>
    </Form>
  );
}
