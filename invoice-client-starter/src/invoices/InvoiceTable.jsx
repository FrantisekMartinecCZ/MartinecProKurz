import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../css/InvoiceTable.css"; // Import stylů pro faktury

const InvoiceTable = ({ items, deleteInvoice, label }) => {
  const [persons, setPersons] = useState([]);

  useEffect(() => {
    fetch('/api/persons')
      .then(res => res.json())
      .then(data => setPersons(data));
  }, []);

  // Najde osobu podle ID (string/cislo tolerantne)
  const findPersonName = (id) => {
    if (!id) return '';
    const idStr = String(id);
    const person = persons.find(
      p => String(p.personId) === idStr || String(p._id) === idStr || String(p.id) === idStr
    );
    return person ? person.name : `ID: ${id}`;
  };

  return (
    <div className="table-card">
      <div className="table-card-header">
        <h5 className="table-title">
          {label} <span className="table-badge">{items.length}</span>
        </h5>
      </div>
      <div className="table-card-body">
        <div className="table-scroll">
          <table className="invoice-table">
            <thead>
              <tr>
                <th>Číslo faktury</th>
                <th>Produkt</th>
                <th>Cena</th>
                <th>Kupující</th>
                <th>Prodávající</th>
                <th className="text-center">Akce</th>
              </tr>
            </thead>
            <tbody>
              {items.length > 0 ? (
                items.map((invoice) => (
                  <tr key={invoice._id || invoice.invoiceId}>
                    <td>{invoice.invoiceNumber}</td>
                    <td>{invoice.product}</td>
                    <td>{invoice.price.toLocaleString("cs-CZ")} Kč</td>
                    <td>
                      {invoice.buyer
                        ? (
                          <Link
                            to={`/persons/show/${invoice.buyer?.personId || invoice.buyer?.id || invoice.buyer?._id}`}
                            className="table-link"
                          >
                            {invoice.buyer?.name}
                          </Link>
                        )
                        : invoice.buyerId
                          ? (
                            <Link
                              to={`/persons/show/${invoice.buyerId}`}
                              className="table-link"
                            >
                              {findPersonName(invoice.buyerId)}
                            </Link>
                          )
                          : <span style={{ color: 'red' }}>žádný kupující</span>
                      }
                    </td>
                    <td>
                      {invoice.seller
                        ? (
                          <Link
                            to={`/persons/show/${invoice.seller?.personId || invoice.seller?.id || invoice.seller?._id}`}
                            className="table-link"
                          >
                            {invoice.seller?.name}
                          </Link>
                        )
                        : invoice.sellerId
                          ? (
                            <Link to={`/persons/show/${invoice.sellerId}`} className="table-link">
                              {findPersonName(invoice.sellerId)}
                            </Link>
                          )
                          : <span style={{ color: 'red' }}>žádný prodávající</span>
                      }
                    </td>
                    <td className="text-center">
                      <div className="invoice-detail-action-group">
                        <Link
                          to={`/invoices/show/${invoice._id || invoice.invoiceId}`}
                          className="invoice-form-action-btn info"
                          title="Zobrazit detail"
                        >
                          Zobrazit
                        </Link>
                        <Link
                          to={`/invoices/edit/${invoice._id || invoice.invoiceId}`}
                          className="invoice-form-action-btn warn"
                          title="Upravit fakturu"
                        >
                          Upravit
                        </Link>
                        <button
                          onClick={() => deleteInvoice(invoice._id || invoice.invoiceId)}
                          className="invoice-form-action-btn danger"
                          title="Smazat fakturu"
                        >
                          Smazat
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="table-empty">
                    Nebyly nalezeny žádné faktury.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default InvoiceTable;
