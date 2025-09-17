import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { FlaskConical, Upload, Search, BarChart3 } from 'lucide-react';

const Navbar = () => {
  const location = useLocation();

  const navItems = [
    { path: '/upload', label: 'Upload Data', icon: Upload },
    { path: '/search', label: 'Search Gene', icon: Search },
    { path: '/dashboard', label: 'Dashboard', icon: BarChart3 },
  ];

  return (
    <nav className="bg-card border-b border-border shadow-scientific">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and title */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="p-2 bg-gradient-to-br from-primary to-secondary rounded-lg shadow-scientific">
              <FlaskConical className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors">
                Gene Expression Explorer
              </h1>
              <p className="text-sm text-muted-foreground">Bioinformatics Data Analysis</p>
            </div>
          </Link>

          {/* Navigation links */}
          <div className="flex space-x-1">
            {navItems.map(({ path, label, icon: Icon }) => {
              const isActive = location.pathname === path;
              return (
                <Link
                  key={path}
                  to={path}
                  className={cn(
                    'flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all',
                    isActive
                      ? 'bg-primary text-primary-foreground shadow-scientific'
                      : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                  )}
                >
                  <Icon className="h-4 w-4" />
                  <span>{label}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;