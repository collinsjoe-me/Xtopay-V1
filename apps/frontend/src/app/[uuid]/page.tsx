"use client";
import React from "react";
import PaymentOptionSelector from "@components/payment/PaymentOptionSelector";
import Script from "next/script";
import { useParams } from "next/navigation";


const PaymentPage: React.FC = () => {
  const params = useParams<{ uuid: string }>();
  const uuid = params.uuid;

  return (
    <>
      <PaymentOptionSelector uuid={uuid} />
      <Script
        src="https://cdnjs.cloudflare.com/ajax/libs/flowbite/2.3.0/datepicker.min.js"
        strategy="afterInteractive"
      />
    </>
  );
};

export default PaymentPage;
