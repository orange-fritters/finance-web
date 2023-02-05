import numpy as np
from scipy.optimize import minimize

# portfolio optimizer
def mv_objective(weight, returns, cov_mat):
    prt_return = np.dot(weight, returns)
    prt_risk = np.sqrt(np.dot(weight.T, np.dot(cov_mat, weight)))
    return prt_risk

def sharpe_objective(weight, returns, cov_mat, risk_free):
    prt_return = np.dot(weight, returns)
    prt_risk = np.sqrt(np.dot(weight.T, np.dot(cov_mat, weight)))
    sharpe_ratio = (prt_return - risk_free) / (prt_risk + 1e-6)
    return -1 * sharpe_ratio if sharpe_ratio > 0 else np.inf

class Portfolio_Optimizer():
    def __init__(self, portfolio, start, end, period = 1, method = 'simple'):
        self.portfolio = portfolio
        self.return_df, self.prt_return = portfolio.get_return(start, end, period = period, method = method)
        self.mean_return = self.return_df.mean()
        self.cov_mat = self.return_df.cov()
        self.weight = np.random.randn(len(self.mean_return))
        self.risk_free = 0.0
        
    def optimize(self, method = 'minimum_variance'):
        assert method in ['minimum_variance', 'max_sharpe'], '...'
        
        if method == 'minimum_variance':
            minimize_result = minimize(
                mv_objective,
                self.weight,
                args = (self.mean_return, self.cov_mat),
                method = 'SLSQP',
                bounds = [(0, 1) for i in range(len(self.weight))],
                constraints = {
                    'type' : 'eq',
                    'fun' : lambda x: np.sum(x) - 1
                }
            )
        
        elif method == 'max_sharpe':
            minimize_result = minimize(
                sharpe_objective,
                self.weight,
                args = (self.mean_return, self.cov_mat, self.risk_free),
                method = 'SLSQP',
                bounds = [(0, 1) for i in range(len(self.weight))],
                constraints = {
                    'type' : 'eq',
                    'fun' : lambda x: np.sum(x) - 1
                }
            )
        
        
        assert np.abs(sum(minimize_result.x) -1) < 1e-6, '...'
        
        data = [] 
        optimized_weight = np.round(minimize_result.x,4) 
        for idx, w in enumerate(optimized_weight):
            point = {
                'index' : idx,
                'name' : f'asset {idx}',
                'weight' : w * 100
            }
            data.append(point)
            
        return minimize_result.x, data
            
        