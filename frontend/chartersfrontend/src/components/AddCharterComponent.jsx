// AddCharterComponent.js

import React, { useState, useEffect } from 'react';
import { Box, Button, Input, FormControl, FormLabel, Heading, useToast } from '@chakra-ui/react';
import axios from 'axios';
import { format, toZonedTime, fromZonedTime } from 'date-fns-tz';

const AddCharterComponent = () => {
    const [citiesPath, setCitiesPath] = useState('');
    const [price, setPrice] = useState('');
    const [date, setDate] = useState('');
    const toast = useToast();
    const moscowTimeZone = 'Europe/Moscow';

    useEffect(() => {
        const now = new Date();
        const moscowTime = toZonedTime(now, moscowTimeZone);
        setDate(format(moscowTime, "yyyy-MM-dd'T'HH:mm")); // Format as 'YYYY-MM-DDTHH:mm'
    }, []);

    const handleAddCharter = async () => {
        const localDate = fromZonedTime(date, moscowTimeZone);
        const formattedDate = localDate.toISOString();

        const soapRequest = `
            <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:sir="http://tempuri.org/">
                <soapenv:Header/>
                <soapenv:Body>
                    <sir:AddCharter>
                        <sir:citiesPath>${citiesPath}</sir:citiesPath>
                        <sir:Price>${price}</sir:Price>
                        <sir:date>${formattedDate}</sir:date>
                    </sir:AddCharter>
                </soapenv:Body>
            </soapenv:Envelope>
        `;

        try {
            const response = await axios.post('http://localhost:5018/Service.asmx', soapRequest, {
                headers: {
                    'Content-Type': 'text/xml',
                    SOAPAction: 'http://tempuri.org/ICharterService/AddCharter'
                }
            });

            console.log('Response:', response.data);
            toast({
                title: 'Успех',
                description: 'Чартер успешно добавлен!',
                status: 'success',
                duration: 5000,
                isClosable: true,
            });
        } catch (error) {
            console.error('Ошибка при добавлении чартерa:', error);
            toast({
                title: 'Ошибка',
                description: 'Не удалось добавить чартер.',
                status: 'error',
                duration: 5000,
                isClosable: true,
            });
        }
    };

    return (
        <Box p={4} borderWidth={1} borderRadius="lg" boxShadow="lg">
            <Heading size="md" mb={4}>Добавить Чартер</Heading>
            <FormControl mb={3}>
                <FormLabel>Маршрут городов</FormLabel>
                <Input 
                    type="text" 
                    value={citiesPath} 
                    onChange={(e) => setCitiesPath(e.target.value)} 
                    placeholder="Маршрут городов" 
                />
            </FormControl>
            <FormControl mb={3}>
                <FormLabel>Цена</FormLabel>
                <Input 
                    type="number" 
                    value={price} 
                    onChange={(e) => setPrice(e.target.value)} 
                    placeholder="Цена" 
                />
            </FormControl>
            <FormControl mb={3}>
                <FormLabel>Дата и Время (MSK)</FormLabel>
                <Input 
                    type="datetime-local" 
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                />
            </FormControl>
            <Button colorScheme="teal" onClick={handleAddCharter}>Добавить Чартер</Button>
        </Box>
    );
};

export default AddCharterComponent;
