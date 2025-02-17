import { Table, Badge, Title, Paper, Container, Tooltip, Text, Group, LoadingOverlay, ActionIcon, Tabs, Button, Popover, Stack, Image, rem, AppShell } from '@mantine/core';
import { useCollection } from '../hooks/useCollection';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faPhone, faCheck, faUserCheck, faFilter, faFileExport, faUserXmark, faRotateLeft, faHome, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import { db } from '../config/firebase';
import { doc, updateDoc } from 'firebase/firestore';
import { notifications } from '@mantine/notifications';
import { useState, useMemo } from 'react';
import { DatePickerInput } from '@mantine/dates';
import logo from '../assets/logo.svg';
import { getAuth, signOut } from 'firebase/auth';
import { auth } from '../config/firebase';

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
  arrived?: boolean;
  didNotArrive?: boolean;
}

const Dashboard = () => {
  const { documents: visits, error, isLoading } = useCollection<Visit>('visits');
  const [activeTab, setActiveTab] = useState('today');
  const [filterDate, setFilterDate] = useState<Date | null>(null);
  const [showFilter, setShowFilter] = useState(false);

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

  const handleConfirmArrival = async (visitId: string) => {
    try {
      const visitRef = doc(db, 'visits', visitId);
      await updateDoc(visitRef, {
        arrived: true,
        didNotArrive: false
      });
      notifications.show({
        title: 'Success',
        message: 'Visitor arrival confirmed',
        color: 'green',
      });
    } catch (error) {
      console.error('Error confirming arrival:', error);
      notifications.show({
        title: 'Error',
        message: 'Failed to confirm visitor arrival',
        color: 'red',
      });
    }
  };

  const handleDidNotArrive = async (visitId: string) => {
    try {
      const visitRef = doc(db, 'visits', visitId);
      await updateDoc(visitRef, {
        arrived: false,
        didNotArrive: true
      });
      notifications.show({
        title: 'Updated',
        message: 'Visitor marked as did not arrive',
        color: 'orange',
      });
    } catch (error) {
      console.error('Error updating visitor status:', error);
      notifications.show({
        title: 'Error',
        message: 'Failed to update visitor status',
        color: 'red',
      });
    }
  };

  const handleResetStatus = async (visitId: string) => {
    try {
      const visitRef = doc(db, 'visits', visitId);
      await updateDoc(visitRef, {
        arrived: false,
        didNotArrive: false
      });
      notifications.show({
        title: 'Reset',
        message: 'Visitor status reset',
        color: 'blue',
      });
    } catch (error) {
      console.error('Error resetting visitor status:', error);
      notifications.show({
        title: 'Error',
        message: 'Failed to reset visitor status',
        color: 'red',
      });
    }
  };

  const handleExportCSV = () => {
    if (!filteredVisits.length) {
      notifications.show({
        title: 'No Data',
        message: 'There are no visits to export',
        color: 'yellow',
      });
      return;
    }

    // Define CSV headers
    const headers = [
      'Employee Number',
      'Employee Name',
      'Department',
      'Employee Email',
      'Employee Phone',
      'Visitor Name',
      'Profession',
      'Visitor Phone',
      'ID Number',
      'Date',
      'Time',
      'Status'
    ];

    // Convert visits to CSV rows
    const csvRows = [
      headers.join(','), // Header row
      ...filteredVisits.map(visit => [
        visit.employeeNumber,
        visit.name,
        visit.department,
        visit.employeeEmail,
        visit.employeePhone,
        visit.visitorName,
        visit.profession,
        visit.visitorPhone,
        visit.idNumber || '',
        visit.date,
        visit.time,
        visit.arrived ? 'Arrived' : visit.didNotArrive ? 'Did Not Arrive' : 'Pending'
      ].map(field => `"${field}"`).join(',')) // Wrap fields in quotes to handle commas in data
    ];

    // Create CSV content
    const csvContent = csvRows.join('\n');

    // Create and trigger download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `visits_${filterDate ? filterDate.toISOString().split('T')[0] : 'all'}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    notifications.show({
      title: 'Success',
      message: 'Visits exported successfully',
      color: 'green',
    });
  };

  const filteredVisits = useMemo(() => {
    if (!visits) return [];
    
    if (activeTab === 'today') {
      const today = new Date().toISOString().split('T')[0];
      return visits.filter(visit => visit.date === today);
    }
    
    if (filterDate) {
      const filterDateStr = filterDate.toISOString().split('T')[0];
      return visits.filter(visit => visit.date === filterDateStr);
    }
    
    return visits;
  }, [visits, activeTab, filterDate]);

  const handleClearFilter = () => {
    setFilterDate(null);
    setShowFilter(false);
  };

  if (isLoading) {
    return (
      <AppShell header={{ height: 70 }}>
        <AppShell.Header p="md">
          <Container size="lg">
            <Group justify="space-between">
              <Group gap="xs">
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
                <Button
                  variant="light"
                  onClick={() => window.location.href = '/'}
                  leftSection={<FontAwesomeIcon icon={faHome} size="1x" />}
                >
                  Home
                </Button>
                <Button
                  onClick={() => signOut(auth)}
                  variant="subtle"
                  color="red"
                  leftSection={<FontAwesomeIcon icon={faSignOutAlt} size="1x" />}
                >
                  Logout
                </Button>
              </Group>
            </Group>
          </Container>
        </AppShell.Header>
        <AppShell.Main>
          <Container size="xl" maw={1400}>
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
        </AppShell.Main>
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell header={{ height: 70 }}>
        <AppShell.Header p="md">
          <Container size="lg">
            <Group justify="space-between">
              <Group gap="xs">
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
                <Button
                  variant="light"
                  onClick={() => window.location.href = '/'}
                  leftSection={<FontAwesomeIcon icon={faHome} size="1x" />}
                >
                  Home
                </Button>
                <Button
                  onClick={() => signOut(auth)}
                  variant="subtle"
                  color="red"
                  leftSection={<FontAwesomeIcon icon={faSignOutAlt} size="1x" />}
                >
                  Logout
                </Button>
              </Group>
            </Group>
          </Container>
        </AppShell.Header>
        <AppShell.Main>
          <Container size="xl" maw={1400}>
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
        </AppShell.Main>
      </AppShell>
    );
  }

  return (
    <AppShell header={{ height: 70 }}>
      <AppShell.Header p="md">
        <Container size="lg">
          <Group justify="space-between">
            <Group gap="xs">
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
              <Button
                variant="light"
                onClick={() => window.location.href = '/'}
                leftSection={<FontAwesomeIcon icon={faHome} size="1x" />}
              >
                Home
              </Button>
              <Button
                onClick={() => signOut(auth)}
                variant="subtle"
                color="red"
                leftSection={<FontAwesomeIcon icon={faSignOutAlt} size="1x" />}
              >
                Logout
              </Button>
            </Group>
          </Group>
        </Container>
      </AppShell.Header>
      <AppShell.Main>
        <Container size="xl" maw={1400}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Title order={2} mb="xl">Recent Visits</Title>
            <Paper shadow="sm" radius="md" p="md" withBorder pos="relative">
              <LoadingOverlay visible={false} overlayProps={{ blur: 2 }} />
              <Group justify="space-between" mb="md">
                <Tabs value={activeTab} onChange={(value) => setActiveTab(value as string)}>
                  <Tabs.List>
                    <Tabs.Tab value="today">Today's Visits</Tabs.Tab>
                    <Tabs.Tab value="all">All Visits</Tabs.Tab>
                  </Tabs.List>
                </Tabs>
                {activeTab === 'all' && (
                  <Group>
                    <Popover 
                      opened={showFilter} 
                      onChange={setShowFilter}
                      position="bottom-end"
                    >
                      <Popover.Target>
                        <Button
                          variant="light"
                          leftSection={<FontAwesomeIcon icon={faFilter} />}
                          onClick={() => setShowFilter((o) => !o)}
                        >
                          {filterDate ? filterDate.toLocaleDateString() : 'Filter by Date'}
                        </Button>
                      </Popover.Target>
                      <Popover.Dropdown>
                        <Stack gap="sm">
                          <DatePickerInput
                            label="Select Date"
                            placeholder="Pick a date"
                            value={filterDate}
                            onChange={setFilterDate}
                            clearable
                          />
                          <Group justify="space-between">
                            <Button variant="subtle" color="red" onClick={handleClearFilter}>
                              Clear
                            </Button>
                            <Button onClick={() => setShowFilter(false)}>
                              Apply
                            </Button>
                          </Group>
                        </Stack>
                      </Popover.Dropdown>
                    </Popover>
                    <Button
                      variant="light"
                      color="green"
                      leftSection={<FontAwesomeIcon icon={faFileExport} />}
                      onClick={handleExportCSV}
                    >
                      Export CSV
                    </Button>
                  </Group>
                )}
              </Group>
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
                    <Table.Th>Status</Table.Th>
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
                        <Text tt="uppercase" ff="monospace">{visit.idNumber || 'N/A'}</Text>
                      </Table.Td>
                      <Table.Td style={{ minWidth: '200px' }}>
                        {visit.arrived ? (
                          <Group gap="xs">
                            <Badge color="green" leftSection={<FontAwesomeIcon icon={faUserCheck} size="1x" />}>
                              Arrived
                            </Badge>
                            <Tooltip label="Reset Status">
                              <ActionIcon 
                                variant="light" 
                                color="gray" 
                                onClick={() => visit.id && handleResetStatus(visit.id)}
                                size="sm"
                              >
                                <FontAwesomeIcon icon={faRotateLeft} size="1x" />
                              </ActionIcon>
                            </Tooltip>
                          </Group>
                        ) : visit.didNotArrive ? (
                          <Group gap="xs">
                            <Badge color="red" leftSection={<FontAwesomeIcon icon={faUserXmark} size="1x" />}>
                              Did Not Arrive
                            </Badge>
                            <Tooltip label="Reset Status">
                              <ActionIcon 
                                variant="light" 
                                color="gray" 
                                onClick={() => visit.id && handleResetStatus(visit.id)}
                                size="sm"
                              >
                                <FontAwesomeIcon icon={faRotateLeft} size="1x" />
                              </ActionIcon>
                            </Tooltip>
                          </Group>
                        ) : (
                          <Group gap="xs">
                            <Tooltip label="Confirm Arrival">
                              <ActionIcon 
                                variant="light" 
                                color="blue" 
                                onClick={() => visit.id && handleConfirmArrival(visit.id)}
                                size="lg"
                              >
                                <FontAwesomeIcon icon={faCheck} size="1x" />
                              </ActionIcon>
                            </Tooltip>
                            <Tooltip label="Did Not Arrive">
                              <ActionIcon 
                                variant="light" 
                                color="red" 
                                onClick={() => visit.id && handleDidNotArrive(visit.id)}
                                size="lg"
                              >
                                <FontAwesomeIcon icon={faUserXmark} size="1x" />
                              </ActionIcon>
                            </Tooltip>
                          </Group>
                        )}
                      </Table.Td>
                    </motion.tr>
                  ))}
                  {filteredVisits?.length === 0 && (
                    <Table.Tr>
                      <Table.Td colSpan={8} style={{ textAlign: 'center' }}>
                        <Text c="dimmed">No visits found</Text>
                      </Table.Td>
                    </Table.Tr>
                  )}
                </Table.Tbody>
              </Table>
            </Paper>
          </motion.div>
        </Container>
      </AppShell.Main>
    </AppShell>
  );
};

export default Dashboard;
