"use client";
import React, { useState } from "react";

export default function InputCurrency() {
  const [formattedNominal, setFormattedNominal] = useState("");

  const handleInputChange = (event: any) => {
    const inputNominal = event.target.value;
    const numericNominal = inputNominal.toString().replace(/\D/g, "");
    const formatted = new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
    }).format(numericNominal);
    setFormattedNominal(formatted);
  };

  return (
    <div>
      <label htmlFor="Nominal" className="text-sm">
        Nominal
      </label>
      <input
        id="Nominal"
        name="nominal_deposit"
        required
        type="number"
        onChange={handleInputChange}
        className="input input-bordered w-full"
      />
      <span className="text-sm font-semibold text-error italic">
        {formattedNominal}
      </span>
    </div>
  );
}
