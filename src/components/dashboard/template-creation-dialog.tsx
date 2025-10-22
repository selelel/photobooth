import { useState } from 'react';
import { Upload } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface CreateTemplateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function CreateTemplateDialog({ open, onOpenChange }: CreateTemplateDialogProps) {
  const [templateName, setTemplateName] = useState('');
  const [photoCount, setPhotoCount] = useState('1x');
  const [eventName, setEventName] = useState('');
  const [logoFile, setLogoFile] = useState<File | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log({
      templateName,
      photoCount,
      eventName,
      logoFile,
    });
    setTemplateName('');
    setPhotoCount('1x');
    setEventName('');
    setLogoFile(null);
    onOpenChange(false);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setLogoFile(e.target.files[0]);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md h-[80vh] flex flex-col overflow-hidden">
        <DialogHeader className="shrink-0">
          <DialogTitle>Create New Template</DialogTitle>
        </DialogHeader>

        {/* Scrollable section */}
        <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden">
          <div className="flex-1 overflow-y-auto space-y-6 pr-2">
            {/* Template Name */}
            <div className="space-y-2">
              <Label htmlFor="templateName" className="text-black">Template Name</Label>
              <Input
                id="templateName"
                type="text"
                placeholder="e.g. Wedding Classic"
                value={templateName}
                onChange={(e) => setTemplateName(e.target.value)}
                required
              />
            </div>

            {/* Photo Count */}
            <div className="space-y-3">
              <Label className="text-black">Number of Photos</Label>
              <RadioGroup value={photoCount} onValueChange={setPhotoCount}>
                {['1x', '2x', '3x', '4x'].map((value) => (
                  <div key={value} className="flex items-center space-x-2">
                    <RadioGroupItem value={value} id={value} />
                    <Label htmlFor={value}>{value.replace('x', '')} photo{value !== '1x' && 's'}</Label>
                  </div>
                ))}
              </RadioGroup>
            </div>

            {/* Orientation */}
            <div className="space-y-3">
              <Label className="text-black">Orientation</Label>
              <RadioGroup>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="portrait" id="portrait" />
                  <Label htmlFor="portrait">Portrait</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="landscape" id="landscape" />
                  <Label htmlFor="landscape">Landscape</Label>
                </div>
              </RadioGroup>
            </div>

            {/* Event Name */}
            <div className="space-y-2">
              <Label htmlFor="eventName" className="text-black">Event Name</Label>
              <Input
                id="eventName"
                type="text"
                placeholder="e.g. Sarah & John's Wedding"
                value={eventName}
                onChange={(e) => setEventName(e.target.value)}
                required
              />
            </div>

            {/* Event Logo */}
            <div className="space-y-2">
              <Label className="text-black">Event Logo (Optional)</Label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                <input
                  id="logo"
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <label htmlFor="logo" className="cursor-pointer">
                  <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                  {logoFile ? (
                    <p className="text-black">{logoFile.name}</p>
                  ) : (
                    <>
                      <p className="text-gray-600">Click to upload logo</p>
                      <p className="text-gray-400 mt-1">PNG, JPG, SVG</p>
                    </>
                  )}
                </label>
              </div>
            </div>

            {/* Background */}
            <div className="space-y-2">
              <Label className="text-black">Background</Label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                <input
                  id="background"
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <label htmlFor="background" className="cursor-pointer">
                  <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                  {logoFile ? (
                    <p className="text-black">{logoFile.name}</p>
                  ) : (
                    <>
                      <p className="text-gray-600">Click to upload background</p>
                      <p className="text-gray-400 mt-1">PNG, JPG, SVG</p>
                    </>
                  )}
                </label>
              </div>
            </div>
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
      </DialogContent>
    </Dialog>
  );
}