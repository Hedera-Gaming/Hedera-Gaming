import { Toaster } from "@/shared/components/ui/toaster";
import { Toaster as Sonner } from "@/shared/components/ui/sonner";
import { TooltipProvider } from "@/shared/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Navigation } from "./shared/components/Navigation";
import { SpaceBackground } from "./shared/components/SpaceBackground";
import Home from "./features/homepage/Home";
import Game from "./features/game/Game";
import Profile from "./features/profile/Profile";
import Marketplace from "./features/marketplace/Marketplace";
import Leaderboard from "./features/leaderboard/Leaderboard";
import Community from "./features/community/Community";
import Contact from "./features/contact/Contact";
import NotFound from "./features/notfound/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <SpaceBackground />
        <Navigation />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/game" element={<Game />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/marketplace" element={<Marketplace />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/community" element={<Community />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
