import React, { useState, useEffect } from 'react';
import { Box, Heading, SimpleGrid, useToast, Tabs, TabList, TabPanels, Tab, TabPanel } from '@chakra-ui/react';
import { Stat, StatLabel, StatNumber, StatHelpText } from '@chakra-ui/stat';
import axios from 'axios';
import PropertyApproval from './PropertyApproval';
import BookingHistory from './BookingHistory';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalProperties: 0,
    totalUsers: 0,
    totalBookings: 0
  });
  const [loading, setLoading] = useState(true);
  const toast = useToast();

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [propertiesRes, usersRes, bookingsRes] = await Promise.all([
        axios.get('/api/properties'),
        axios.get('/api/users'),
        axios.get('/api/bookings/admin')
      ]);

      setStats({
        totalProperties: propertiesRes.data.length,
        totalUsers: usersRes.data.length,
        totalBookings: bookingsRes.data.length
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch dashboard statistics',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box p={5}>
        <Heading mb={6}>Admin Dashboard</Heading>
        <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6}>
          <Stat p={5} shadow="md" borderWidth="1px" borderRadius="lg">
            <StatLabel>Loading...</StatLabel>
          </Stat>
        </SimpleGrid>
      </Box>
    );
  }

  return (
    <Box p={5}>
      <Heading mb={6}>Admin Dashboard</Heading>
      <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6} mb={8}>
        <Stat p={5} shadow="md" borderWidth="1px" borderRadius="lg">
          <StatLabel>Total Properties</StatLabel>
          <StatNumber>{stats.totalProperties}</StatNumber>
          <StatHelpText>Properties listed</StatHelpText>
        </Stat>
        <Stat p={5} shadow="md" borderWidth="1px" borderRadius="lg">
          <StatLabel>Total Users</StatLabel>
          <StatNumber>{stats.totalUsers}</StatNumber>
          <StatHelpText>Registered users</StatHelpText>
        </Stat>
        <Stat p={5} shadow="md" borderWidth="1px" borderRadius="lg">
          <StatLabel>Total Bookings</StatLabel>
          <StatNumber>{stats.totalBookings}</StatNumber>
          <StatHelpText>Active bookings</StatHelpText>
        </Stat>
      </SimpleGrid>

      <Tabs>
        <TabList>
          <Tab>Property Approval</Tab>
          <Tab>Booking History</Tab>
        </TabList>

        <TabPanels>
          <TabPanel>
            <PropertyApproval />
          </TabPanel>
          <TabPanel>
            <BookingHistory />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  );
};

export default AdminDashboard; 