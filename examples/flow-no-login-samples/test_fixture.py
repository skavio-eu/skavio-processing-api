import unittest
from pathlib import Path
import tempfile
from decimal import Decimal
from fixture_flow import SOURCE,parse_fixture
class FixtureTest(unittest.TestCase):
    def test_reconciles_total_and_expected_fictional_fields(self):
        row=parse_fixture(SOURCE)
        self.assertEqual(row["Invoice"],"INV-2026-014")
        self.assertEqual(row["Supplier"],"Example Supplies LLC")
        self.assertEqual(Decimal(row["Subtotal"])+Decimal(row["Tax"]),Decimal(row["Total"]))
    def test_blocks_nonfixture_documents(self):
        with tempfile.TemporaryDirectory() as tmp:
            p=Path(tmp)/"unknown.txt"
            p.write_text("Supplier: Private Customer\n",encoding="utf-8")
            with self.assertRaises(ValueError):parse_fixture(p)
if __name__=="__main__":
    unittest.main()
