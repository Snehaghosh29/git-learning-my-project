import React, { useState, useEffect } from 'react';
import {
  Box,
  Heading,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  useToast,
  Badge,
  Text,
  Select
} from '@chakra-ui/react';
import axios from 'axios';

const BookingHistory = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const toast = useToast();

  useEffect(() => {
    fetchBookings();
  }, [filter]);

  const fetchBookings = async () => {
    try {
      const url = filter === 'all' 
        ? '/api/bookings/admin'
        : `/api/bookings/admin?status=${filter}`;
      const response = await axios.get(url);
      setBookings(response.data);
    } catch (error) {
      console.error('Error fetching bookings:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch bookings',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed':
        return 'green';
      case 'pending':
        return 'yellow';
      case 'cancelled':
        return 'red';
      default:
        return 'gray';
    }
  };

  if (loading) {
    return <Box p={5}>Loading...</Box>;
  }

  return (
    <Box p={5}>
      <Heading mb={6}>Booking History</Heading>
      
      <Select
        mb={4}
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
        width="200px"
      >
        <option value="all">All Bookings</option>
        <option value="pending">Pending</option>
        <option value="confirmed">Confirmed</option>
        <option value="cancelled">Cancelled</option>
      </Select>

      <Table variant="simple">
        <Thead>
          <Tr>
            <Th>Property</Th>
            <Th>Client</Th>
            <Th>Check In</Th>
            <Th>Check Out</Th>
            <Th>Total Amount</Th>
            <Th>Status</Th>
          </Tr>
        </Thead>
        <Tbody>
          {bookings.map((booking) => (
            <Tr key={booking._id}>
              <Td>
                <Text fontWeight="bold">{booking.property.name}</Text>
                <Text fontSize="sm" color="gray.600">
                  {booking.property.location}
                </Text>
              </Td>
              <Td>
                <Text>{booking.user.name}</Text>
                <Text fontSize="sm" color="gray.600">
                  {booking.user.email}
                </Text>
              </Td>
              <Td>{new Date(booking.checkIn).toLocaleDateString()}</Td>
              <Td>{new Date(booking.checkOut).toLocaleDateString()}</Td>
              <Td>₹{booking.totalAmount}</Td>
              <Td>
                <Badge colorScheme={getStatusColor(booking.status)}>
                  {booking.status}
                </Badge>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Box>
  );
};

export default BookingHistory; 