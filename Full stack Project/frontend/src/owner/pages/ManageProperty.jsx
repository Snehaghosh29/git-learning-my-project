import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  HStack,
  Button,
  Badge,
  useToast,
  SimpleGrid,
  Image,
  Card,
  CardBody,
  CardHeader,
  CardFooter,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Select,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
} from '@chakra-ui/react';
import axios from 'axios';

const ManageProperty = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editForm, setEditForm] = useState({
    name: '',
    description: '',
    type: '',
    price: '',
    location: '',
    amenities: '',
    rules: '',
  });

  useEffect(() => {
    fetchProperty();
  }, [id]);

  const fetchProperty = async () => {
    try {
      const response = await axios.get(`/api/properties/${id}`);
      setProperty(response.data);
      setEditForm({
        name: response.data.name,
        description: response.data.description,
        type: response.data.type,
        price: response.data.price,
        location: response.data.location,
        amenities: response.data.amenities.join(', '),
        rules: response.data.rules,
      });
    } catch (error) {
      toast({
        title: 'Error fetching property',
        description: error.response?.data?.message || 'Something went wrong',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`/api/properties/${id}`, {
        ...editForm,
        amenities: editForm.amenities.split(',').map(item => item.trim()),
      });
      toast({
        title: 'Property updated successfully',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      fetchProperty();
      onClose();
    } catch (error) {
      toast({
        title: 'Error updating property',
        description: error.response?.data?.message || 'Something went wrong',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this property?')) {
      try {
        await axios.delete(`/api/properties/${id}`);
        toast({
          title: 'Property deleted successfully',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
        navigate('/owner');
      } catch (error) {
        toast({
          title: 'Error deleting property',
          description: error.response?.data?.message || 'Something went wrong',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      }
    }
  };

  if (loading) {
    return <Text>Loading...</Text>;
  }

  if (!property) {
    return <Text>Property not found</Text>;
  }

  return (
    <Container maxW="container.xl" py={10}>
      <VStack spacing={8} align="stretch">
        <HStack justify="space-between">
          <Heading>{property.name}</Heading>
          <HStack>
            <Button colorScheme="blue" onClick={onOpen}>
              Edit Property
            </Button>
            <Button colorScheme="red" onClick={handleDelete}>
              Delete Property
            </Button>
          </HStack>
        </HStack>

        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={8}>
          <Box>
            <Card>
              <CardHeader>
                <Heading size="md">Property Details</Heading>
              </CardHeader>
              <CardBody>
                <VStack align="stretch" spacing={4}>
                  <Box>
                    <Text fontWeight="bold">Description:</Text>
                    <Text>{property.description}</Text>
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
                    <Text fontWeight="bold">Amenities:</Text>
                    <HStack wrap="wrap" spacing={2}>
                      {property.amenities.map((amenity, index) => (
                        <Badge key={index} colorScheme="green">
                          {amenity}
                        </Badge>
                      ))}
                    </HStack>
                  </Box>
                  <Box>
                    <Text fontWeight="bold">Rules:</Text>
                    <Text>{property.rules}</Text>
                  </Box>
                </VStack>
              </CardBody>
            </Card>
          </Box>

          <Box>
            <Card>
              <CardHeader>
                <Heading size="md">Property Images</Heading>
              </CardHeader>
              <CardBody>
                <SimpleGrid columns={2} spacing={4}>
                  {property.images.map((image, index) => (
                    <Image
                      key={index}
                      src={image}
                      alt={`Property image ${index + 1}`}
                      borderRadius="lg"
                    />
                  ))}
                </SimpleGrid>
              </CardBody>
            </Card>
          </Box>
        </SimpleGrid>

        {/* Edit Property Modal */}
        <Modal isOpen={isOpen} onClose={onClose} size="xl">
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Edit Property</ModalHeader>
            <ModalCloseButton />
            <ModalBody pb={6}>
              <form onSubmit={handleUpdate}>
                <VStack spacing={4}>
                  <FormControl isRequired>
                    <FormLabel>Property Name</FormLabel>
                    <Input
                      value={editForm.name}
                      onChange={(e) =>
                        setEditForm({ ...editForm, name: e.target.value })
                      }
                    />
                  </FormControl>

                  <FormControl isRequired>
                    <FormLabel>Description</FormLabel>
                    <Textarea
                      value={editForm.description}
                      onChange={(e) =>
                        setEditForm({ ...editForm, description: e.target.value })
                      }
                    />
                  </FormControl>

                  <FormControl isRequired>
                    <FormLabel>Property Type</FormLabel>
                    <Select
                      value={editForm.type}
                      onChange={(e) =>
                        setEditForm({ ...editForm, type: e.target.value })
                      }
                    >
                      <option value="PG">PG</option>
                      <option value="Hostel">Hostel</option>
                      <option value="Apartment">Apartment</option>
                    </Select>
                  </FormControl>

                  <FormControl isRequired>
                    <FormLabel>Price (₹/month)</FormLabel>
                    <NumberInput
                      value={editForm.price}
                      onChange={(value) =>
                        setEditForm({ ...editForm, price: value })
                      }
                    >
                      <NumberInputField />
                      <NumberInputStepper>
                        <NumberIncrementStepper />
                        <NumberDecrementStepper />
                      </NumberInputStepper>
                    </NumberInput>
                  </FormControl>

                  <FormControl isRequired>
                    <FormLabel>Location</FormLabel>
                    <Input
                      value={editForm.location}
                      onChange={(e) =>
                        setEditForm({ ...editForm, location: e.target.value })
                      }
                    />
                  </FormControl>

                  <FormControl>
                    <FormLabel>Amenities (comma separated)</FormLabel>
                    <Textarea
                      value={editForm.amenities}
                      onChange={(e) =>
                        setEditForm({ ...editForm, amenities: e.target.value })
                      }
                    />
                  </FormControl>

                  <FormControl>
                    <FormLabel>Rules</FormLabel>
                    <Textarea
                      value={editForm.rules}
                      onChange={(e) =>
                        setEditForm({ ...editForm, rules: e.target.value })
                      }
                    />
                  </FormControl>

                  <Button type="submit" colorScheme="blue" width="full">
                    Update Property
                  </Button>
                </VStack>
              </form>
            </ModalBody>
          </ModalContent>
        </Modal>
      </VStack>
    </Container>
  );
};

export default ManageProperty; 