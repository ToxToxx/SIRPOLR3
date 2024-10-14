import React from 'react';
import AddCharterComponent from './components/AddCharterComponent';
import GetAllChartersComponent from './components/GetAllChartersComponent';
import { ChakraProvider, Box } from '@chakra-ui/react';

function App() {
    return (
        <ChakraProvider>
            <Box className="App" p={8}>
                <AddCharterComponent />
                <GetAllChartersComponent />
            </Box>
        </ChakraProvider>
    );
}

export default App;
