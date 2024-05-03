

import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faShoppingCart, faTrash, faMoneyBill, faMoneyCheckDollar } from '@fortawesome/free-solid-svg-icons';
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';
import { Link as Anchor } from "react-router-dom";
import baseURL from '../url';
const PayPalButton = (tamount) => {


    

    const [cartItems, setCartItems] = useState([]);
    const [noteText, setNoteText] = useState('');
    const [location, setLocation] = useState('');
    const [name, setName] = useState('');
    const [shipping, setShipping] = useState('');
    const [codigo, setCodigo] = useState('');
    const [contactos, setContactos] = useState([]);
    const [codigoValido, setCodigoValido] = useState(false);
    const [codigos, setCodigos] = useState([]);
    const [descuento, setDescuento] = useState(0);
    const [totalPrice, setTotalPrice] = useState(0);
    const [isFocused, setIsFocused] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState('efectivo');
    const [deliveryOption, setDeliveryOption] = useState('delivery');

    useEffect(() => {
        cargarContacto();
    }, []);
    useEffect(() => {
        // Calcular el precio total al cargar el carrito o al actualizar los productos
        let totalPriceCalc = 0;
        cartItems.forEach(item => {
            totalPriceCalc += item.precio * item.cantidad;
        });
        setTotalPrice(totalPriceCalc);
    }, [cartItems]);
    
    const cargarContacto = () => {
        fetch(`${baseURL}/contactoGet.php`, {
            method: 'GET',
        })
            .then(response => response.json())
            .then(data => {
                setContactos(data.contacto.reverse()[0] || []);
            })
            .catch(error => console.error('Error al cargar contactos:', error));
    };
    
    const handleWhatsappMessage = () => {
        
        const codigoDescuento = codigos.find(item => item.codigo === codigo);
        let descuentoActualizado = 0;

        
        if (codigoDescuento) {
            descuentoActualizado = codigoDescuento.descuento;
            setCodigoValido(true);
        } else {
            setCodigoValido(false);
        }

        let totalPrice = 0;

        cartItems.forEach(item => {
            totalPrice += item.precio * item.cantidad;
        });

        // Aplicar descuento y asegurarse de que el precio no sea negativo
        let totalPriceWithDiscount = totalPrice - descuentoActualizado;
        if (totalPriceWithDiscount < 0) {
            totalPriceWithDiscount = 0; // O cualquier otro manejo que desees
        }

      
        const formattedTotalPrice = tamount.data?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");

        const phoneNumber = `3875683101`;

        // alert(phoneNumber);

        const cartDetails = cartItems.map((item) => (
            `\n*${item.titulo}* \n Cantidad: ${item.cantidad} \n ${item?.item}\n Precio: $${item.precio?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}\n`
        ));

        let noteMessage = '¡¡¡Pago hecho!!!';

        // alert(noteMessage);
        if (location.trim() !== '') {
            noteMessage += `\nUbicación: ${location}`;
        }



        if (name.trim() !== '') {
            noteMessage += `\nNombre: ${name}`;
        }

        if(shipping.trim() !== '') {
            noteMessage += `\nDIRECCIÓN: ${shipping}`;
        }
        if (noteText.trim() !== '') {
            noteMessage += `\nNota: ${noteText}`;
        }
        if (codigo.trim() !== '') {
            noteMessage += `\nCodigo : ${codigo}
            \nDescuento de : $${descuentoActualizado?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}
            `;
        }

        // const paymentMessage = paymentMethod === 'efectivo' ? 'Pago en efectivo' : 'Pago por transferencia bancaria';
        // const paymentMessage2 = deliveryOption === 'delivery' ? 'Envio a domicilio' : 'Retiro personalmente';


        const message = `¡Hola! 🌟 Estoy interesado en encargar:\n\n${cartDetails.join('')}\n${noteMessage}\nTotal: $${formattedTotalPrice}`;


        const whatsappUrl = `https://api.whatsapp.com/send?phone=${phoneNumber}&text=${encodeURIComponent(message)}`;
        console.log(whatsappUrl);
        window.open(whatsappUrl, '_blank');


    };

    let value = 0;
    value = tamount.data;

    let payvalue = (value/1000).toFixed(2);


    const createOrder = (data, actions) => {
        return actions.order.create({
            intent: 'CAPTURE',
            purchase_units: [
                {
                    amount: {
                        value: payvalue
                    }
                }
            ]
        });
    };

    

    const onApprove = (data, actions) => {
        // Handle the payment approval
        console.log('Payment approved:', data);
        handleWhatsappMessage();
    };  

    return (
        <PayPalScriptProvider options={{ 'clientId': 'AcgiZP28YxHEO6YvLLPNWf7_vFInd1O8eSlHABKbQCKdCPS9sx3oGWZesq_92NuCrvJX_ABSkRgmBwDw' }}>
            <PayPalButtons
                createOrder={createOrder}
                onApprove={onApprove}
            />
        </PayPalScriptProvider>
    );
};

export default PayPalButton;