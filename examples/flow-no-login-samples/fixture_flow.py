#!/usr/bin/env python3
"""Offline predefined invoice-to-CSV fixture. NOT OCR or a networked Flow request."""
import csv
from decimal import Decimal
from pathlib import Path
import sys
FIELDS = ("Supplier", "Invoice", "Date", "Currency", "Subtotal", "Tax", "Total")
SOURCE = Path(__file__).with_name("fixture_invoice.txt")
def parse_fixture(path):
    rows = path.read_text(encoding="utf-8").splitlines()
    if not rows or not rows[0].startswith("FICTIONAL SAMPLE"):
        raise ValueError("Only synthetic included fixtures are accepted")
    record = dict(line.split(": ", 1) for line in rows[1:] if ": " in line)
    missing = set(FIELDS) - set(record)
    if missing: raise ValueError("Missing: " + ", ".join(sorted(missing)))
    if Decimal(record["Subtotal"]) + Decimal(record["Tax"]) != Decimal(record["Total"]):
        raise ValueError("Totals mismatch")
    return {key:record[key] for key in FIELDS}
def main():
    sample = parse_fixture(SOURCE)
    out = csv.DictWriter(sys.stdout, fieldnames=FIELDS,lineterminator="\n")
    out.writeheader()
    out.writerow(sample)
if __name__=="__main__":
    main()
