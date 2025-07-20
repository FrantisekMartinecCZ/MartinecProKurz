// src/persons/PersonDetail.jsx

import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { apiGet } from "../utils/api";
import Country from "./Country";
import "../css/PersonDetail.css";



const PersonDetail = () => {
  const { id } = useParams();
  const [person, setPerson] = useState(null);
  const [invoices, setInvoices] = useState([]);
  const [viewType, setViewType] = useState(null);
  const [error, setError] = useState(null);
  const [persons, setPersons] = useState([]);

  useEffect(() => {
  fetch("/api/persons")
    .then(res => res.json())
    .then(setPersons);
}, []);

const findPersonName = (id) => {
  if (!id) return '';
  const person = persons.find(p => p.personId === id || p.id === id || p._id === id);
  return person ? person.name : `ID: ${id}`;
};

const getInvoiceStats = (invoices) => {
  const sum = invoices.reduce((acc, inv) => acc + inv.price, 0);
  const count = invoices.length;
  return { sum, count };
};

  // Načítání dat osoby
  useEffect(() => {
    if (!id) return;
    apiGet("/api/persons/" + id)
      .then(setPerson)
      .catch((error) => {
        console.error("Chyba při načítání detailu osoby:", error);
        setError("Detail osoby se nepodařilo načíst.");
      });
  }, [id]);

  // Načítání faktur podle vybraného typu (vystavené/přijaté)
  useEffect(() => {
    if (!viewType || !id) return;
    setInvoices([]);
    let url = "";
    if (viewType === "issued") {
      url = `/api/persons/${id}/invoices-issued`;
    } else if (viewType === "received") {
      url = `/api/persons/${id}/invoices-received`;
    }
    if (!url) return;
    apiGet(url)
      .then(setInvoices)
      .catch(console.error);
  }, [viewType, id]);

  // Loading/error hlášky
  if (error) {
    return <div className="alert alert-danger container mt-4">{error}</div>;
  }
  if (!person) {
    return <div className="container mt-4">Načítám data osoby...</div>;
  }

  const country = Country.CZECHIA === person.country ? "Česká republika" : "Slovensko";

  return (
    <div className="container mt-4 person-detail-page">
      <div className="person-detail-header">
        <h1 className="person-detail-title">{person.name}</h1>
        <Link to="/persons" className="person-detail-backbtn">
          Zpět na seznam osob
        </Link>
      </div>

      <div className="person-detail-columns">
        <div className="person-detail-col">
          <div className="person-detail-card">
            <div className="person-detail-cardheader">Kontaktní a fakturační údaje</div>
            <div className="person-detail-cardbody">
              <p>
                <strong>IČO:</strong> {person.identificationNumber} <br />
                <strong>DIČ:</strong> {person.taxNumber || "Není plátce DPH"}
              </p>
              <p>
                <strong>E-mail:</strong> <a href={`mailto:${person.mail}`}>{person.mail}</a> <br />
                <strong>Telefon:</strong> <a href={`tel:${person.telephone}`}>{person.telephone}</a>
              </p>
              <p>
                <strong>Bankovní účet:</strong> {person.accountNumber}/{person.bankCode} <br/>
                <strong>IBAN:</strong> {person.iban}
              </p>
            </div>
          </div>
        </div>
        <div className="person-detail-col">
          <div className="person-detail-card">
            <div className="person-detail-cardheader">Adresa a poznámka</div>
            <div className="person-detail-cardbody">
              <p>
                <strong>Sídlo:</strong> <br />
                {person.street}, {person.zip} {person.city} <br />
                {country}
              </p>
              {person.note && (
                <p className="person-detail-note">
                  <strong>Poznámka:</strong> <br />
                  <em>{person.note}</em>
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      <hr className="my-4" />

      {/* ==== FAKTURY V KARTĚ ==== */}
      <div className="invoice-card">
        <div className="person-detail-actions">
          <button
            className={`person-detail-actionbtn${viewType === "issued" ? " active" : ""}`}
            onClick={() => setViewType("issued")}
          >
            Vystavené faktury
          </button>
          <button
            className={`person-detail-actionbtn${viewType === "received" ? " active" : ""}`}
            onClick={() => setViewType("received")}
          >
            Přijaté faktury
          </button>
        </div>

       {viewType && (
  <>
    {(() => {
      const stats = getInvoiceStats(invoices);
      return (
        <div className="person-invoice-summary">
          <p>
            {viewType === "issued" ? "Celkový příjem" : "Celkové výdaje"}:{" "}
            <strong>{stats.sum.toLocaleString("cs-CZ")} Kč</strong><br />
            Počet faktur: <strong>{stats.count}</strong>
          </p>
        </div>
      );
    })()}

    <h4 className="person-detail-section-title">
      {viewType === "issued" ? "Vystavené faktury" : "Přijaté faktury"}:
    </h4>

            <div className="invoice-table-wrapper">
              {invoices.length === 0 ? (
                <div className="person-invoice-empty">
                  Žádné faktury k zobrazení.
                </div>
              ) : (
                <table className="person-detail-table">
                  <thead>
                    <tr>
                      <th>Číslo faktury</th>
                      <th>Produkt</th>
                      <th>Cena</th>
                      <th>Kupující</th>
                      <th>Prodávající</th>
                    </tr>
                  </thead>
                  <tbody>
                    {invoices.map((inv) => (
                      <tr key={inv.invoiceId}>
                        <td>{inv.invoiceNumber}</td>
                        <td>{inv.product}</td>
                        <td>{Number(inv.price).toLocaleString("cs-CZ")} Kč</td>
                  <td>
  {inv.buyer?.name || findPersonName(inv.buyerId)}
</td>
<td>
  {inv.seller?.name || findPersonName(inv.sellerId)}
</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </>
        )}
      </div>
      {/* ===== KONEC .invoice-card ===== */}
    </div>
  );
};

export default PersonDetail;
