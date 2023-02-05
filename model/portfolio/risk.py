import numpy as np
from arch import arch_model
from scipy.stats import norm
import pandas as pd

def EWMA_volatility(returns, window = 100, decay = 0.94):
    r = returns[-window:]
    r_squared = r ** 2
    n = len(r)
    exp = np.flip(np.arange(0, n))
    weight = (1 - decay) * (decay**exp)
    var = np.sum(r_squared * weight)
    vol = np.sqrt(var)
    return vol


def GARCH_volatility(returns):
    GARCH = arch_model(returns, mean = 'Zero', vol = 'Garch', p = 1, o = 0, q = 1, dist = 'Normal')
    results = GARCH.fit()
    vol = results.conditional_volatility[-1]
    return vol


# Value-at-Risk
# Expected-Shortfall
def historical_method(returns, alpha):
    # VaR, ES
    returns.sort()
    VaR_pct = np.percentile(returns, alpha*100, method = 'lower')
    ES_pct = np.mean(returns[returns <= VaR_pct])
    
    # histogram
    bins = pd.cut(returns, 30).describe()
    
    return VaR_pct, ES_pct, bins


def normal_method(returns, alpha):
    # VaR, ES
    mu = returns.mean()
    sigma = returns.std()
    VaR_pct = mu - norm.ppf(alpha)*sigma
    ES_pct = mu - (1/alpha) * norm.pdf(norm.ppf(alpha)) * sigma
    
    # Normal(mu, sigma)
    f_x = norm.pdf(np.sort(returns), loc = mu, scale = sigma)
    
    return VaR_pct, ES_pct, f_x


def normal_ewma_method(returns, alpha, window = 100, decay = 0.94):
    # VaR, ES
    mu = 0
    sigma = EWMA_volatility(returns, window = window, decay = decay)
    VaR_pct = mu - norm.ppf(alpha)*sigma
    ES_pct = mu - (1/alpha) * norm.pdf(norm.ppf(alpha)) * sigma
    
    # Normal(mu, sigma)
    f_x = norm.pdf(np.sort(returns), loc = mu, scale = sigma)
    
    return VaR_pct, ES_pct, f_x


def normal_garch_method(returns, alpha):
    # VaR, ES
    mu = 0
    sigma = GARCH_volatility(returns)
    VaR_pct = mu - norm.ppf(alpha)*sigma
    ES_pct = mu - (1/alpha) * norm.pdf(norm.ppf(alpha)) * sigma
    
    # Normal(mu, sigma)
    # Normal(mu, sigma)
    f_x = norm.pdf(np.sort(returns), loc = mu, scale = sigma)
    
    return VaR_pct, ES_pct, f_x


class RiskMetrics:
    def __init__(self, portfolio, start, end, period = 1):
        self.portfolio = portfolio
        _, self.returns = portfolio.get_return(start, end, period)
        self.method = {'historical' : historical_method,
                       'normal': normal_method,
                       'normal_ewma': normal_ewma_method,
                       'normal_garch': normal_garch_method}
        self.crt_method = None
    
    def compute_VaR(self, alpha = 0.05, method = 'historical'):
        self.crt_method = method
        compute_fn = self.method[method]
        VaR_pct, _, f_x = compute_fn(self.returns, alpha)
        VaR = self.portfolio.size * VaR_pct
        return VaR_pct, VaR, f_x

    def compute_ES(self, alpha = 0.05, method = 'historical'):
        self.crt_method = method
        compute_fn = self.method[method]
        _, ES_pct, f_x = compute_fn(self.returns, alpha)
        ES = self.portfolio.size * ES_pct
        return ES_pct, ES, f_x
    
    
    def plot_dist(self, method = 'historical'):
        # VaR, ES
        target = {}
        alphas = [0.01, 0.05, 0.1]
        for idx, alpha in enumerate(alphas):
            VaR_pct, VaR, f_x = self.compute_VaR(alpha = alpha, method = method)
            ES_pct, ES, f_x = self.compute_ES(alpha = alpha, method = method)
            
            point = {'index' : idx, 'alpha' : alpha, 'VaR' : VaR_pct, 'ES' : ES_pct}
            target['point_{}'.format(idx)] = point
        
        # dist
        dist = {}
        if self.crt_method in ['normal', 'normal_ewma', 'normal_garch']:
            for idx, (x, y) in enumerate(zip(np.sort(self.returns), f_x)):
                point = {'index' : idx, 'x' : np.round(x, 6), 'y' : np.round(y, 6)}
                dist['point_{}'.format(idx)] = point

        elif self.crt_method in ['historical']:
            freq = f_x['freqs']
            interval = f_x.index
            for idx, (interval, freq) in enumerate(zip(interval, freq)): 
                start = interval.left
                end = interval.right
                x = f'({start}, {end}]'
                point = {'index' : idx, 'x' : x, 'y' : freq}
                dist['point_{}'.format(idx)] = point
            
        data = {
            'distribution' : dist,
            'target' : target
        }
        return [data]