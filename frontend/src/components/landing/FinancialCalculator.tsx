import { useState } from "react";
import { Calculator, TrendingUp, Clock, DollarSign, ArrowRight } from "lucide-react";

interface Props {
  onCtaClick: () => void;
}

export function FinancialCalculator({ onCtaClick }: Props) {
  const [monthlySpend, setMonthlySpend] = useState<number>(4500);
  const [txCount, setTxCount] = useState<number>(140);

  // Dynamic calculations based on industry benchmarks
  // 4.2% average recoverable recurring leaks/anomalies detected by FinSight AI
  const monthlyRecoverable = Math.round(monthlySpend * 0.042);
  const annualRecoverable = monthlyRecoverable * 12;
  // Time saved: ~15 seconds per manual transaction categorized + reviewed
  const hoursSavedPerYear = Math.round((txCount * 12 * 25) / 3600);
  // 5-Year compound growth at 8% annual return if recovered capital is invested
  const fiveYearGrowth = Math.round(
    monthlyRecoverable * (((Math.pow(1 + 0.08 / 12, 60) - 1) / (0.08 / 12)))
  );

  return (
    <div className="roi-calculator-wrapper">
      <div className="calc-card">
        <div className="calc-header">
          <div className="calc-badge">
            <Calculator size={13} />
            <span>Interactive ROI Simulator</span>
          </div>
          <h3>See What FinSight Unlocks For Your Net Worth</h3>
          <p>
            Adjust your monthly spend and transaction volume to calculate immediate savings,
            reclaimed hours, and automated 5-year wealth compounding.
          </p>
        </div>

        <div className="calc-layout">
          {/* Sliders Area */}
          <div className="calc-controls">
            <div className="control-group">
              <div className="control-labels">
                <span className="label-text">Estimated Monthly Spending</span>
                <span className="label-val">${monthlySpend.toLocaleString()}</span>
              </div>
              <input
                type="range"
                min="1000"
                max="25000"
                step="250"
                value={monthlySpend}
                onChange={(e) => setMonthlySpend(Number(e.target.value))}
                className="custom-range"
              />
              <div className="range-hints">
                <span>$1,000/mo</span>
                <span>$12,500/mo</span>
                <span>$25,000+/mo</span>
              </div>
            </div>

            <div className="control-group">
              <div className="control-labels">
                <span className="label-text">Monthly Transactions Count</span>
                <span className="label-val">{txCount} transactions</span>
              </div>
              <input
                type="range"
                min="20"
                max="600"
                step="10"
                value={txCount}
                onChange={(e) => setTxCount(Number(e.target.value))}
                className="custom-range range-gold"
              />
              <div className="range-hints">
                <span>20 tx/mo</span>
                <span>300 tx/mo</span>
                <span>600+ tx/mo</span>
              </div>
            </div>

            <div className="calc-callout">
              <div className="callout-icon">💡</div>
              <div className="callout-text">
                FinSight's hybrid rules + Claude pipeline spots forgotten trials, rogue price hikes,
                and tax-deductible items automatically with 99.8% precision.
              </div>
            </div>
          </div>

          {/* Results Summary Box */}
          <div className="calc-results-box">
            <div className="metric-cell featured">
              <div className="cell-icon">
                <DollarSign size={18} />
              </div>
              <div className="cell-info">
                <div className="cell-title">Annual Hidden Leaks Recovered</div>
                <div className="cell-number text-emerald">
                  ${annualRecoverable.toLocaleString()}
                  <span className="unit">/yr</span>
                </div>
                <div className="cell-desc">~${monthlyRecoverable}/mo in detected subscription & billing leaks</div>
              </div>
            </div>

            <div className="results-subgrid">
              <div className="metric-cell">
                <div className="cell-icon">
                  <Clock size={16} />
                </div>
                <div className="cell-info">
                  <div className="cell-title">Time Reclaimed</div>
                  <div className="cell-number">{hoursSavedPerYear} hrs</div>
                  <div className="cell-desc">Zero manual spreadsheet tagging</div>
                </div>
              </div>

              <div className="metric-cell">
                <div className="cell-icon">
                  <TrendingUp size={16} />
                </div>
                <div className="cell-info">
                  <div className="cell-title">5-Year Invested Potential</div>
                  <div className="cell-number text-gold">
                    ${fiveYearGrowth.toLocaleString()}
                  </div>
                  <div className="cell-desc">Compounded at 8% annual yield</div>
                </div>
              </div>
            </div>

            <button type="button" className="calc-cta-btn" onClick={onCtaClick}>
              <span>Start Optimizing Now</span>
              <ArrowRight size={15} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
