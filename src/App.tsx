
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import ArchivePage from "./pages/ArchivePage";
import ArchiveItemPage from "./pages/ArchiveItemPage";
import NewsPage from "./pages/NewsPage";
import AdminPage from "./pages/AdminPage";
import FaqPage from "./pages/FaqPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/archive" element={<ArchivePage />} />
          <Route path="/archive/:slug" element={<ArchiveItemPage />} />
          <Route path="/news/:slug" element={<NewsPage />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/faq" element={<FaqPage />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;