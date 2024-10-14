import React from 'react';
import AddCharterComponent from './components/AddCharterComponent';
import { ChakraProvider, Box } from '@chakra-ui/react';
import CharterManagementComponent from './components/CharterManagementComponent';

function App() {
    return (
        <ChakraProvider>
            <Box className="App" p={8}>
                <AddCharterComponent />
                <CharterManagementComponent />
            </Box>
        </ChakraProvider>
    );
}

export default App;
