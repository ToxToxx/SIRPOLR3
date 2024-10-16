// App.js

import React from 'react';
import { ChakraProvider, Box, Button } from '@chakra-ui/react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import AddCharterComponent from './components/AddCharterComponent';
import CharterRemoveComponent from './components/CharterRemoveComponent';
import GetAllChartersComponent from './components/GetAllChartersComponent';

function CharterManagementComponent() {
    return (
        <Box>
            <Box mb={6}>
                <GetAllChartersComponent />
            </Box>
            <Box mb={6}>
                <AddCharterComponent />
            </Box>
            <Box mb={6}>
                <CharterRemoveComponent />
            </Box>
        </Box>
    );
}

function App() {
    return (
        <ChakraProvider>
            <Router>
                <Box className="App" p={8}>
                    <Box mb={6}>
                        <Link to="/">
                            <Button colorScheme="teal" mr={4}>Клиент</Button>
                        </Link>
                        <Link to="/manage">
                            <Button colorScheme="teal">Администратор</Button>
                        </Link>
                    </Box>
                    <Routes>
                        <Route path="/" element={<GetAllChartersComponent />} />
                        <Route path="/manage" element={<CharterManagementComponent />} />
                    </Routes>
                </Box>
            </Router>
        </ChakraProvider>
    );
}

export default App;
