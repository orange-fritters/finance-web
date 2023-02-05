import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
from scipy.stats import norm, probplot
from arch import arch_model
from scipy.stats._morestats import _calc_uniform_order_statistic_medians
from scipy.stats import linregress
from scipy.optimize import minimize

# portfolio: 포트폴리오 구성
class Portfolio():
    def __init__(self, size, weights, *stocks):
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
                'time' : str(t).split()[0],
                'value' : v
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
                    'time' : str(t).split()[0],
                    'return' : r
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
                'mean' : prt_mean,
                'std': prt_std,
                'sharpe': sharpe
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