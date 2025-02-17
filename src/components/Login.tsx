import { useState } from 'react';
import { TextInput, Button, Paper, Title, Container } from '@mantine/core';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../config/firebase';
import { notifications } from '@mantine/notifications';
import { motion } from 'framer-motion';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      notifications.show({
        title: 'Success',
        message: 'Logged in successfully',
        color: 'green',
      });
    } catch (error) {
      notifications.show({
        title: 'Error',
        message: 'Invalid credentials',
        color: 'red',
      });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      <Container size="xs" mt="xl">
        <Paper radius="md" p="xl" withBorder>
          <Title order={2} ta="center" mb="lg">
            Front Desk Login
          </Title>
          <form onSubmit={handleLogin}>
            <TextInput
              label="Email"
              placeholder="your@email.com"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              mb="md"
            />
            <TextInput
              label="Password"
              type="password"
              placeholder="Your password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              mb="xl"
            />
            <Button type="submit" fullWidth>
              Login
            </Button>
          </form>
        </Paper>
      </Container>
    </motion.div>
  );
};

export default Login;
