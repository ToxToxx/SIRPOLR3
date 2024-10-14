import React, { useState, useEffect } from 'react';
import { Box, Button, Input, FormControl, FormLabel, Heading, UnorderedList, ListItem, useToast } from '@chakra-ui/react';
import axios from 'axios';

const EditCharterComponent = () => {
    const [charters, setCharters] = useState([]);
    const [selectedCharter, setSelectedCharter] = useState(null);
    const [citiesPath, setCitiesPath] = useState('');
    const [price, setPrice] = useState('');
    const [dateTime, setDateTime] = useState('');
    const toast = useToast();

    const fetchCharters = async () => {
        const soapRequest = `
            <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:sir="http://tempuri.org/">
                <soapenv:Header/>
                <soapenv:Body>
                    <sir:GetAllCharts/>
                </soapenv:Body>
            </soapenv:Envelope>
        `;

        try {
            const response = await axios.post('http://localhost:5018/Service.asmx', soapRequest, {
                headers: {
                    'Content-Type': 'text/xml',
                    SOAPAction: 'http://tempuri.org/ICharterService/GetAllCharts'
                }
            });

            const parser = new DOMParser();
            const xmlDoc = parser.parseFromString(response.data, 'text/xml');
            const namespace = 'http://schemas.datacontract.org/2004/07/SirpoLR3Charter.Models';
            const charterNodes = xmlDoc.getElementsByTagNameNS(namespace, 'Charter');

            const chartersArray = Array.from(charterNodes).map((node) => ({
                id: node.getElementsByTagNameNS(namespace, 'Id')[0]?.textContent || 'N/A',
                citiesPath: node.getElementsByTagNameNS(namespace, 'CititesPath')[0]?.textContent || 'N/A',
                price: node.getElementsByTagNameNS(namespace, 'Price')[0]?.textContent || 'N/A',
                dateTime: node.getElementsByTagNameNS(namespace, 'CharterDateTime')[0]?.textContent || 'N/A',
            }));

            setCharters(chartersArray);
        } catch (error) {
            console.error('Ошибка при получении чартов:', error);
            toast({
                title: 'Ошибка',
                description: 'Не удалось получить чартеры.',
                status: 'error',
                duration: 5000,
                isClosable: true,
            });
        }
    };

    useEffect(() => {
        fetchCharters();
    }, []);

    useEffect(() => {
        if (selectedCharter) {
            setCitiesPath(selectedCharter.citiesPath);
            setPrice(selectedCharter.price);
            setDateTime(selectedCharter.dateTime);
        }
    }, [selectedCharter]);

    const handleSaveChanges = async () => {
        if (!selectedCharter) return;

        const updatedCharter = {
            ...selectedCharter,
            citiesPath,
            price,
            dateTime,
        };

        const soapRequest = `
            <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:sir="http://tempuri.org/">
                <soapenv:Header/>
                <soapenv:Body>
                    <sir:UpdateCharter>
                        <sir:id>${updatedCharter.id}</sir:id>
                        <sir:CititesPath>${updatedCharter.citiesPath}</sir:CititesPath>
                        <sir:Price>${updatedCharter.price}</sir:Price>
                        <sir:CharterDateTime>${updatedCharter.dateTime}</sir:CharterDateTime>
                    </sir:UpdateCharter>
                </soapenv:Body>
            </soapenv:Envelope>
        `;

        try {
            const response = await axios.post('http://localhost:5018/Service.asmx', soapRequest, {
                headers: {
                    'Content-Type': 'text/xml',
                    SOAPAction: 'http://tempuri.org/ICharterService/UpdateCharter'
                }
            });

            console.log('Response:', response.data);
            toast({
                title: 'Успех',
                description: 'Чартер успешно обновлен!',
                status: 'success',
                duration: 5000,
                isClosable: true,
            });

            fetchCharters(); // Обновляем список чартеров после сохранения
        } catch (error) {
            console.error('Ошибка при обновлении чартера:', error);
            toast({
                title: 'Ошибка',
                description: 'Не удалось обновить чартер.',
                status: 'error',
                duration: 5000,
                isClosable: true,
            });
        }
    };

    return (
        <Box p={4} borderWidth={1} borderRadius="lg" boxShadow="lg" mt={4}>
            <Heading size="md" mb={4}>Редактировать Чартер</Heading>
            <UnorderedList mb={4}>
                {charters.map((charter) => (
                    <ListItem key={charter.id} onClick={() => setSelectedCharter(charter)} cursor="pointer">
                        {charter.citiesPath} - {charter.price} - {charter.dateTime}
                    </ListItem>
                ))}
            </UnorderedList>
            {selectedCharter && (
                <>
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
                            value={dateTime}
                            onChange={(e) => setDateTime(e.target.value)}
                        />
                    </FormControl>
                    <Button colorScheme="teal" onClick={handleSaveChanges} mr={3}>Сохранить</Button>
                    <Button colorScheme="red" onClick={() => setSelectedCharter(null)}>Отмена</Button>
                </>
            )}
        </Box>
    );
};

export default EditCharterComponent;
