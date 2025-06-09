import { Box, Button, Container, Heading, Text, VStack } from '@chakra-ui/react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const Home = () => {
  const { user } = useAuth()

  return (
    <Container maxW="container.xl" py={10}>
      <VStack spacing={8} align="center">
        <Heading as="h1" size="2xl">
          Welcome to PG Booking
        </Heading>
        <Text fontSize="xl" textAlign="center">
          Find your perfect PG accommodation with ease
        </Text>
        {!user ? (
          <Box>
            <Button as={Link} to="/login" colorScheme="blue" mr={4}>
              Login
            </Button>
            <Button as={Link} to="/register" variant="outline">
              Register
            </Button>
          </Box>
        ) : (
          <Button as={Link} to="/dashboard" colorScheme="blue">
            Go to Dashboard
          </Button>
        )}
      </VStack>
    </Container>
  )
}

export default Home 