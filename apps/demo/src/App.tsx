import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'sonner';
import { DemoApp } from '@/app/App';
import '@/App.css';

// The demo console is the root application. The legacy component-library browser
// (Layout + Home + the ~50 *Demo routes) has been folded into the console's
// spec-driven Catalog and Foundations sections — see src/app/App.tsx.
function App() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <Toaster position="top-right" />
      <DemoApp />
    </BrowserRouter>
  );
}

export default App;
