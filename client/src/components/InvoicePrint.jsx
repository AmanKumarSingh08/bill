const _jsxFileName = "";import {jsxDEV as _jsxDEV} from "react/jsx-dev-runtime"; function _nullishCoalesce(lhs, rhsFn) { if (lhs != null) { return lhs; } else { return rhsFn(); } }import { forwardRef } from 'react';

import { formatCurrency, formatDate, numberToWords } from '../lib/utils';







const InvoiceCopy = ({ invoice, settings, copyLabel }) => {
  const items = _nullishCoalesce(invoice.invoice_items, () => ( []));

  // Build tax summary rows grouped by rate
  const taxMap = {};
  items.forEach(item => {
    if (item.sgst_rate > 0) {
      const key = `sgst_${item.sgst_rate}`;
      if (!taxMap[key]) taxMap[key] = { taxable: 0, rate: item.sgst_rate, tax: 0, type: 'SGST' };
      taxMap[key].taxable += item.taxable_amount;
      taxMap[key].tax += item.sgst_amount;
    }
    if (item.cgst_rate > 0) {
      const key = `cgst_${item.cgst_rate}`;
      if (!taxMap[key]) taxMap[key] = { taxable: 0, rate: item.cgst_rate, tax: 0, type: 'CGST' };
      taxMap[key].taxable += item.taxable_amount;
      taxMap[key].tax += item.cgst_amount;
    }
  });
  const taxRows = Object.values(taxMap);

  const totalQty = items.reduce((s, i) => s + i.quantity, 0);

  return (
    _jsxDEV('div', { style: {
      fontFamily: 'Arial, sans-serif',
      fontSize: '11px',
      color: '#000',
      width: '210mm',
      minHeight: '148mm',
      padding: '6mm 8mm',
      boxSizing: 'border-box',
      backgroundColor: '#fff',
    }, children: [
      /* Header row: Tax Invoice centered, copy label right */
      _jsxDEV('div', { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }, children: [
        _jsxDEV('div', { style: { flex: 1 },}, void 0, false, {fileName: _jsxFileName, lineNumber: 47}, this )
        , _jsxDEV('div', { style: { flex: 1, textAlign: 'center', fontWeight: 'bold', fontSize: '13px' }, children: "Tax Invoice" }, void 0, false, {fileName: _jsxFileName, lineNumber: 48}, this)
        , _jsxDEV('div', { style: { flex: 1, textAlign: 'right', fontSize: '10px', color: '#555' }, children: 
          copyLabel || 'ORIGINAL FOR RECIPIENT'
        }, void 0, false, {fileName: _jsxFileName, lineNumber: 49}, this)
      ]}, void 0, true, {fileName: _jsxFileName, lineNumber: 46}, this)

      /* Business header */
      , _jsxDEV('div', { style: { display: 'flex', alignItems: 'flex-start', borderBottom: '1px solid #000', paddingBottom: '4px', marginBottom: '0' }, children: [
        _jsxDEV('div', { style: { marginRight: '10px', width: '52px', height: '52px', flexShrink: 0 }, children: 
          settings.logo_url ? (
            _jsxDEV('img', { src: settings.logo_url, alt: "logo", style: { width: '52px', height: '52px', objectFit: 'contain' },}, void 0, false, {fileName: _jsxFileName, lineNumber: 58}, this )
          ) : (
            _jsxDEV('div', { style: { width: '52px', height: '52px', background: '#e0f2fe', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '4px' }, children: 
              _jsxDEV('span', { style: { fontSize: '20px' }, children: "🥛"}, void 0, false, {fileName: _jsxFileName, lineNumber: 61}, this)
            }, void 0, false, {fileName: _jsxFileName, lineNumber: 60}, this)
          )
        }, void 0, false, {fileName: _jsxFileName, lineNumber: 56}, this)
        , _jsxDEV('div', { style: { flex: 1, textAlign: 'right' }, children: [
          _jsxDEV('div', { style: { fontWeight: 'bold', fontSize: '18px', marginBottom: '2px' }, children: settings.business_name}, void 0, false, {fileName: _jsxFileName, lineNumber: 66}, this)
          , _jsxDEV('div', { style: { fontSize: '10px' }, children: settings.address}, void 0, false, {fileName: _jsxFileName, lineNumber: 67}, this)
          , _jsxDEV('div', { style: { fontSize: '10px' }, children: ["Phone no.: "  , settings.phone, " Email: "  , settings.email]}, void 0, true, {fileName: _jsxFileName, lineNumber: 68}, this)
          , _jsxDEV('div', { style: { fontSize: '10px' }, children: ["GSTIN: " , settings.gstin, ", State: "  , settings.state]}, void 0, true, {fileName: _jsxFileName, lineNumber: 69}, this)
        ]}, void 0, true, {fileName: _jsxFileName, lineNumber: 65}, this)
      ]}, void 0, true, {fileName: _jsxFileName, lineNumber: 55}, this)

      /* Bill To / Ship To / Transport / Invoice Details - 4 column header */
      , _jsxDEV('table', { style: { width: '100%', borderCollapse: 'collapse', border: '1px solid #000', marginTop: '0' }, children: 
        _jsxDEV('tbody', { children: [
          _jsxDEV('tr', { children: [
            _jsxDEV('td', { style: { border: '1px solid #000', padding: '3px 5px', verticalAlign: 'top', width: '25%', fontWeight: 'bold', backgroundColor: '#f3f3f3' }, children: "Bill To" }, void 0, false, {fileName: _jsxFileName, lineNumber: 77}, this)
            , _jsxDEV('td', { style: { border: '1px solid #000', padding: '3px 5px', verticalAlign: 'top', width: '25%', fontWeight: 'bold', backgroundColor: '#f3f3f3' }, children: "Ship To" }, void 0, false, {fileName: _jsxFileName, lineNumber: 78}, this)
            , _jsxDEV('td', { style: { border: '1px solid #000', padding: '3px 5px', verticalAlign: 'top', width: '25%', fontWeight: 'bold', backgroundColor: '#f3f3f3' }, children: "Transportation Details" }, void 0, false, {fileName: _jsxFileName, lineNumber: 79}, this)
            , _jsxDEV('td', { style: { border: '1px solid #000', padding: '3px 5px', verticalAlign: 'top', width: '25%', fontWeight: 'bold', backgroundColor: '#f3f3f3', textAlign: 'right' }, children: "Invoice Details" }, void 0, false, {fileName: _jsxFileName, lineNumber: 80}, this)
          ]}, void 0, true, {fileName: _jsxFileName, lineNumber: 76}, this)
          , _jsxDEV('tr', { children: [
            _jsxDEV('td', { style: { border: '1px solid #000', padding: '3px 5px', verticalAlign: 'top' }, children: [
              _jsxDEV('div', { style: { fontWeight: 'bold' }, children: invoice.customer_name}, void 0, false, {fileName: _jsxFileName, lineNumber: 84}, this)
              , _jsxDEV('div', { style: { marginTop: '2px' }, children: invoice.customer_address}, void 0, false, {fileName: _jsxFileName, lineNumber: 85}, this)
              , invoice.customer_mobile && _jsxDEV('div', { children: ["Contact No. : "   , invoice.customer_mobile]}, void 0, true, {fileName: _jsxFileName, lineNumber: 86}, this)
              , invoice.customer_gstin && _jsxDEV('div', { children: ["GSTIN: " , invoice.customer_gstin]}, void 0, true, {fileName: _jsxFileName, lineNumber: 87}, this)
            ]}, void 0, true, {fileName: _jsxFileName, lineNumber: 83}, this)
            , _jsxDEV('td', { style: { border: '1px solid #000', padding: '3px 5px', verticalAlign: 'top' }, children: 
              invoice.ship_to
            }, void 0, false, {fileName: _jsxFileName, lineNumber: 89}, this)
            , _jsxDEV('td', { style: { border: '1px solid #000', padding: '3px 5px', verticalAlign: 'top' }, children: [
              _jsxDEV('div', { children: ["Transport Name: "  , invoice.transport_name]}, void 0, true, {fileName: _jsxFileName, lineNumber: 93}, this)
              , _jsxDEV('div', { style: { marginTop: '2px' }, children: ["Vehicle Number: "  , invoice.vehicle_number]}, void 0, true, {fileName: _jsxFileName, lineNumber: 94}, this)
            ]}, void 0, true, {fileName: _jsxFileName, lineNumber: 92}, this)
            , _jsxDEV('td', { style: { border: '1px solid #000', padding: '3px 5px', verticalAlign: 'top', textAlign: 'right' }, children: [
              _jsxDEV('div', { children: ["Invoice No. : "   , invoice.invoice_no]}, void 0, true, {fileName: _jsxFileName, lineNumber: 97}, this)
              , _jsxDEV('div', { style: { marginTop: '2px' }, children: ["Date : "  , formatDate(invoice.invoice_date)]}, void 0, true, {fileName: _jsxFileName, lineNumber: 98}, this)
              , invoice.due_date && _jsxDEV('div', { style: { marginTop: '2px' }, children: ["Due Date : "   , formatDate(invoice.due_date)]}, void 0, true, {fileName: _jsxFileName, lineNumber: 99}, this)
            ]}, void 0, true, {fileName: _jsxFileName, lineNumber: 96}, this)
          ]}, void 0, true, {fileName: _jsxFileName, lineNumber: 82}, this)
        ]}, void 0, true, {fileName: _jsxFileName, lineNumber: 75}, this)
      }, void 0, false, {fileName: _jsxFileName, lineNumber: 74}, this)

      /* Items table */
      , _jsxDEV('table', { style: { width: '100%', borderCollapse: 'collapse', border: '1px solid #000', marginTop: '0', borderTop: 'none' }, children: [
        _jsxDEV('thead', { children: 
          _jsxDEV('tr', { style: { backgroundColor: '#f3f3f3' }, children: [
            _jsxDEV('th', { style: { border: '1px solid #000', padding: '3px 4px', textAlign: 'center', width: '4%' }, children: "#"}, void 0, false, {fileName: _jsxFileName, lineNumber: 109}, this)
            , _jsxDEV('th', { style: { border: '1px solid #000', padding: '3px 4px', textAlign: 'left', width: '22%' }, children: "Item name" }, void 0, false, {fileName: _jsxFileName, lineNumber: 110}, this)
            , _jsxDEV('th', { style: { border: '1px solid #000', padding: '3px 4px', textAlign: 'center', width: '9%' }, children: "HSN/ SAC" }, void 0, false, {fileName: _jsxFileName, lineNumber: 111}, this)
            , _jsxDEV('th', { style: { border: '1px solid #000', padding: '3px 4px', textAlign: 'center', width: '7%' }, children: "Quantity"}, void 0, false, {fileName: _jsxFileName, lineNumber: 112}, this)
            , _jsxDEV('th', { style: { border: '1px solid #000', padding: '3px 4px', textAlign: 'center', width: '7%' }, children: "Unit"}, void 0, false, {fileName: _jsxFileName, lineNumber: 113}, this)
            , _jsxDEV('th', { style: { border: '1px solid #000', padding: '3px 4px', textAlign: 'right', width: '9%' }, children: "Price/ Unit" }, void 0, false, {fileName: _jsxFileName, lineNumber: 114}, this)
            , _jsxDEV('th', { style: { border: '1px solid #000', padding: '3px 4px', textAlign: 'right', width: '10%' }, children: "Taxable amount" }, void 0, false, {fileName: _jsxFileName, lineNumber: 115}, this)
            , _jsxDEV('th', { style: { border: '1px solid #000', padding: '3px 4px', textAlign: 'right', width: '11%' }, children: "CGST"}, void 0, false, {fileName: _jsxFileName, lineNumber: 116}, this)
            , _jsxDEV('th', { style: { border: '1px solid #000', padding: '3px 4px', textAlign: 'right', width: '11%' }, children: "SGST"}, void 0, false, {fileName: _jsxFileName, lineNumber: 117}, this)
            , _jsxDEV('th', { style: { border: '1px solid #000', padding: '3px 4px', textAlign: 'right', width: '10%' }, children: "Amount"}, void 0, false, {fileName: _jsxFileName, lineNumber: 118}, this)
          ]}, void 0, true, {fileName: _jsxFileName, lineNumber: 108}, this)
        }, void 0, false, {fileName: _jsxFileName, lineNumber: 107}, this)
        , _jsxDEV('tbody', { children: [
          items.map((item, idx) => (
            _jsxDEV('tr', { children: [
              _jsxDEV('td', { style: { border: '1px solid #000', padding: '3px 4px', textAlign: 'center' }, children: idx + 1}, void 0, false, {fileName: _jsxFileName, lineNumber: 124}, this)
              , _jsxDEV('td', { style: { border: '1px solid #000', padding: '3px 4px', fontWeight: 'bold' }, children: item.item_name}, void 0, false, {fileName: _jsxFileName, lineNumber: 125}, this)
              , _jsxDEV('td', { style: { border: '1px solid #000', padding: '3px 4px', textAlign: 'center' }, children: item.hsn_code}, void 0, false, {fileName: _jsxFileName, lineNumber: 126}, this)
              , _jsxDEV('td', { style: { border: '1px solid #000', padding: '3px 4px', textAlign: 'center' }, children: item.quantity}, void 0, false, {fileName: _jsxFileName, lineNumber: 127}, this)
              , _jsxDEV('td', { style: { border: '1px solid #000', padding: '3px 4px', textAlign: 'center' }, children: item.unit}, void 0, false, {fileName: _jsxFileName, lineNumber: 128}, this)
              , _jsxDEV('td', { style: { border: '1px solid #000', padding: '3px 4px', textAlign: 'right' }, children: ["₹ " , formatCurrency(item.price_per_unit)]}, void 0, true, {fileName: _jsxFileName, lineNumber: 129}, this)
              , _jsxDEV('td', { style: { border: '1px solid #000', padding: '3px 4px', textAlign: 'right' }, children: ["₹ " , formatCurrency(item.taxable_amount)]}, void 0, true, {fileName: _jsxFileName, lineNumber: 130}, this)
              , _jsxDEV('td', { style: { border: '1px solid #000', padding: '3px 4px', textAlign: 'right' }, children: ["₹ "
                 , formatCurrency(item.cgst_amount), " (" , item.cgst_rate, "%)"
              ]}, void 0, true, {fileName: _jsxFileName, lineNumber: 131}, this)
              , _jsxDEV('td', { style: { border: '1px solid #000', padding: '3px 4px', textAlign: 'right' }, children: ["₹ "
                 , formatCurrency(item.sgst_amount), " (" , item.sgst_rate, "%)"
              ]}, void 0, true, {fileName: _jsxFileName, lineNumber: 134}, this)
              , _jsxDEV('td', { style: { border: '1px solid #000', padding: '3px 4px', textAlign: 'right' }, children: ["₹ " , formatCurrency(item.amount)]}, void 0, true, {fileName: _jsxFileName, lineNumber: 137}, this)
            ]}, idx, true, {fileName: _jsxFileName, lineNumber: 123}, this)
          ))
          /* Empty rows for spacing */
          , items.length < 6 && Array.from({ length: 6 - items.length }).map((_, i) => (
            _jsxDEV('tr', { style: { height: '20px' }, children: 
              Array.from({ length: 10 }).map((_, j) => (
                _jsxDEV('td', { style: { border: '1px solid #000', padding: '3px 4px' }, children: " "}, j, false, {fileName: _jsxFileName, lineNumber: 144}, this)
              ))
            }, `empty-${i}`, false, {fileName: _jsxFileName, lineNumber: 142}, this)
          ))
          /* Total row */
          , _jsxDEV('tr', { style: { fontWeight: 'bold', backgroundColor: '#f3f3f3' }, children: [
            _jsxDEV('td', { style: { border: '1px solid #000', padding: '3px 4px' },}, void 0, false, {fileName: _jsxFileName, lineNumber: 150}, this)
            , _jsxDEV('td', { style: { border: '1px solid #000', padding: '3px 4px', fontWeight: 'bold' }, children: "Total"}, void 0, false, {fileName: _jsxFileName, lineNumber: 151}, this)
            , _jsxDEV('td', { style: { border: '1px solid #000', padding: '3px 4px' },}, void 0, false, {fileName: _jsxFileName, lineNumber: 152}, this)
            , _jsxDEV('td', { style: { border: '1px solid #000', padding: '3px 4px', textAlign: 'center', fontWeight: 'bold' }, children: totalQty}, void 0, false, {fileName: _jsxFileName, lineNumber: 153}, this)
            , _jsxDEV('td', { style: { border: '1px solid #000', padding: '3px 4px' },}, void 0, false, {fileName: _jsxFileName, lineNumber: 154}, this)
            , _jsxDEV('td', { style: { border: '1px solid #000', padding: '3px 4px' },}, void 0, false, {fileName: _jsxFileName, lineNumber: 155}, this)
            , _jsxDEV('td', { style: { border: '1px solid #000', padding: '3px 4px', textAlign: 'right', fontWeight: 'bold' }, children: ["₹ " , formatCurrency(invoice.taxable_total)]}, void 0, true, {fileName: _jsxFileName, lineNumber: 156}, this)
            , _jsxDEV('td', { style: { border: '1px solid #000', padding: '3px 4px', textAlign: 'right', fontWeight: 'bold' }, children: ["₹ " , formatCurrency(invoice.cgst_total)]}, void 0, true, {fileName: _jsxFileName, lineNumber: 157}, this)
            , _jsxDEV('td', { style: { border: '1px solid #000', padding: '3px 4px', textAlign: 'right', fontWeight: 'bold' }, children: ["₹ " , formatCurrency(invoice.sgst_total)]}, void 0, true, {fileName: _jsxFileName, lineNumber: 158}, this)
            , _jsxDEV('td', { style: { border: '1px solid #000', padding: '3px 4px', textAlign: 'right', fontWeight: 'bold' }, children: ["₹ " , formatCurrency(invoice.sub_total)]}, void 0, true, {fileName: _jsxFileName, lineNumber: 159}, this)
          ]}, void 0, true, {fileName: _jsxFileName, lineNumber: 149}, this)
        ]}, void 0, true, {fileName: _jsxFileName, lineNumber: 121}, this)
      ]}, void 0, true, {fileName: _jsxFileName, lineNumber: 106}, this)

      /* Tax summary + Amounts section */
      , _jsxDEV('table', { style: { width: '100%', borderCollapse: 'collapse', border: '1px solid #000', borderTop: 'none' }, children: 
        _jsxDEV('tbody', { children: 
          _jsxDEV('tr', { children: [
            /* Tax table left side */
            _jsxDEV('td', { style: { border: '1px solid #000', padding: '0', verticalAlign: 'top', width: '55%' }, children: 
              _jsxDEV('table', { style: { width: '100%', borderCollapse: 'collapse' }, children: [
                _jsxDEV('thead', { children: 
                  _jsxDEV('tr', { style: { backgroundColor: '#f3f3f3' }, children: [
                    _jsxDEV('th', { style: { border: '1px solid #ccc', padding: '3px 5px', textAlign: 'left', width: '30%' }, children: "Tax type" }, void 0, false, {fileName: _jsxFileName, lineNumber: 173}, this)
                    , _jsxDEV('th', { style: { border: '1px solid #ccc', padding: '3px 5px', textAlign: 'right', width: '30%' }, children: "Taxable amount" }, void 0, false, {fileName: _jsxFileName, lineNumber: 174}, this)
                    , _jsxDEV('th', { style: { border: '1px solid #ccc', padding: '3px 5px', textAlign: 'center', width: '15%' }, children: "Rate"}, void 0, false, {fileName: _jsxFileName, lineNumber: 175}, this)
                    , _jsxDEV('th', { style: { border: '1px solid #ccc', padding: '3px 5px', textAlign: 'right', width: '25%' }, children: "Tax amount" }, void 0, false, {fileName: _jsxFileName, lineNumber: 176}, this)
                  ]}, void 0, true, {fileName: _jsxFileName, lineNumber: 172}, this)
                }, void 0, false, {fileName: _jsxFileName, lineNumber: 171}, this)
                , _jsxDEV('tbody', { children: 
                  taxRows.map((row, i) => (
                    _jsxDEV('tr', { children: [
                      _jsxDEV('td', { style: { border: '1px solid #ccc', padding: '3px 5px' }, children: row.type}, void 0, false, {fileName: _jsxFileName, lineNumber: 182}, this)
                      , _jsxDEV('td', { style: { border: '1px solid #ccc', padding: '3px 5px', textAlign: 'right' }, children: ["₹ " , formatCurrency(row.taxable)]}, void 0, true, {fileName: _jsxFileName, lineNumber: 183}, this)
                      , _jsxDEV('td', { style: { border: '1px solid #ccc', padding: '3px 5px', textAlign: 'center' }, children: [row.rate, "%"]}, void 0, true, {fileName: _jsxFileName, lineNumber: 184}, this)
                      , _jsxDEV('td', { style: { border: '1px solid #ccc', padding: '3px 5px', textAlign: 'right' }, children: ["₹ " , formatCurrency(row.tax)]}, void 0, true, {fileName: _jsxFileName, lineNumber: 185}, this)
                    ]}, i, true, {fileName: _jsxFileName, lineNumber: 181}, this)
                  ))
                }, void 0, false, {fileName: _jsxFileName, lineNumber: 179}, this)
              ]}, void 0, true, {fileName: _jsxFileName, lineNumber: 170}, this)
            }, void 0, false, {fileName: _jsxFileName, lineNumber: 169}, this)
            /* Amounts right side */
            , _jsxDEV('td', { style: { border: '1px solid #000', padding: '3px 5px', verticalAlign: 'top', width: '45%' }, children: 
              _jsxDEV('table', { style: { width: '100%', borderCollapse: 'collapse' }, children: [
                _jsxDEV('thead', { children: 
                  _jsxDEV('tr', { style: { backgroundColor: '#f3f3f3' }, children: [
                    _jsxDEV('th', { style: { padding: '2px 4px', textAlign: 'left', fontWeight: 'bold' }, children: "Amounts"}, void 0, false, {fileName: _jsxFileName, lineNumber: 196}, this)
                    , _jsxDEV('th', { style: { padding: '2px 4px' },}, void 0, false, {fileName: _jsxFileName, lineNumber: 197}, this)
                  ]}, void 0, true, {fileName: _jsxFileName, lineNumber: 195}, this)
                }, void 0, false, {fileName: _jsxFileName, lineNumber: 194}, this)
                , _jsxDEV('tbody', { children: [
                  _jsxDEV('tr', { children: [
                    _jsxDEV('td', { style: { padding: '2px 4px' }, children: "Sub Total" }, void 0, false, {fileName: _jsxFileName, lineNumber: 202}, this)
                    , _jsxDEV('td', { style: { padding: '2px 4px', textAlign: 'right' }, children: ["₹ " , formatCurrency(invoice.sub_total)]}, void 0, true, {fileName: _jsxFileName, lineNumber: 203}, this)
                  ]}, void 0, true, {fileName: _jsxFileName, lineNumber: 201}, this)
                  , _jsxDEV('tr', { children: [
                    _jsxDEV('td', { style: { padding: '2px 4px' }, children: "Round off" }, void 0, false, {fileName: _jsxFileName, lineNumber: 206}, this)
                    , _jsxDEV('td', { style: { padding: '2px 4px', textAlign: 'right' }, children: ["₹ " , formatCurrency(invoice.round_off)]}, void 0, true, {fileName: _jsxFileName, lineNumber: 207}, this)
                  ]}, void 0, true, {fileName: _jsxFileName, lineNumber: 205}, this)
                  , _jsxDEV('tr', { style: { fontWeight: 'bold' }, children: [
                    _jsxDEV('td', { style: { padding: '2px 4px' }, children: "Total"}, void 0, false, {fileName: _jsxFileName, lineNumber: 210}, this)
                    , _jsxDEV('td', { style: { padding: '2px 4px', textAlign: 'right' }, children: ["₹ " , formatCurrency(invoice.grand_total)]}, void 0, true, {fileName: _jsxFileName, lineNumber: 211}, this)
                  ]}, void 0, true, {fileName: _jsxFileName, lineNumber: 209}, this)
                  , _jsxDEV('tr', { children: [
                    _jsxDEV('td', { style: { padding: '2px 4px' }, children: "Received"}, void 0, false, {fileName: _jsxFileName, lineNumber: 214}, this)
                    , _jsxDEV('td', { style: { padding: '2px 4px', textAlign: 'right' }, children: ["₹ " , formatCurrency(invoice.received_amount)]}, void 0, true, {fileName: _jsxFileName, lineNumber: 215}, this)
                  ]}, void 0, true, {fileName: _jsxFileName, lineNumber: 213}, this)
                ]}, void 0, true, {fileName: _jsxFileName, lineNumber: 200}, this)
              ]}, void 0, true, {fileName: _jsxFileName, lineNumber: 193}, this)
            }, void 0, false, {fileName: _jsxFileName, lineNumber: 192}, this)
          ]}, void 0, true, {fileName: _jsxFileName, lineNumber: 167}, this)
        }, void 0, false, {fileName: _jsxFileName, lineNumber: 166}, this)
      }, void 0, false, {fileName: _jsxFileName, lineNumber: 165}, this)

      /* Amount in words + Payment mode */
      , _jsxDEV('table', { style: { width: '100%', borderCollapse: 'collapse', border: '1px solid #000', borderTop: 'none' }, children: 
        _jsxDEV('tbody', { children: 
          _jsxDEV('tr', { children: [
            _jsxDEV('td', { style: { border: '1px solid #000', padding: '2px 5px', width: '55%' }, children: [
              _jsxDEV('div', { style: { backgroundColor: '#f3f3f3', fontWeight: 'bold', padding: '2px 3px', marginBottom: '2px' }, children: "Invoice Amount In Words"   }, void 0, false, {fileName: _jsxFileName, lineNumber: 229}, this)
              , _jsxDEV('div', { style: { padding: '2px 3px' }, children: numberToWords(invoice.grand_total)}, void 0, false, {fileName: _jsxFileName, lineNumber: 230}, this)
            ]}, void 0, true, {fileName: _jsxFileName, lineNumber: 228}, this)
            , _jsxDEV('td', { style: { border: '1px solid #000', padding: '2px 5px', width: '45%', textAlign: 'center' }, children: [
              _jsxDEV('div', { style: { backgroundColor: '#f3f3f3', fontWeight: 'bold', padding: '2px 3px', marginBottom: '2px' }, children: "Payment mode" }, void 0, false, {fileName: _jsxFileName, lineNumber: 233}, this)
              , _jsxDEV('div', { style: { padding: '2px 3px' }, children: invoice.payment_mode}, void 0, false, {fileName: _jsxFileName, lineNumber: 234}, this)
            ]}, void 0, true, {fileName: _jsxFileName, lineNumber: 232}, this)
          ]}, void 0, true, {fileName: _jsxFileName, lineNumber: 227}, this)
        }, void 0, false, {fileName: _jsxFileName, lineNumber: 226}, this)
      }, void 0, false, {fileName: _jsxFileName, lineNumber: 225}, this)

      /* Bank Details + Terms + Signature */
      , _jsxDEV('table', { style: { width: '100%', borderCollapse: 'collapse', border: '1px solid #000', borderTop: 'none' }, children: 
        _jsxDEV('tbody', { children: 
          _jsxDEV('tr', { children: [
            _jsxDEV('td', { style: { border: '1px solid #000', padding: '3px 5px', verticalAlign: 'top', width: '40%' }, children: [
              _jsxDEV('div', { style: { fontWeight: 'bold', marginBottom: '3px', backgroundColor: '#f3f3f3', padding: '2px 3px' }, children: "Bank Details" }, void 0, false, {fileName: _jsxFileName, lineNumber: 245}, this)
              , _jsxDEV('div', { children: ["Name : "  , settings.bank_name]}, void 0, true, {fileName: _jsxFileName, lineNumber: 246}, this)
              , _jsxDEV('div', { children: ["Account No. : "   , settings.account_no]}, void 0, true, {fileName: _jsxFileName, lineNumber: 247}, this)
              , _jsxDEV('div', { children: ["IFSC code : "   , settings.ifsc_code]}, void 0, true, {fileName: _jsxFileName, lineNumber: 248}, this)
              , _jsxDEV('div', { children: ["Account holder's name : "    , settings.account_holder]}, void 0, true, {fileName: _jsxFileName, lineNumber: 249}, this)
            ]}, void 0, true, {fileName: _jsxFileName, lineNumber: 244}, this)
            , _jsxDEV('td', { style: { border: '1px solid #000', padding: '3px 5px', verticalAlign: 'top', width: '35%' }, children: [
              _jsxDEV('div', { style: { fontWeight: 'bold', marginBottom: '3px', backgroundColor: '#f3f3f3', padding: '2px 3px' }, children: "Terms and Conditions"  }, void 0, false, {fileName: _jsxFileName, lineNumber: 252}, this)
              , _jsxDEV('div', { style: { whiteSpace: 'pre-wrap', fontSize: '10px' }, children: settings.terms}, void 0, false, {fileName: _jsxFileName, lineNumber: 253}, this)
            ]}, void 0, true, {fileName: _jsxFileName, lineNumber: 251}, this)
            , _jsxDEV('td', { style: { border: '1px solid #000', padding: '3px 5px', verticalAlign: 'top', width: '25%', textAlign: 'center' }, children: [
              _jsxDEV('div', { style: { textAlign: 'right', marginBottom: '4px', fontSize: '10px' }, children: ["For : "  , settings.business_name]}, void 0, true, {fileName: _jsxFileName, lineNumber: 256}, this)
              , _jsxDEV('div', { style: { minHeight: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center' }, children: 
                settings.signature_url && (
                  _jsxDEV('img', { src: settings.signature_url, alt: "signature", style: { maxHeight: '40px', maxWidth: '100px', objectFit: 'contain' },}, void 0, false, {fileName: _jsxFileName, lineNumber: 259}, this )
                )
              }, void 0, false, {fileName: _jsxFileName, lineNumber: 257}, this)
              , _jsxDEV('div', { style: { marginTop: '4px', fontWeight: 'bold', fontSize: '10px', borderTop: '1px solid #000', paddingTop: '2px' }, children: "Authorized Signatory" }, void 0, false, {fileName: _jsxFileName, lineNumber: 262}, this)
            ]}, void 0, true, {fileName: _jsxFileName, lineNumber: 255}, this)
          ]}, void 0, true, {fileName: _jsxFileName, lineNumber: 243}, this)
        }, void 0, false, {fileName: _jsxFileName, lineNumber: 242}, this)
      }, void 0, false, {fileName: _jsxFileName, lineNumber: 241}, this)
    ]}, void 0, true, {fileName: _jsxFileName, lineNumber: 35}, this)
  );
};

const InvoicePrint = forwardRef(
  ({ invoice, settings }, ref) => {
    return (
      _jsxDEV('div', { ref: ref, children: [
        /* Page 1: Original */
        _jsxDEV('div', { style: { pageBreakAfter: 'always' }, children: 
          _jsxDEV(InvoiceCopy, { invoice: invoice, settings: settings, copyLabel: "ORIGINAL FOR RECIPIENT"  ,}, void 0, false, {fileName: _jsxFileName, lineNumber: 277}, this )
        }, void 0, false, {fileName: _jsxFileName, lineNumber: 276}, this)
        /* Page 2: Duplicate */
        , _jsxDEV('div', { children: 
          _jsxDEV(InvoiceCopy, { invoice: invoice, settings: settings, copyLabel: "DUPLICATE FOR TRANSPORTATION"  ,}, void 0, false, {fileName: _jsxFileName, lineNumber: 281}, this )
        }, void 0, false, {fileName: _jsxFileName, lineNumber: 280}, this)
      ]}, void 0, true, {fileName: _jsxFileName, lineNumber: 274}, this)
    );
  }
);

InvoicePrint.displayName = 'InvoicePrint';
export default InvoicePrint;
