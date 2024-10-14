import React, { useState } from 'react';
import { Box, Button, Input, FormControl, FormLabel, Heading } from '@chakra-ui/react';
import axios from 'axios';

const AddCharterComponent = () => {
    const [citiesPath, setCitiesPath] = useState('');
    const [price, setPrice] = useState('');
    const [date, setDate] = useState(new Date()); // Сохраняем как объект Date

    const handleAddCharter = async () => {
        const formattedDate = date.toISOString(); // Преобразуем дату в строку в формате ISO 8601

        const soapRequest = `
            <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:sir="http://tempuri.org/">
                <soapenv:Header/>
                <soapenv:Body>
                    <sir:AddCharter>
                        <sir:citiesPath>${citiesPath}</sir:citiesPath>
                        <sir:Price>${price}</sir:Price>
                        <sir:date>${formattedDate}</sir:date> <!-- Отправляем дату в формате ISO -->
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
            alert('Чартер успешно добавлен!');
        } catch (error) {
            console.error('Ошибка при добавлении чартерa:', error);
            alert('Не удалось добавить чартер.');
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
                <FormLabel>Дата (YYYY-MM-DD HH:mm:ss)</FormLabel>
                <Input 
                    type="datetime-local" // Используем datetime-local для выбора даты и времени
                    value={date.toISOString().slice(0, 16)} // Форматируем дату для поля ввода
                    onChange={(e) => setDate(new Date(e.target.value))} // Сохраняем как объект Date
                    placeholder="Введите дату"
                />
            </FormControl>
            <Button colorScheme="teal" onClick={handleAddCharter}>Добавить Чартер</Button>
        </Box>
    );
};

export default AddCharterComponent;
