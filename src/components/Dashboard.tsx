import { Table, Badge, Title, Paper, Container, Tooltip, Text, Group, LoadingOverlay, Tabs } from '@mantine/core';
import { useCollection } from '../hooks/useCollection';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faPhone } from '@fortawesome/free-solid-svg-icons';
import { useState, useMemo } from 'react';

interface Visit {
  id?: string;
  employeeNumber: string;
  name: string;
  department: string;
  employeeEmail: string;
  employeePhone: string;
  visitorName: string;
  profession: string;
  visitorPhone: string;
  date: string;
  time: string;
  idNumber: string;
  createdAt: string;
}

const Dashboard = () => {
  const { documents: visits, error, isLoading } = useCollection<Visit>('visits');
  const [activeTab, setActiveTab] = useState('today');

  const getStatusColor = (department: string) => {
    const colors = {
      'IT': 'blue',
      'HR': 'green',
      'Finance': 'yellow',
      'Marketing': 'orange',
      'Sales': 'cyan',
    };
    return colors[department as keyof typeof colors] || 'gray';
  };

  const filteredVisits = useMemo(() => {
    if (!visits) return [];
    
    if (activeTab === 'today') {
      const today = new Date().toISOString().split('T')[0];
      return visits.filter(visit => visit.date === today);
    }
    
    return visits;
  }, [visits, activeTab]);

  if (isLoading) {
    return (
      <Container size="xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Title order={2} mb="xl">Recent Visits</Title>
          <Paper shadow="sm" radius="md" p="md" withBorder pos="relative">
            <LoadingOverlay visible={true} overlayProps={{ blur: 2 }} />
          </Paper>
        </motion.div>
      </Container>
    );
  }

  if (error) {
    return (
      <Container size="xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Title order={2} mb="xl">Recent Visits</Title>
          <Paper shadow="sm" radius="md" p="md" withBorder>
            <Text c="red" size="sm">An error occurred while fetching visits</Text>
          </Paper>
        </motion.div>
      </Container>
    );
  }

  return (
    <Container size="xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Title order={2} mb="xl">Recent Visits</Title>
        <Paper shadow="sm" radius="md" p="md" withBorder pos="relative">
          <LoadingOverlay visible={false} overlayProps={{ blur: 2 }} />
          <Tabs value={activeTab} onChange={(value) => setActiveTab(value as string)} mb="md">
            <Tabs.List>
              <Tabs.Tab value="today">Today's Visits</Tabs.Tab>
              <Tabs.Tab value="all">All Visits</Tabs.Tab>
            </Tabs.List>
          </Tabs>
          <Table striped highlightOnHover>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Employee</Table.Th>
                <Table.Th>Contact</Table.Th>
                <Table.Th>Department</Table.Th>
                <Table.Th>Visitor</Table.Th>
                <Table.Th>Visitor Contact</Table.Th>
                <Table.Th>Date & Time</Table.Th>
                <Table.Th>ID Number</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {filteredVisits?.map((visit: Visit) => (
                <motion.tr
                  key={visit.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <Table.Td>
                    <Text fw={500}>{visit.name || 'N/A'}</Text>
                    <Text size="xs" c="dimmed">#{visit.employeeNumber || 'N/A'}</Text>
                  </Table.Td>
                  <Table.Td>
                    {visit.employeeEmail && (
                      <Tooltip label={visit.employeeEmail}>
                        <Group gap="xs">
                          <FontAwesomeIcon icon={faEnvelope} size="1x" />
                          <Text size="sm" style={{ textDecoration: 'underline' }}>
                            {visit.employeeEmail.split('@')[0]}
                          </Text>
                        </Group>
                      </Tooltip>
                    )}
                    {visit.employeePhone && (
                      <Group gap="xs" mt={4}>
                        <FontAwesomeIcon icon={faPhone} size="1x" />
                        <Text size="sm">{visit.employeePhone}</Text>
                      </Group>
                    )}
                  </Table.Td>
                  <Table.Td>
                    <Badge color={getStatusColor(visit.department || '')}>
                      {visit.department || 'N/A'}
                    </Badge>
                  </Table.Td>
                  <Table.Td>
                    <Text fw={500}>{visit.visitorName || 'N/A'}</Text>
                    <Text size="xs" c="dimmed">{visit.profession || 'N/A'}</Text>
                  </Table.Td>
                  <Table.Td>
                    {visit.visitorPhone && (
                      <Group gap="xs">
                        <FontAwesomeIcon icon={faPhone} size="1x" />
                        <Text size="sm">{visit.visitorPhone}</Text>
                      </Group>
                    )}
                  </Table.Td>
                  <Table.Td>
                    <Text>{visit.date || 'N/A'}</Text>
                    <Text size="xs" c="dimmed">{visit.time || 'N/A'}</Text>
                  </Table.Td>
                  <Table.Td>
                    <Text tt="uppercase" fontFamily="monospace">{visit.idNumber || 'N/A'}</Text>
                  </Table.Td>
                </motion.tr>
              ))}
              {filteredVisits?.length === 0 && (
                <Table.Tr>
                  <Table.Td colSpan={7} style={{ textAlign: 'center' }}>
                    <Text c="dimmed">No visits found</Text>
                  </Table.Td>
                </Table.Tr>
              )}
            </Table.Tbody>
          </Table>
        </Paper>
      </motion.div>
    </Container>
  );
};

export default Dashboard;
