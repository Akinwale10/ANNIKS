import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import Admin from "@/pages/Admin";
import About from "@/pages/About";
import Blog from "@/pages/Blog";
import Category from "@/pages/Category";
import Contact from "@/pages/Contact";
import Product from "@/pages/Product";
import Services from "@/pages/Services";
import Shop from "@/pages/Shop";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";

function Router() {
  return <Switch>
    <Route path="/" component={Home} />
    <Route path="/shop" component={Shop} />
    <Route path="/food" component={Category} />
    <Route path="/shades" component={Category} />
    <Route path="/perfumes" component={Category} />
    <Route path="/product/:slug" component={Product} />
    <Route path="/services" component={Services} />
    <Route path="/about" component={About} />
    <Route path="/blog" component={Blog} />
    <Route path="/contact" component={Contact} />
    <Route path="/admin" component={Admin} />
    <Route path="/404" component={NotFound} />
    <Route component={NotFound} />
  </Switch>;
}

function App() {
  return <ErrorBoundary><ThemeProvider defaultTheme="light"><TooltipProvider><Toaster /><Router /></TooltipProvider></ThemeProvider></ErrorBoundary>;
}

export default App;
