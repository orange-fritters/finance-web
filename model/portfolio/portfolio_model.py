import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
from scipy.stats import norm, probplot
from arch import arch_model
from scipy.stats._morestats import _calc_uniform_order_statistic_medians
from scipy.stats import linregress
from scipy.optimize import minimize
import pandas as pd
import json

class Portfolio():
    def __init__(self, size, weights, stocks):
        '''
        size: 포트폴리오 사이즈(₩)
        weights(list, np.array): 자산비중
        stocks(pd.DataFrame): stock 데이터
        '''
        if isinstance(weights, list):
            weights = np.array(weights)

        assert len(weights) == len(stocks), 'Length of weights must be equal to number of stocks'
        assert int(sum(weights)) - 1 < 1e-6, 'Sum of weights must be 1'
        
        self.size = size 
        self.weights = weights
        self.stocks = []
        self.prt_return = None

        # preprocess stock data
        for stock in stocks:
            stock['Date'] = stock['Date'].apply(lambda x: x.split()[0])
            stock['Date'] = pd.to_datetime(stock['Date'])
            stock = stock.set_index(stock['Date']).drop('Date', axis = 1)
            self.stocks += [stock['Close']]

    def plot_portfolio_value(self, start, end):
        '''
        start('YYYY-MM-DD'): 시작 날짜
        end('YYYY-MM-DD'): 끝 날짜
        figsize(tuple)
        '''
        data = []
        start = pd.Timestamp(start)
        end = pd.Timestamp(end)
        
        value_df = pd.concat(self.stocks, axis = 1)[start:end]
        weight_dollar = self.weights * self.size
        number_of_assets = weight_dollar/value_df.iloc[0].values
        
        time_index = value_df.index
        prt_value = np.dot(value_df.values, number_of_assets)
        
        for idx, (t, v) in enumerate(zip(time_index, prt_value)):
            point = {
                'index' : idx,
                'time' : str(t).split()[0].split('-')[1] + '-' + str(t).split()[0].split('-')[2],
                'value' : int(v)
            }
            data.append(point)
            
        return data
        
    def get_return(self, start, end, period = 1, method = 'simple'):
        '''
        INPUT
            start('YYYY-MM-DD'): 시작 날짜
            end('YYYY-MM-DD'): 끝 날짜
            period: 수익률 기간
            method
                - simple: 단순수익률
                - log: 로그수익률
                
        OUTPUT
            returns_df: 각 자산의 수익률 데이터 프레임
            prt_return: 포트폴리오 수익률
        '''
        assert method in ['simple', 'log'], 'method must be "simple" or "log"'
        
        start = pd.Timestamp(start) + pd.Timedelta(days = -1)
        end = pd.Timestamp(end) + pd.Timedelta(days = 1)
        
        # compute each stock's return
        returns = []
        for stock in self.stocks:
            if method == 'simple':
                stock_return = stock[start:end].pct_change(periods = period).dropna(axis = 0)
                returns += [stock_return]
            elif method == 'log': 
                stock_return = np.log(stock[start:end]).diff(period).dropna(axis = 0)
                returns += [stock_return]                

        returns_df = pd.concat(returns, axis = 1)
        self.returns_df = returns_df
        
        # compute portfolio return
        prt_return = np.dot(returns_df, self.weights.T)
        self.prt_return = prt_return
        
        return returns_df, prt_return
    
    def plot_return(self, method = 'line'):
        '''
        수익률의 그래프를 그려주는 매소드
        INPUT
            method
                - line
                - histogram
                - qqplot
        '''
        assert self.prt_return is not None, 'Calculate portfolio\'s return first by "get_return()"'
        assert method in ['line', 'histogram', 'qqplot'], 'method must be one of "line", "hist", and "qq"'
        
        time_index = self.returns_df.index

        if method == 'line':
            data = []
            for idx, (t, r) in enumerate(zip(time_index, self.prt_return)):
                info = {
                    'index' : idx,
                    'time' : str(t).split()[0].split('-')[1] + '-' + str(t).split()[0].split('-')[2],
                    'return' : round(r, 3)
                }
                data.append(info)
        
        elif method == 'histogram':
            bins = pd.cut(self.prt_return, 30).describe()
            freq = bins['freqs']
            interval = bins.index
            
            data = []
            for idx, (interval, freq) in enumerate(zip(interval, freq)):
                start = interval.left
                end = interval.right
                point = {
                    'index' : idx,
                    'start' : start,
                    'end' : end,
                    'frequency' : freq
                }
                data.append(point)
            
        elif method == 'qqplot':
            rv = norm()
            position = _calc_uniform_order_statistic_medians(len(self.prt_return))
            theoretical_quantile = rv.ppf(position)
            
            ordered_return = np.sort(self.prt_return)
            
            data = {}
            
            # scatter of qq
            qq_scatter = {}
            for idx, (x, y) in enumerate(zip(theoretical_quantile, ordered_return)):
                info = {
                    'index' : idx,
                    'x' : x,
                    'y' : y
                }
                qq_scatter['point_{}'.format(idx)] = info
            
            # 45 degree line
            degree_line = {}
            slope, intercept, r, prob, _ = linregress(theoretical_quantile, ordered_return)
            x = np.linspace(-3.5, 3.5, 100)
            for idx, x in enumerate(theoretical_quantile):
                point = {
                    'index' : idx,
                    'x' : x,
                    'y' : x * slope + intercept
                }
                degree_line['point_{}'.format(idx)] = point
            
            data = {
                'qq_scatter' : qq_scatter,
                'degree_line' : degree_line
            }
            
        return [data]


