import { Link, useLocation } from "wouter";
import { motion } from "framer-motion";

export function Navigation() {
  const [location] = useLocation();

  const navItems = [
    { path: "/", icon: "fas fa-home", label: "Home" },
    { path: "/trends", icon: "fas fa-chart-line", label: "Trends" },
    { path: "/journal", icon: "fas fa-book", label: "Journal" },
    { path: "/profile", icon: "fas fa-user", label: "Profile" },
  ];

  return (
    <nav className="fixed bottom-0 left-1/2 transform -translate-x-1/2 w-full max-w-md bg-white border-t border-gray-200 safe-area-bottom z-50">
      <div className="flex justify-around py-2">
        {navItems.map((item) => {
          const isActive = location === item.path;
          
          return (
            <Link key={item.path} href={item.path}>
              <motion.div
                whileTap={{ scale: 0.95 }}
                className={`flex flex-col items-center py-2 px-4 transition-colors ${
                  isActive ? 'text-primary' : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                <i className={`${item.icon} text-lg mb-1`}></i>
                <span className={`text-xs ${isActive ? 'font-medium' : ''}`}>
                  {item.label}
                </span>
                {isActive && (
                  <motion.div
                    layoutId="tab-indicator"
                    className="w-6 h-0.5 bg-primary rounded-full mt-1"
                    initial={false}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  />
                )}
              </motion.div>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

