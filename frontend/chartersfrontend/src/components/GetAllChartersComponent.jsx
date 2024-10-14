import React, { useState } from 'react';
import { Box, Button, Heading, UnorderedList, ListItem } from '@chakra-ui/react';
import axios from 'axios';

const GetAllChartersComponent = () => {
    const [charters, setCharters] = useState([]);

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
            
            // Указываем пространство имен, использующееся в ответе
            const namespace = 'http://schemas.datacontract.org/2004/07/SirpoLR3Charter.Models';
            const charterNodes = xmlDoc.getElementsByTagNameNS(namespace, 'Charter');

            if (charterNodes.length === 0) {
                alert('Нет доступных чартеров.');
                return;
            }

            const chartersArray = Array.from(charterNodes).map((node) => ({
                id: node.getElementsByTagNameNS(namespace, 'Id')[0]?.textContent || 'N/A',
                citiesPath: node.getElementsByTagNameNS(namespace, 'CititesPath')[0]?.textContent || 'N/A',
                price: node.getElementsByTagNameNS(namespace, 'Price')[0]?.textContent || 'N/A',
                dateTime: node.getElementsByTagNameNS(namespace, 'CharterDateTime')[0]?.textContent || 'N/A',
                createdAt: node.getElementsByTagNameNS(namespace, 'CreatedAt')[0]?.textContent || 'N/A',
            }));

            setCharters(chartersArray);
        } catch (error) {
            console.error('Ошибка при получении чартов:', error);
            alert('Не удалось получить чартеры.');
        }
    };

    return (
        <Box p={4} borderWidth={1} borderRadius="lg" boxShadow="lg">
            <Heading size="md" mb={4}>Список Чартеров</Heading>
            <Button colorScheme="teal" onClick={handleGetAllCharters} mb={4}>Получить Все Чартеры</Button>
            <UnorderedList>
                {charters.map((charter) => (
                    <ListItem key={charter.id}>
                        {charter.citiesPath} - {charter.price} - {charter.dateTime}
                    </ListItem>
                ))}
            </UnorderedList>
        </Box>
    );
};

export default GetAllChartersComponent;
