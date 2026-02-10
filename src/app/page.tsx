import FileDropzone from '@/components/FileDropzone';
import { Button } from '@/components/ui/Button';

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-2xl space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl">
            Lingua
          </h1>
          <p className="text-lg text-gray-500">
            Translate your files into any format, instantly.
          </p>
        </div>

        <div className="bg-white shadow-xl rounded-2xl p-8 space-y-8">
          <FileDropzone />

          <div className="flex justify-end pt-4">
            <Button disabled>
              Translate File
            </Button>
          </div>
        </div>
      </div>
    </main>
  );
}
