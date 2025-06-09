import { Box, Button, Flex, Heading, Spacer } from '@chakra-ui/react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const Navbar = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <Box bg="blue.500" px={4} py={2}>
      <Flex maxW="container.xl" mx="auto" align="center">
        <Heading size="md" color="white">
          <Link to="/">PG Booking</Link>
        </Heading>
        <Spacer />
        <Flex gap={4} align="center">
          {user ? (
            <>
              {user.role === 'admin' && (
                <>
                  <Button as={Link} to="/admin" variant="ghost" color="white">
                    Admin Dashboard
                  </Button>
                  <Button as={Link} to="/admin/users" variant="ghost" color="white">
                    Users
                  </Button>
                </>
              )}
              {user.role === 'property_owner' && (
                <>
                  <Button as={Link} to="/owner" variant="ghost" color="white">
                    Owner Dashboard
                  </Button>
                  <Button as={Link} to="/owner/properties" variant="ghost" color="white">
                    My Properties
                  </Button>
                  <Button as={Link} to="/owner/bookings" variant="ghost" color="white">
                    Bookings
                  </Button>
                </>
              )}
              {user.role === 'client' && (
                <>
                  <Button as={Link} to="/properties" variant="ghost" color="white">
                    Properties
                  </Button>
                  <Button as={Link} to="/my-bookings" variant="ghost" color="white">
                    My Bookings
                  </Button>
                </>
              )}
              <Button variant="ghost" color="white" onClick={handleLogout}>
                Logout
              </Button>
            </>
          ) : (
            <>
              <Button as={Link} to="/login" variant="ghost" color="white">
                Login
              </Button>
              <Button as={Link} to="/register" variant="outline" color="white">
                Register
              </Button>
            </>
          )}
        </Flex>
      </Flex>
    </Box>
  )
}

export default Navbar 