import { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  HStack,
  Button,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Badge,
  useToast,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Spinner,
  Center,
  Alert,
  AlertIcon,
} from '@chakra-ui/react';
import axios from 'axios';

const OwnerBookings = () => {
  const [pendingBookings, setPendingBookings] = useState([]);
  const [confirmedBookings, setConfirmedBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const toast = useToast();

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get('/api/bookings/owner');
      const bookings = response.data;
      
      // Separate bookings into pending and confirmed
      const pending = bookings.filter(booking => booking.status === 'pending');
      const confirmed = bookings.filter(booking => booking.status === 'confirmed');
      
      setPendingBookings(pending);
      setConfirmedBookings(confirmed);
    } catch (error) {
      console.error('Error fetching bookings:', error);
      setError(error.response?.data?.message || 'Failed to fetch bookings');
      toast({
        title: 'Error fetching bookings',
        description: error.response?.data?.message || 'Something went wrong',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleBookingAction = async (bookingId, action) => {
    try {
      await axios.put(`/api/bookings/${bookingId}/${action}`);
      toast({
        title: `Booking ${action}ed successfully`,
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      fetchBookings(); // Refresh the bookings list
    } catch (error) {
      console.error(`Error ${action}ing booking:`, error);
      toast({
        title: `Error ${action}ing booking`,
        description: error.response?.data?.message || 'Something went wrong',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'yellow';
      case 'confirmed':
        return 'green';
      case 'cancelled':
        return 'red';
      default:
        return 'gray';
    }
  };

  const BookingTable = ({ bookings }) => (
    <Table variant="simple">
      <Thead>
        <Tr>
          <Th>Property</Th>
          <Th>Client</Th>
          <Th>Check-in</Th>
          <Th>Check-out</Th>
          <Th>Status</Th>
          <Th>Actions</Th>
        </Tr>
      </Thead>
      <Tbody>
        {bookings.map((booking) => (
          <Tr key={booking._id}>
            <Td>{booking.property?.name || 'N/A'}</Td>
            <Td>{booking.client?.name || 'N/A'}</Td>
            <Td>{new Date(booking.checkInDate).toLocaleDateString()}</Td>
            <Td>{new Date(booking.checkOutDate).toLocaleDateString()}</Td>
            <Td>
              <Badge colorScheme={getStatusColor(booking.status)}>
                {booking.status}
              </Badge>
            </Td>
            <Td>
              {booking.status === 'pending' && (
                <HStack spacing={2}>
                  <Button
                    size="sm"
                    colorScheme="green"
                    onClick={() => handleBookingAction(booking._id, 'confirm')}
                  >
                    Confirm
                  </Button>
                  <Button
                    size="sm"
                    colorScheme="red"
                    onClick={() => handleBookingAction(booking._id, 'cancel')}
                  >
                    Cancel
                  </Button>
                </HStack>
              )}
            </Td>
          </Tr>
        ))}
      </Tbody>
    </Table>
  );

  if (loading) {
    return (
      <Center h="100vh">
        <Spinner size="xl" />
      </Center>
    );
  }

  if (error) {
    return (
      <Container maxW="container.xl" py={10}>
        <Alert status="error">
          <AlertIcon />
          {error}
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxW="container.xl" py={10}>
      <VStack spacing={8} align="stretch">
        <Heading>My Bookings</Heading>

        <Tabs variant="enclosed">
          <TabList>
            <Tab>Pending Requests ({pendingBookings.length})</Tab>
            <Tab>Confirmed Bookings ({confirmedBookings.length})</Tab>
          </TabList>

          <TabPanels>
            <TabPanel>
              {pendingBookings.length === 0 ? (
                <Text>No pending booking requests</Text>
              ) : (
                <BookingTable bookings={pendingBookings} />
              )}
            </TabPanel>
            <TabPanel>
              {confirmedBookings.length === 0 ? (
                <Text>No confirmed bookings</Text>
              ) : (
                <BookingTable bookings={confirmedBookings} />
              )}
            </TabPanel>
          </TabPanels>
        </Tabs>
      </VStack>
    </Container>
  );
};

export default OwnerBookings; 