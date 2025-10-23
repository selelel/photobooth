import { createFileRoute } from '@tanstack/react-router';
import { Editor } from '../../components/editor-poc/Editor';

// 🧭 Route definition
export const Route = createFileRoute('/test/editor')({
  component: RouteComponent,
});

// 🖼️ Main Editor Component
function RouteComponent() {
  return <Editor />;
}