import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
} from '@chakra-ui/react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';

// Configure axios defaults
axios.defaults.withCredentials = true;
axios.defaults.baseURL = 'http://localhost:5000';

const OwnerDashboard = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const toast = useToast();
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchProperties();
    }
  }, [user]);

  const fetchProperties = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      if (!token) {
        toast({
          title: 'Authentication Error',
          description: 'Please log in to view your properties',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
        navigate('/login');
        return;
      }

      const response = await axios.get('/api/properties/owner', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      setProperties(response.data);
    } catch (error) {
      console.error('Error fetching properties:', error);
      if (error.response?.status === 401) {
        toast({
          title: 'Session Expired',
          description: 'Please log in again',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
        navigate('/login');
      } else {
        toast({
          title: 'Error fetching properties',
          description: error.response?.data?.message || 'Something went wrong',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleManageProperty = (id) => {
    navigate(`/owner/property/${id}`);
  };

  if (loading) {
    return (
      <Center h="100vh">
        <Spinner size="xl" />
      </Center>
    );
  }

  return (
    <Container maxW="container.xl" py={10}>
      <VStack spacing={8} align="stretch">
        <HStack justify="space-between">
          <Heading>My Properties</Heading>
          <Button colorScheme="blue" onClick={() => navigate('/owner/add-property')}>
            Add New Property
          </Button>
        </HStack>

        {properties.length === 0 ? (
          <Text>No properties found. Add your first property!</Text>
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
                  </VStack>
                </CardBody>
                <CardFooter>
                  <Button
                    colorScheme="blue"
                    onClick={() => handleManageProperty(property._id)}
                  >
                    Manage Property
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </SimpleGrid>
        )}
      </VStack>
    </Container>
  );
};

export default OwnerDashboard; 