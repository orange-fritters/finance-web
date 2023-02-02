import numpy as np
import pandas as pd
import matplotlib.pyplot as plt


class SentimentModel():
    def __init__(self) -> None:
        # self.data = df
        self.sent_df = pd.read_csv("sentiment/2023-01-01_2023-01-31_BTC_sentiment.csv", index_col=0)
        self.data_df = pd.read_csv("sentiment/2023-01-01_2023-01-31_BTC.csv", index_col=0)
        pass


    def sentiment_bar(self):
        one_lst = []

        all =len(self.sent_df)  # 1-1번
        pos = len(self.sent_df.loc[self.sent_df['label'] == 'POSITIVE'])  # 1-2번
        neg = all - pos  # 1-3번

        one_dict = {'all': all, 'positive': pos, 'negative': neg}
        
        for i, (key, value) in enumerate(one_dict.items()):
            one_lst.append({'Index': i, key: value})
        
        return one_lst
    
    def sentiment_donut(self):
        two_lst = []

        all =len(self.sent_df)  # 1-1번
        pos = len(self.sent_df.loc[self.sent_df['label'] == 'POSITIVE'])  # 1-2번
        neg = all - pos  # 1-3번

        if pos > neg:
            dominant = round((pos/all) * 100,2)  # 2-1번
            orient = "positive"  # 2-2번
            two_lst.append({f'index: 0, percent: {dominant}%'})
            two_lst.append({f'index: 1, orient: {orient}'})
            
        elif pos == neg:
            two_lst.append({f'index: 0, percent: 50%'})
            two_lst.append({f'index: 1, orient: neutral'})

        else:
            dominant = round((neg/all) * 100,2)
            orient = "negative"
            two_lst.append({f'index: 0, percent: {dominant}%'})
            two_lst.append({f'index: 1, orient: {orient}'})

        return two_lst
    

    def tweets_plot(self, tiempo):
        # tiempo_lst = ['Hour','MonthDay','DayName']  # 버튼 항목(3개)
        return self.data_df[tiempo].to_json(orient='records')