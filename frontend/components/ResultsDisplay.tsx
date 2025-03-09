'use client';

import React from 'react';
import type { HedgeFundResponse } from '@/types/api';

interface ResultsDisplayProps {
  results: HedgeFundResponse | null;
  loading: boolean;
  showReasoning: boolean;
}

const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ results, loading, showReasoning }) => {
  // Debug log entire results object
  React.useEffect(() => {
    if (results) {
      console.log('Complete analysis results:', results);
    }
  }, [results]);

  if (loading) {
    return (
      <div className="perplexity-card animate-pulse space-y-4">
        <div className="flex items-center space-x-2 mb-4">
          <div className="h-4 w-4 bg-blue-200 dark:bg-blue-700 rounded-full"></div>
          <div className="h-5 bg-slate-200 dark:bg-gray-700 rounded w-1/3"></div>
        </div>
        <div className="space-y-3">
          <div className="h-32 bg-slate-200 dark:bg-gray-700 rounded-lg"></div>
          <div className="grid grid-cols-2 gap-3">
            <div className="h-24 bg-slate-200 dark:bg-gray-700 rounded-lg"></div>
            <div className="h-24 bg-slate-200 dark:bg-gray-700 rounded-lg"></div>
          </div>
          <div className="h-40 bg-slate-200 dark:bg-gray-700 rounded-lg"></div>
        </div>
      </div>
    );
  }

  if (!results || (!results.decisions && !results.analyst_signals)) {
    return null;
  }

  const getActionColor = (action: string) => {
    switch(action.toUpperCase()) {
      case 'BUY': return 'text-green-600 dark:text-green-400';
      case 'SELL': return 'text-red-600 dark:text-red-400';
      case 'HOLD': return 'text-blue-600 dark:text-blue-400';
      default: return 'text-gray-600 dark:text-gray-400';
    }
  };

  const getSignalColor = (signal: string | null) => {
    if (!signal) return 'badge-gray';
    
    switch(signal.toUpperCase()) {
      case 'BUY': 
      case 'STRONG BUY': return 'badge-green';
      case 'SELL': 
      case 'STRONG SELL': return 'badge-red';
      case 'HOLD': return 'badge-blue';
      case 'NEUTRAL': return 'badge-yellow';
      default: return 'badge-gray';
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(value);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2 mb-2">
        <svg className="h-5 w-5 text-blue-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <path d="M8 14s1.5 2 4 2 4-2 4-2" />
          <line x1="9" y1="9" x2="9.01" y2="9" />
          <line x1="15" y1="9" x2="15.01" y2="9" />
        </svg>
        <h2 className="text-xl font-bold text-slate-800 dark:text-white">Analysis Results</h2>
      </div>
      
      {/* Portfolio Value */}
      {results.decisions?.portfolio_value && (
        <div className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-xl border border-slate-200 dark:border-gray-700 shadow-sm">
          <span className="text-sm font-medium text-slate-700 dark:text-gray-300">Portfolio Value</span>
          <span className="text-lg font-bold text-emerald-600 dark:text-emerald-400">
            {formatCurrency(results.decisions.portfolio_value)}
          </span>
        </div>
      )}
      
      {/* Final Decision Summary */}
      <div className="mt-4">
        <div className="flex items-center mb-4">
          <svg className="h-5 w-5 text-blue-500 dark:text-blue-400 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
          </svg>
          <h3 className="text-lg font-bold text-slate-800 dark:text-white">Trading Recommendations</h3>
        </div>
        
        {results.decisions && Object.keys(results.decisions).length > 0 && 
         Object.keys(results.decisions).some(key => key !== 'portfolio_value') ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4">
            {Object.entries(results.decisions).map(([ticker, decision]) => {
              // Skip portfolio_value as it's not a ticker decision
              if (ticker === 'portfolio_value') return null;
              
              // Skip if invalid data
              if (!decision || typeof decision !== 'object') return null;
              
              const action = decision.action || 'UNKNOWN';
              const quantity = typeof decision.quantity === 'number' ? decision.quantity : 0;
              // Round confidence to nearest integer
              const confidence = decision.confidence ? Math.round(decision.confidence) : null;
              
              // Determine styling based on action
              let bgColor, bgColorDark, borderColor, borderColorDark, textColor, textColorDark, iconPath;
              
              if (action.toUpperCase() === 'BUY') {
                bgColor = 'bg-emerald-50';
                bgColorDark = 'dark:bg-emerald-900/20';
                borderColor = 'border-emerald-200';
                borderColorDark = 'dark:border-emerald-800/30';
                textColor = 'text-emerald-700';
                textColorDark = 'dark:text-emerald-400';
                iconPath = 'M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z';
              } else if (action.toUpperCase() === 'SELL') {
                bgColor = 'bg-red-50';
                bgColorDark = 'dark:bg-red-900/20';
                borderColor = 'border-red-200';
                borderColorDark = 'dark:border-red-800/30';
                textColor = 'text-red-700';
                textColorDark = 'dark:text-red-400';
                iconPath = 'M15 12H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z';
              } else if (action.toUpperCase() === 'HOLD') {
                bgColor = 'bg-blue-50';
                bgColorDark = 'dark:bg-blue-900/20';
                borderColor = 'border-blue-200';
                borderColorDark = 'dark:border-blue-800/30';
                textColor = 'text-blue-700';
                textColorDark = 'dark:text-blue-400';
                iconPath = 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z';
              } else {
                bgColor = 'bg-slate-50';
                bgColorDark = 'dark:bg-slate-800/50';
                borderColor = 'border-slate-200';
                borderColorDark = 'dark:border-slate-700';
                textColor = 'text-slate-700';
                textColorDark = 'dark:text-slate-300';
                iconPath = 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z';
              }
              
              return (
                <div key={`decision-${ticker}`} className={`p-4 rounded-xl border ${borderColor} ${borderColorDark} ${bgColor} ${bgColorDark} shadow-sm`}>
                  <div className="flex justify-between items-center mb-3">
                    <div className="flex items-center">
                      <svg className={`h-5 w-5 mr-1.5 ${textColor} ${textColorDark}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d={iconPath} />
                      </svg>
                      <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200">{ticker}</h3>
                    </div>
                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${textColor} ${textColorDark} ${bgColor} ${bgColorDark} border ${borderColor} ${borderColorDark}`}>
                      {action.toUpperCase()}
                    </span>
                  </div>
                  
                  <div className="space-y-2 text-sm">
                    {quantity !== 0 && (
                      <div className="flex justify-between items-center">
                        <span className="text-slate-600 dark:text-slate-400">Quantity:</span>
                        <span className="font-medium text-slate-800 dark:text-slate-200">{quantity.toLocaleString()}</span>
                      </div>
                    )}
                    
                    {/* Confidence Score - with rounded values */}
                    {confidence && (
                      <div className="flex justify-between items-center mt-2">
                        <span className="text-slate-600 dark:text-slate-400">Confidence:</span>
                        <div className="flex items-center">
                          <div className="w-24 bg-slate-200 dark:bg-slate-700 rounded-full h-2 mr-2">
                            <div 
                              className={`h-2 rounded-full ${
                                confidence > 70 ? 'bg-green-500 dark:bg-green-400' : 
                                confidence > 40 ? 'bg-yellow-500 dark:bg-yellow-400' : 'bg-red-500 dark:bg-red-400'
                              }`} 
                              style={{ width: `${confidence}%` }}
                            ></div>
                          </div>
                          <span className="font-medium text-slate-800 dark:text-slate-200">
                            {confidence}%
                          </span>
                        </div>
                      </div>
                    )}
                    
                    {/* Reasoning */}
                    {decision.reasoning && (
                      <div className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-700">
                        <div className="text-slate-600 dark:text-slate-400 text-xs font-medium mb-1">Reasoning:</div>
                        <p className="text-slate-800 dark:text-slate-300 text-sm">
                          {decision.reasoning}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-gray-700">
            {results.decisions ? (
              <div className="text-center">
                <svg className="mx-auto h-10 w-10 text-blue-500 dark:text-blue-400 mb-3 opacity-70" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 3h18v18H3zM8 12h8"/>
                </svg>
                <h4 className="text-lg font-medium text-slate-800 dark:text-white mb-2">Hold Recommendation</h4>
                <p className="text-slate-600 dark:text-gray-400 mb-4">
                  Our analysis suggests maintaining your current positions. No trades are recommended at this time.
                </p>
                {results.decisions.portfolio_value && (
                  <div className="mt-4 p-3 bg-slate-50 dark:bg-gray-700 rounded-lg inline-block border border-slate-200 dark:border-gray-600">
                    <span className="font-medium text-slate-700 dark:text-gray-300">Current Portfolio Value: </span>
                    <span className="font-bold text-emerald-600 dark:text-emerald-400">{formatCurrency(results.decisions.portfolio_value)}</span>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center">
                <svg className="mx-auto h-10 w-10 text-amber-500 dark:text-amber-400 mb-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"/>
                  <line x1="12" y1="8" x2="12" y2="12"/>
                  <line x1="12" y1="16" x2="12.01" y2="16"/>
                </svg>
                <h4 className="text-lg font-medium text-slate-800 dark:text-white mb-2">No Decisions Available</h4>
                <p className="text-slate-600 dark:text-gray-400">
                  Please make sure your analysis is complete and includes portfolio decisions.
                </p>
                
                {/* If there are any recommendations at the root level */}
                {results.decisions && typeof results.decisions === 'object' && 
                  Object.entries(results.decisions)
                    .filter(([key]) => key !== 'portfolio_value')
                    .length > 0 && (
                    <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg text-left">
                      <h4 className="font-medium mb-2 dark:text-gray-300">Additional Information:</h4>
                      <div className="text-sm space-y-2">
                        {Object.entries(results.decisions)
                          .filter(([key]) => key !== 'portfolio_value')
                          .map(([key, value]) => (
                            <div key={key} className="flex flex-col">
                              <span className="font-medium dark:text-gray-300">{key.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}:</span>
                              <span className="ml-2 dark:text-gray-400">
                                {typeof value === 'object' 
                                  ? JSON.stringify(value, null, 2) 
                                  : String(value)}
                              </span>
                            </div>
                          ))
                        }
                      </div>
                    </div>
                  )
                }
              </div>
            )}
          </div>
        )}
      </div>
      
      {/* Analyst Signals */}
      {results.analyst_signals && Object.keys(results.analyst_signals).length > 0 && (
        <div className="perplexity-card">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center">
              <svg className="h-5 w-5 text-blue-500 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
              <h3 className="text-lg font-semibold text-slate-800 dark:text-white">Analyst Signal Consensus</h3>
            </div>
            <div className="flex items-center text-sm text-slate-500 dark:text-gray-400 space-x-3">
              <div className="flex items-center">
                <div className="w-2 h-2 rounded-full bg-emerald-500 mr-1.5"></div>
                <span>Buy</span>
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 rounded-full bg-blue-500 mr-1.5"></div>
                <span>Hold</span>
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 rounded-full bg-red-500 mr-1.5"></div>
                <span>Sell</span>
              </div>
            </div>
          </div>
          <div className="space-y-6">
            {(() => {
              try {
                // Make sure we have valid analyst signals to display
                if (!results.analyst_signals || typeof results.analyst_signals !== 'object') {
                  return (
                    <div className="py-8 text-center">
                      <div className="flex flex-col items-center justify-center">
                        <svg className="h-10 w-10 text-slate-300 dark:text-gray-600 mb-3" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 000 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                        </svg>
                        <span className="text-slate-500 dark:text-gray-400 font-medium mb-1">No analyst signals available</span>
                        <p className="text-xs text-slate-400 dark:text-gray-500 max-w-sm">
                          There are no analyst signals for the selected period.
                        </p>
                      </div>
                    </div>
                  );
                }
                
                // Get all tickers to display
                const tickers = Object.keys(results.analyst_signals);
                
                // Create a section for each ticker
                return tickers.map((ticker, index) => {
                  const signals = results.analyst_signals[ticker];
                  
                  // Skip if no signals
                  if (!signals || typeof signals !== 'object' || Object.keys(signals).length === 0) {
                    return null;
                  }
                  
                  return (
                    <div key={ticker} className={`bg-white dark:bg-gray-800 rounded-xl border border-slate-200 dark:border-gray-700 overflow-hidden shadow-sm ${index > 0 ? 'mt-6' : ''}`}>
                      {/* Ticker header */}
                      <div className="bg-slate-50 dark:bg-gray-800/80 border-b border-slate-200 dark:border-gray-700 px-4 py-3 flex items-center">
                        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center mr-3 text-blue-600 dark:text-blue-400 font-bold text-lg">
                          {ticker.charAt(0)}
                        </div>
                        <h4 className="text-xl font-bold text-slate-700 dark:text-gray-200">{ticker}</h4>
                      </div>
                      
                      {/* Signals table for this ticker */}
                      <div className="overflow-x-auto">
                        <table className="w-full border-collapse">
                          <thead className="bg-slate-50 dark:bg-gray-800">
                            <tr>
                              <th className="text-left py-2 px-4 text-sm font-medium text-slate-600 dark:text-gray-400 border-b border-slate-200 dark:border-gray-700 w-1/3">Analyst</th>
                              <th className="text-left py-2 px-4 text-sm font-medium text-slate-600 dark:text-gray-400 border-b border-slate-200 dark:border-gray-700 w-1/3">Signal</th>
                              <th className="text-right py-2 px-4 text-sm font-medium text-slate-600 dark:text-gray-400 border-b border-slate-200 dark:border-gray-700">Confidence</th>
                            </tr>
                          </thead>
                          <tbody>
                            {Object.entries(signals).map(([analyst, data]) => {
                              // Skip invalid data
                              if (!data || typeof data !== 'object') {
                                return null;
                              }
                              
                              return (
                                <tr key={analyst} className="hover:bg-slate-50 dark:hover:bg-gray-800/70">
                                  <td className="py-3 px-4 dark:text-gray-300 border-b border-slate-100 dark:border-gray-800">
                                    <div className="flex items-center">
                                      {/* Show analyst icon or avatar */}
                                      {analyst === 'warren_buffett' || analyst === 'charlie_munger' || analyst === 'cathie_wood' || analyst === 'ben_graham' || analyst === 'bill_ackman' ? (
                                        <img 
                                          src={`/images/analysts/${analyst}.svg`} 
                                          alt={analyst} 
                                          className="w-7 h-7 mr-2 rounded-full bg-blue-50 dark:bg-blue-900"
                                        />
                                      ) : (
                                        <svg className="w-6 h-6 mr-2 text-slate-400 dark:text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                                          <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                                        </svg>
                                      )}
                                      <span className="font-medium">
                                        {analyst.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                                      </span>
                                    </div>
                                  </td>
                                  <td className="py-3 px-4 border-b border-slate-100 dark:border-gray-800">
                                    <span className={`inline-flex items-center px-3 py-0.5 rounded-full text-xs font-medium ${
                                      data.signal === 'BUY' || data.signal === 'STRONG BUY'
                                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400' 
                                        : data.signal === 'SELL' || data.signal === 'STRONG SELL'
                                          ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                                          : data.signal === 'HOLD' || data.signal === 'NEUTRAL'
                                            ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
                                            : 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400'
                                    }`}>
                                      {data.signal || 'N/A'}
                                    </span>
                                  </td>
                                  <td className="py-3 px-4 text-right border-b border-slate-100 dark:border-gray-800">
                                    {data.confidence !== null && data.confidence !== undefined ? (
                                      <div className="flex items-center justify-end">
                                        <div className="w-24 h-3 bg-slate-200 dark:bg-gray-700 rounded-full overflow-hidden mr-2">
                                          <div 
                                            className={`h-full ${
                                              data.signal === 'BUY' || data.signal === 'STRONG BUY'
                                                ? 'bg-emerald-500 dark:bg-emerald-400' 
                                                : data.signal === 'SELL' || data.signal === 'STRONG SELL'
                                                  ? 'bg-red-500 dark:bg-red-400'
                                                  : 'bg-blue-500 dark:bg-blue-400'
                                            }`}
                                            style={{ width: `${data.confidence}%` }}
                                          ></div>
                                        </div>
                                        <span className="font-medium tabular-nums dark:text-gray-300">
                                          {data.confidence}%
                                        </span>
                                      </div>
                                    ) : (
                                      <span className="text-slate-400 dark:text-gray-500">N/A</span>
                                    )}
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  );
                });
              } catch (error) {
                console.error('Error rendering analyst signals:', error);
                return (
                  <div className="px-6 py-4 text-center text-red-500 dark:text-red-400">
                    Error displaying analyst signals
                  </div>
                );
              }
            })()}
          </div>
        </div>
      )}
    </div>
  );
};

export default ResultsDisplay;