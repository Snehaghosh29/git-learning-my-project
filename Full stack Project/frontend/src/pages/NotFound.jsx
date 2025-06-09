import { Box, Button, Container, Heading, Text, VStack } from '@chakra-ui/react'
import { Link } from 'react-router-dom'

const NotFound = () => {
  return (
    <Container maxW="container.xl" py={10}>
      <VStack spacing={8} align="center">
        <Heading as="h1" size="2xl">
          404 - Page Not Found
        </Heading>
        <Text fontSize="xl" textAlign="center">
          The page you are looking for does not exist.
        </Text>
        <Button as={Link} to="/" colorScheme="blue">
          Go Back Home
        </Button>
      </VStack>
    </Container>
  )
}

export default NotFound 