class EfficientFrontier():
    def __init__(self, 
                portfolio,
                start,
                end,
                period = 1,
                method = 'simple',
                risk_free = 0):
        self.portfolio = portfolio
        self.returns, _ = portfolio.get_return(start, end, period, method)
        self.n_assets = self.returns.shape[1]
        self.e_return = self.returns.mean()
        self.cov_mat = self.returns.cov()
        self.risk_free = risk_free
    
    def portfolio_performance(self, weights):
        '''
        포트폴리오 기대수익률과 수익률의 표준편차 반환
        '''
        prt_mean = np.dot(weights, self.e_return)
        prt_std = np.sqrt(np.dot(np.dot(weights.T, self.cov_mat), weights))
        return prt_mean, prt_std
        
    def plot_frontier(self, n_prts = 1000):
        data = []
        for idx, _ in enumerate(range(n_prts)):
            weight = np.random.rand(self.n_assets)
            weight = weight / sum(weight)
            prt_mean, prt_std = self.portfolio_performance(weight)
            sharpe = (prt_mean - self.risk_free) / prt_std
            info = {
                'index' : idx,
                'mean' : round(prt_mean, 4),
                'std': round(prt_std, 4),
                'sharpe': round(sharpe, 4)
            }
            data.append(info)
            
        target_mean, target_std = self.portfolio_performance(self.portfolio.weights)
        target_sharpe = (target_mean - self.risk_free) / target_std
        target_info = {
            'index' : len(data) + 1,
            'mean' : target_mean,
            'std' : target_std,
            'sharpe' : target_sharpe
        }
        data.append(target_info)
        
        return data
    
def mv_objective(weight, returns, cov_mat):
    prt_return = np.dot(weight, returns)
    prt_risk = np.sqrt(np.dot(weight.T, np.dot(cov_mat, weight)))
    return prt_risk

def sharpe_objective(weight, returns, cov_mat, risk_free):
    prt_return = np.dot(weight, returns)
    prt_risk = np.sqrt(np.dot(weight.T, np.dot(cov_mat, weight)))
    sharpe_ratio = (prt_return - risk_free) / (prt_risk + 1e-6)
    return -1 * sharpe_ratio if sharpe_ratio > 0 else np.inf

