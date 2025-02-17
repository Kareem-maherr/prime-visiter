import { useEffect, useState } from 'react';
import { AppShell, Container, Title, Group, Button, Image, rem } from '@mantine/core';
import { auth } from './config/firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignInAlt, faSignOutAlt, faTable } from '@fortawesome/free-solid-svg-icons';
import { motion, AnimatePresence } from 'framer-motion';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import VisitForm from './components/VisitForm';
import logo from './assets/logo.svg';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentView, setCurrentView] = useState<'home' | 'admin' | 'dashboard'>('home');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsAuthenticated(!!user);
      if (user) {
        setCurrentView('dashboard');
      } else if (currentView === 'dashboard') {
        setCurrentView('home');
      }
    });

    return () => unsubscribe();
  }, [currentView]);

  const handleLogout = () => {
    signOut(auth);
  };

  const handleAdminClick = () => {
    setCurrentView('admin');
  };

  const handleHomeClick = () => {
    setCurrentView('home');
  };

  return (
    <AppShell
      header={{ height: 70 }}
    >
      <AppShell.Header p="md">
        <Container size="lg">
          <Group justify="space-between">
            <Group 
              gap="xs" 
              style={{ cursor: 'pointer' }} 
              onClick={handleHomeClick}
            >
              <motion.div
                initial={{ rotate: -180, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <Image src={logo} w={rem(40)} />
              </motion.div>
              <Title order={1} size="h2">Prime Visitor</Title>
            </Group>
            <Group>
              {isAuthenticated ? (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                >
                  <Group>
                    <Button
                      variant="light"
                      onClick={() => setCurrentView('dashboard')}
                      leftSection={<FontAwesomeIcon icon={faTable} size="1x" />}
                    >
                      View Visits
                    </Button>
                    <Button
                      onClick={handleLogout}
                      variant="subtle"
                      color="red"
                      leftSection={<FontAwesomeIcon icon={faSignOutAlt} size="1x" />}
                    >
                      Logout
                    </Button>
                  </Group>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                >
                  <Button
                    onClick={handleAdminClick}
                    variant="light"
                    leftSection={<FontAwesomeIcon icon={faSignInAlt} size="1x" />}
                  >
                    Front Office Login
                  </Button>
                </motion.div>
              )}
            </Group>
          </Group>
        </Container>
      </AppShell.Header>

      <AppShell.Main>
        <Container size="lg" py="xl">
          <AnimatePresence mode="wait">
            {currentView === 'admin' && !isAuthenticated ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <Login />
              </motion.div>
            ) : currentView === 'dashboard' && isAuthenticated ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <Dashboard />
              </motion.div>
            ) : (
              <VisitForm />
            )}
          </AnimatePresence>
        </Container>
      </AppShell.Main>
    </AppShell>
  );
}

export default App;
