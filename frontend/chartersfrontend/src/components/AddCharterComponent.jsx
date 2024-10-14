import React, { useState, useEffect } from 'react';
import { Box, Button, Input, FormControl, FormLabel, Heading, useToast } from '@chakra-ui/react';
import axios from 'axios';

const AddCharterComponent = () => {
    const [citiesPath, setCitiesPath] = useState('');
    const [price, setPrice] = useState('');
    const [date, setDate] = useState(''); // Храним дату как строку
    const toast = useToast();

    useEffect(() => {
        const now = new Date();
        const moscowTime = new Date(now.toLocaleString('en-US', { timeZone: 'Europe/Moscow' }));
        setDate(moscowTime.toISOString().slice(0, 16)); // Устанавливаем дату в формате 'YYYY-MM-DDTHH:mm'
    }, []);

    const handleAddCharter = async () => {
        const localDate = new Date(date);
        const moscowDate = new Date(localDate.toLocaleString('en-US', { timeZone: 'Europe/Moscow' }));
        const formattedDate = moscowDate.toISOString(); // Форматируем дату в ISO строку

        const soapRequest = `
            <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:sir="http://tempuri.org/">
                <soapenv:Header/>
                <soapenv:Body>
                    <sir:AddCharter>
                        <sir:citiesPath>${citiesPath}</sir:citiesPath>
                        <sir:Price>${price}</sir:Price>
                        <sir:date>${formattedDate}</sir:date> <!-- Используем строку даты в формате ISO -->
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
                <FormLabel>Дата и Время</FormLabel>
                <Input 
                    type="datetime-local" 
                    value={date} // Используем строку даты напрямую
                    onChange={(e) => setDate(e.target.value)} // Храним значение напрямую
                />
            </FormControl>
            <Button colorScheme="teal" onClick={handleAddCharter}>Добавить Чартер</Button>
        </Box>
    );
};

export default AddCharterComponent;
