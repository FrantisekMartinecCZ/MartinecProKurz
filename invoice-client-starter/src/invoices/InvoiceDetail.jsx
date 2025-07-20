// src/invoices/InvoiceDetail.jsx

import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { apiGet } from "../utils/api";
import "../css/InvoiceDetail.css";

const InvoiceDetail = () => {
  const { id } = useParams();
  const [invoice, setInvoice] = useState(null);
  const [persons, setPersons] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    apiGet("/api/invoices/" + id)
      .then(setInvoice)
      .catch(() => setError("Detail faktury se nepodařilo načíst."));
  }, [id]);

  useEffect(() => {
    apiGet("/api/persons")
      .then(setPersons)
      .catch(() => setError("Nepodařilo se načíst seznam osob."));
  }, []);

  if (error) {
    return <div className="alert alert-danger container mt-4">{error}</div>;
  }
  if (!invoice || persons.length === 0) {
    return <div className="container mt-4">Načítám detail faktury...</div>;
  }

  const seller = persons.find(
    p => String(p.personId) === String(invoice.sellerId) || String(p._id) === String(invoice.sellerId)
  );
  const buyer = persons.find(
    p => String(p.personId) === String(invoice.buyerId) || String(p._id) === String(invoice.buyerId)
  );

  const formatDate = (dateString) =>
    dateString ? new Date(dateString).toLocaleDateString("cs-CZ") : "-";

  return (
    <div className="container mt-4 invoice-detail-simple">
      {/* Hlavní nadpis */}
      <h1 className="invoice-detail-simple-title">
        Faktura č. {invoice.invoiceNumber}
      </h1>

      {/* Odkaz zpět */}
      <div className="mb-4">
        <Link to="/invoices" className="invoice-detail-simple-back">
          Zpět na seznam faktur
        </Link>
      </div>

      {/* Základní údaje */}
      <div className="mb-4">
        <div><b>Produkt:</b> {invoice.product}</div>
        <div>
          <b>Datum vystavení:</b> {formatDate(invoice.issued)}
        </div>
        <div>
          <b>Datum splatnosti:</b> {formatDate(invoice.dueDate)}
        </div>
        <div>
          <b>Cena bez DPH:</b> {Number(invoice.price).toLocaleString("cs-CZ")} Kč
        </div>
        <div>
          <b>DPH:</b> {invoice.vat}%
        </div>
        {invoice.note && (
          <div>
            <b>Poznámka:</b>
            <div>
              <em>{invoice.note}</em>
            </div>
          </div>
        )}
      </div>

      {/* Prodávající */}
      <div className="mb-4">
        <div style={{ fontWeight: 600 }}>Prodávající</div>
        <div>
          <b>Jméno:</b>{" "}
          {seller ? (
            <Link to={`/persons/show/${seller.personId || seller._id}`} className="invoice-detail-simple-link">
              {seller.name}
            </Link>
          ) : (
            <span className="text-muted">Neznámý</span>
          )}
        </div>
        <div>
          <b>IČO:</b> {seller ? seller.identificationNumber : "-"}
        </div>
        <div>
          <b>E-mail:</b>{" "}
          {seller ? (
            <a href={`mailto:${seller.mail}`} className="invoice-detail-simple-link">
              {seller.mail}
            </a>
          ) : (
            "-")
          }
        </div>
      </div>

      {/* Kupující */}
      <div className="mb-4">
        <div style={{ fontWeight: 600 }}>Kupující</div>
        <div>
          <b>Jméno:</b>{" "}
          {buyer ? (
            <Link to={`/persons/show/${buyer.personId || buyer._id}`} className="invoice-detail-simple-link">
              {buyer.name}
            </Link>
          ) : (
            <span className="text-muted">Neznámý</span>
          )}
        </div>
        <div>
          <b>IČO:</b> {buyer ? buyer.identificationNumber : "-"}
        </div>
        <div>
          <b>E-mail:</b>{" "}
          {buyer ? (
            <a href={`mailto:${buyer.mail}`} className="invoice-detail-simple-link">
              {buyer.mail}
            </a>
          ) : (
            "-")
          }
        </div>
      </div>
    </div>
  );
};

export default InvoiceDetail;
