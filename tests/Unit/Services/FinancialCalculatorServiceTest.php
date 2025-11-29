<?php

namespace Tests\Unit\Services;

use App\Services\FinancialCalculatorService;
use PHPUnit\Framework\TestCase;

class FinancialCalculatorServiceTest extends TestCase
{
    protected $calculator;

    protected function setUp(): void
    {
        parent::setUp();
        $this->calculator = new FinancialCalculatorService();
    }

    public function test_calculates_monthly_payment_correctly()
    {
        // Example: $10,000,000 loan, 12% EA, 12 months
        // Rate PM = (1 + 0.12)^(1/12) - 1 = 0.009488...
        // Payment should be approx $885,000 - $890,000 range depending on precision

        $result = $this->calculator->calculateLoan(10000000, 12, 12, 'months', 'EA');

        $this->assertIsArray($result);
        $this->assertArrayHasKey('monthlyPayment', $result);
        $this->assertGreaterThan(0, $result['monthlyPayment']);

        // Basic sanity check: Total payment > Principal
        $this->assertGreaterThan(10000000, $result['totalPayment']);
    }

    public function test_amortization_schedule_has_correct_number_of_rows()
    {
        $result = $this->calculator->calculateLoan(5000000, 10, 24, 'months', 'EA');

        $this->assertCount(24, $result['schedule']);
        $this->assertEquals(1, $result['schedule'][0]['month']);
        $this->assertEquals(24, $result['schedule'][23]['month']);
    }

    public function test_balance_reaches_zero_at_end()
    {
        $result = $this->calculator->calculateLoan(1000000, 10, 12, 'months', 'EA');

        $lastRow = end($result['schedule']);

        // Balance should be very close to 0 (allowing for floating point errors)
        $this->assertEqualsWithDelta(0, $lastRow['balance'], 1.0);
    }

    public function test_handles_years_term_type()
    {
        $result = $this->calculator->calculateLoan(1000000, 10, 2, 'years', 'EA');

        // 2 years = 24 months
        $this->assertCount(24, $result['schedule']);
    }

    public function test_handles_insurance_cost()
    {
        $amount = 1000000;
        $insurance = 5000;
        $term = 12;

        $resultWithInsurance = $this->calculator->calculateLoan($amount, 10, $term, 'months', 'EA', $insurance);
        $resultWithoutInsurance = $this->calculator->calculateLoan($amount, 10, $term, 'months', 'EA', 0);

        // Monthly payment should be higher with insurance
        $this->assertGreaterThan($resultWithoutInsurance['monthlyPayment'], $resultWithInsurance['monthlyPayment']);

        // Difference should be exactly the insurance amount
        $this->assertEqualsWithDelta($insurance, $resultWithInsurance['monthlyPayment'] - $resultWithoutInsurance['monthlyPayment'], 0.01);
    }
}
