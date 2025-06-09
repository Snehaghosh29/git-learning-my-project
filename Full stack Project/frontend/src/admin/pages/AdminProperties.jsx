import { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  HStack,
  Button,
  SimpleGrid,
  Card,
  CardBody,
  CardHeader,
  CardFooter,
  Badge,
  Image,
  useToast,
  Spinner,
  Center,
  Alert,
  AlertIcon,
} from '@chakra-ui/react';
import axios from 'axios';

const AdminProperties = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const toast = useToast();

  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get('/api/properties');
      setProperties(response.data);
    } catch (error) {
      console.error('Error fetching properties:', error);
      setError(error.response?.data?.message || 'Failed to fetch properties');
      toast({
        title: 'Error fetching properties',
        description: error.response?.data?.message || 'Something went wrong',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleApproveProperty = async (propertyId) => {
    try {
      await axios.put(`/api/properties/${propertyId}/approve`);
      toast({
        title: 'Property approved',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      fetchProperties(); // Refresh the properties list
    } catch (error) {
      console.error('Error approving property:', error);
      toast({
        title: 'Error approving property',
        description: error.response?.data?.message || 'Something went wrong',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleRejectProperty = async (propertyId) => {
    try {
      await axios.put(`/api/properties/${propertyId}/reject`);
      toast({
        title: 'Property rejected',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      fetchProperties(); // Refresh the properties list
    } catch (error) {
      console.error('Error rejecting property:', error);
      toast({
        title: 'Error rejecting property',
        description: error.response?.data?.message || 'Something went wrong',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

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
        <Heading>Manage Properties</Heading>

        {properties.length === 0 ? (
          <Text>No properties found.</Text>
        ) : (
          <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
            {properties.map((property) => (
              <Card key={property._id}>
                <CardHeader>
                  <Heading size="md">{property.name}</Heading>
                </CardHeader>
                <CardBody>
                  <VStack align="stretch" spacing={4}>
                    <Box>
                      {property.images && property.images.length > 0 ? (
                        <Image
                          src={property.images[0]}
                          alt={property.name}
                          borderRadius="lg"
                          height="200px"
                          width="100%"
                          objectFit="cover"
                          fallbackSrc="https://via.placeholder.com/300x200?text=No+Image"
                        />
                      ) : (
                        <Box
                          height="200px"
                          width="100%"
                          bg="gray.100"
                          display="flex"
                          alignItems="center"
                          justifyContent="center"
                          borderRadius="lg"
                        >
                          <Text color="gray.500">No Image Available</Text>
                        </Box>
                      )}
                    </Box>
                    <Box>
                      <Text fontWeight="bold">Type:</Text>
                      <Badge colorScheme="blue">{property.type}</Badge>
                    </Box>
                    <Box>
                      <Text fontWeight="bold">Price:</Text>
                      <Text>₹{property.price}/month</Text>
                    </Box>
                    <Box>
                      <Text fontWeight="bold">Location:</Text>
                      <Text>{property.location}</Text>
                    </Box>
                    <Box>
                      <Text fontWeight="bold">Status:</Text>
                      <Badge colorScheme={property.status === 'approved' ? 'green' : 'yellow'}>
                        {property.status}
                      </Badge>
                    </Box>
                    <Box>
                      <Text fontWeight="bold">Owner:</Text>
                      <Text>{property.owner?.name || 'N/A'}</Text>
                    </Box>
                  </VStack>
                </CardBody>
                <CardFooter>
                  {property.status === 'pending' && (
                    <HStack spacing={2}>
                      <Button
                        colorScheme="green"
                        onClick={() => handleApproveProperty(property._id)}
                      >
                        Approve
                      </Button>
                      <Button
                        colorScheme="red"
                        onClick={() => handleRejectProperty(property._id)}
                      >
                        Reject
                      </Button>
                    </HStack>
                  )}
                </CardFooter>
              </Card>
            ))}
          </SimpleGrid>
        )}
      </VStack>
    </Container>
  );
};

export default AdminProperties; 