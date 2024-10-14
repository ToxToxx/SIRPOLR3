import React, { useState } from 'react';
import { Box, Button, UnorderedList, ListItem, IconButton, useToast, Heading } from '@chakra-ui/react';
import { CloseIcon } from '@chakra-ui/icons';
import axios from 'axios';

const CharterManagementComponent = () => {
    const [charters, setCharters] = useState([]);
    const toast = useToast();

    const handleGetAllCharters = async () => {
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
                dateTime: new Date(node.getElementsByTagNameNS(namespace, 'CharterDateTime')[0]?.textContent || 'N/A').toLocaleString('ru-RU', { timeZone: 'Europe/Moscow' }),
                createdAt: node.getElementsByTagNameNS(namespace, 'CreatedAt')[0]?.textContent || 'N/A',
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

    const handleDeleteCharter = async (charterIdToDelete) => {
        if (!isValidGuid(charterIdToDelete)) {
            alert('Неверный формат ID. Пожалуйста, введите корректный GUID.');
            return;
        }

        const soapRequest = `
            <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:sir="http://tempuri.org/">
                <soapenv:Header/>
                <soapenv:Body>
                    <sir:DeleteCharter>
                        <sir:id>${charterIdToDelete}</sir:id>
                    </sir:DeleteCharter>
                </soapenv:Body>
            </soapenv:Envelope>
        `;

        try {
            const response = await axios.post('http://localhost:5018/Service.asmx', soapRequest, {
                headers: {
                    'Content-Type': 'text/xml',
                    SOAPAction: 'http://tempuri.org/ICharterService/DeleteCharter'
                }
            });

            const parser = new DOMParser();
            const xmlDoc = parser.parseFromString(response.data, 'text/xml');
            const isDeleted = xmlDoc.getElementsByTagName('DeleteCharterResult')[0]?.textContent === 'true';

            if (isDeleted) {
                setCharters(charters.filter(charter => charter.id !== charterIdToDelete));
                toast({
                    title: 'Успех',
                    description: 'Чартер успешно удалён.',
                    status: 'success',
                    duration: 5000,
                    isClosable: true,
                });
            } else {
                toast({
                    title: 'Ошибка',
                    description: 'Не удалось найти чартер с указанным ID.',
                    status: 'error',
                    duration: 5000,
                    isClosable: true,
                });
            }
        } catch (error) {
            console.error('Ошибка при удалении чартера:', error);
            toast({
                title: 'Ошибка',
                description: 'Не удалось удалить чартер.',
                status: 'error',
                duration: 5000,
                isClosable: true,
            });
        }
    };

    const isValidGuid = (guid) => {
        const guidRegex = /^[{]?[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}[}]?$/i;
        return guidRegex.test(guid);
    };

    return (
        <Box p={4} borderWidth={1} borderRadius="lg" boxShadow="lg">
            <Heading size="md" mb={4}>Управление Чартером</Heading>
            <Button colorScheme="teal" onClick={handleGetAllCharters} mb={4}>Получить Все Чартеры</Button>
            <UnorderedList mt={4}>
                {charters.map((charter) => (
                    <ListItem key={charter.id} display="flex" justifyContent="space-between" alignItems="center">
                        <span>{charter.citiesPath} - {charter.price} - {charter.dateTime}</span>
                        <IconButton 
                            icon={<CloseIcon />} 
                            colorScheme="red" 
                            onClick={() => handleDeleteCharter(charter.id)} 
                            aria-label="Удалить чартер" 
                        />
                    </ListItem>
                ))}
            </UnorderedList>
        </Box>
    );
};

export default CharterManagementComponent;
