import { Modal, Title, Text, Button, Stack, rem } from '@mantine/core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleCheck } from '@fortawesome/free-solid-svg-icons';
import { motion } from 'framer-motion';

interface SuccessModalProps {
  opened: boolean;
  onClose: () => void;
  title: string;
  message: string;
}

const SuccessModal = ({ opened, onClose, title, message }: SuccessModalProps) => {
  return (
    <Modal opened={opened} onClose={onClose} centered size="md" padding="xl">
      <Stack align="center" gap="md">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 260, damping: 20 }}
        >
          <FontAwesomeIcon 
            icon={faCircleCheck} 
            style={{ 
              width: rem(60), 
              height: rem(60), 
              color: 'var(--mantine-color-green-6)' 
            }} 
          />
        </motion.div>
        <Title order={2} ta="center">{title}</Title>
        <Text size="lg" ta="center" c="dimmed">
          {message}
        </Text>
        <Button variant="light" onClick={onClose} size="md">
          Close
        </Button>
      </Stack>
    </Modal>
  );
};

export default SuccessModal;
