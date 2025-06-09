import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
  Heading,
  Text,
  useToast,
  Container,
  Select,
  Textarea,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Image,
  HStack,
  IconButton,
} from '@chakra-ui/react';
import { DeleteIcon } from '@chakra-ui/icons';
import axios from 'axios';

const AddProperty = () => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    type: 'PG',
    price: '',
    location: '',
    amenities: '',
    rules: '',
  });
  const [images, setImages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const toast = useToast();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImages(files);
  };

  const removeImage = (index) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Validate required fields
      if (!formData.name || !formData.description || !formData.type || !formData.price || !formData.location) {
        toast({
          title: 'Missing required fields',
          description: 'Please fill in all required fields',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
        setIsLoading(false);
        return;
      }

      // Create FormData for the request
      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('type', formData.type);
      formDataToSend.append('price', formData.price);
      formDataToSend.append('location', formData.location);
      formDataToSend.append('amenities', formData.amenities);
      formDataToSend.append('rules', formData.rules);

      // Append images
      images.forEach((image) => {
        formDataToSend.append('images', image);
      });

      // Log the form data for debugging
      console.log('Form data:', {
        name: formData.name,
        description: formData.description,
        type: formData.type,
        price: formData.price,
        location: formData.location,
        amenities: formData.amenities,
        rules: formData.rules,
        imageCount: images.length
      });

      // Send the request
      const response = await axios.post('http://localhost:5000/api/properties', formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        withCredentials: true,
      });

      if (response.data) {
        toast({
          title: 'Property added successfully',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
        navigate('/owner/dashboard');
      }
    } catch (error) {
      console.error('Error adding property:', error);
      const errorMessage = error.response?.data?.message || 'Something went wrong';
      const missingFields = error.response?.data?.missingFields;
      
      let description = errorMessage;
      if (missingFields) {
        const missingFieldsList = Object.entries(missingFields)
          .filter(([_, isMissing]) => isMissing)
          .map(([field]) => field)
          .join(', ');
        description = `Missing fields: ${missingFieldsList}`;
      }

      toast({
        title: 'Error adding property',
        description: description,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container maxW="container.md" py={10}>
      <VStack spacing={8} align="stretch">
        <Heading>Add New Property</Heading>
        
        <form onSubmit={handleSubmit}>
          <VStack spacing={6}>
            <FormControl isRequired>
              <FormLabel>Property Name</FormLabel>
              <Input
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter property name"
              />
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Description</FormLabel>
              <Textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Enter property description"
              />
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Property Type</FormLabel>
              <Select
                name="type"
                value={formData.type}
                onChange={handleChange}
              >
                <option value="PG">PG</option>
                <option value="Hostel">Hostel</option>
                <option value="Apartment">Apartment</option>
              </Select>
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Price (₹/month)</FormLabel>
              <NumberInput
                name="price"
                value={formData.price}
                onChange={(value) => setFormData(prev => ({ ...prev, price: value }))}
                min={0}
              >
                <NumberInputField placeholder="Enter price per month" />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Location</FormLabel>
              <Input
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="Enter property location"
              />
            </FormControl>

            <FormControl>
              <FormLabel>Amenities (comma-separated)</FormLabel>
              <Input
                name="amenities"
                value={formData.amenities}
                onChange={handleChange}
                placeholder="e.g., WiFi, AC, Parking"
              />
            </FormControl>

            <FormControl>
              <FormLabel>Rules</FormLabel>
              <Textarea
                name="rules"
                value={formData.rules}
                onChange={handleChange}
                placeholder="Enter property rules"
              />
            </FormControl>

            <FormControl>
              <FormLabel>Images</FormLabel>
              <Input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageChange}
              />
              <HStack mt={2} spacing={2} wrap="wrap">
                {images.map((image, index) => (
                  <Box key={index} position="relative">
                    <Image
                      src={URL.createObjectURL(image)}
                      alt={`Preview ${index + 1}`}
                      boxSize="100px"
                      objectFit="cover"
                      borderRadius="md"
                    />
                    <IconButton
                      icon={<DeleteIcon />}
                      size="sm"
                      colorScheme="red"
                      position="absolute"
                      top={1}
                      right={1}
                      onClick={() => removeImage(index)}
                    />
                  </Box>
                ))}
              </HStack>
            </FormControl>

            <Button
              type="submit"
              colorScheme="blue"
              isLoading={isLoading}
              loadingText="Adding Property..."
              width="full"
            >
              Add Property
            </Button>
          </VStack>
        </form>
      </VStack>
    </Container>
  );
};

export default AddProperty; 