class PortfolioOptimizer():
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
        target = []
        alphas = [0.01, 0.05, 0.1]
        for idx, alpha in enumerate(alphas):
            VaR_pct, VaR, f_x = self.compute_VaR(alpha = alpha, method = method)
            ES_pct, ES, f_x = self.compute_ES(alpha = alpha, method = method)
            
            point = {'index' : idx, 'alpha' : alpha, 'VaR' : VaR_pct, 'ES' : ES_pct}
            target.append(point) 
        
        # dist
        dist = []
        if self.crt_method in ['normal', 'normal_ewma', 'normal_garch']:
            for idx, (x, y) in enumerate(zip(np.sort(self.returns), f_x)):
                point = {'index' : idx, 'x' : np.round(x, 6), 'y' : np.round(y, 6)}
                dist.append(point) 

        elif self.crt_method in ['historical']:
            freq = f_x['freqs']
            interval = f_x.index
            for idx, (interval, freq) in enumerate(zip(interval, freq)): 
                start = interval.left
                end = interval.right
                x = start
                point = {'index' : idx, 'x' : x, 'y' : freq}
                dist.append(point)
            
        data = {
            'distribution' : dist,
            'target' : target
        }
        return [data]
    

class PortfolioModel():
  def __init__(self, size = 1_000_000, weights = [1/7, 1/7, 1/7, 1/7, 1/7, 1/7, 1/7], start='2022-02-06', end='2022-02-18'):
    self.order = {'AAPL': pd.read_csv('./portfolio/data/aapl.csv'),
                  'AMZN': pd.read_csv('./portfolio/data/amzn.csv'),
                  'META': pd.read_csv('./portfolio/data/meta.csv'),
                  'GOOG': pd.read_csv('./portfolio/data/goog.csv'),
                  'MSFT': pd.read_csv('./portfolio/data/msft.csv'),
                  'NFLX': pd.read_csv('./portfolio/data/nflx.csv'),
                  'TSLA': pd.read_csv('./portfolio/data/tsla.csv')}
    
    self.stocks = [
      aapl := pd.read_csv('./portfolio/data/aapl.csv'),
      amzn := pd.read_csv('./portfolio/data/amzn.csv'),
      meta := pd.read_csv('./portfolio/data/meta.csv'),
      goog := pd.read_csv('./portfolio/data/goog.csv'),
      msft := pd.read_csv('./portfolio/data/msft.csv'),
      nflx := pd.read_csv('./portfolio/data/nflx.csv'),
      tsla := pd.read_csv('./portfolio/data/tsla.csv'),
    ]
    self.start = start
    self.end = end
    self.weights = weights
    self.portfolio = Portfolio(size, weights, self.stocks)
    self.ef = EfficientFrontier(self.portfolio, start, end)
    self.risk = RiskMetrics(self.portfolio, start, end)
    self.optimizer = PortfolioOptimizer(self.portfolio, start, end)

  def set_stocks(self, post_data):
    stocks = []
    weights = []
    for item in post_data:
        # item = {name : TICKER , value : float}
        stocks.append(self.order[item['name']][:])
        weights.append(item['value']) 
    print(stocks)
    self.stocks = stocks
    self.weights = weights
    self.portfolio = Portfolio(self.portfolio.size, self.weights, self.stocks)
    self.ef = EfficientFrontier(self.portfolio, self.start, self.end)
    self.risk = RiskMetrics(self.portfolio, self.start, self.end)
    self.optimizer = PortfolioOptimizer(self.portfolio, self.start, self.end)

  def auto_optimize(self):
    return json.dumps(self.optimizer.optimize()[1])
  
  def portfolio_value_over_time(self):
    return json.dumps(self.portfolio.plot_portfolio_value(self.start, self.end))
  
  def scatter_plot(self):
    return json.dumps(self.ef.plot_frontier())
  
  def daily_return(self):
    return json.dumps(self.portfolio.plot_return(method='line'))
  
  def return_hist(self):
    return json.dumps(self.portfolio.plot_return(method='histogram'))
  
  def risk_distribution(self):
    return json.dumps(self.risk.plot_dist())
  
