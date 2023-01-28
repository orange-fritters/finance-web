import numpy as np
import json

class Model:
  def __init__(self):
    pass
  
  def prediction(self, input_size):
    # using numpy create random prediction similar to line
    data1 = 2 * np.random.randn(input_size) + 1
    data2 = 3 * np.random.randn(input_size) + 0.5
    
    # zip two data and iterate using for loop
    to_json = []
    for i, (x, y) in enumerate(zip(data1, data2)):
      to_json.append(
        {"INDEX": i,
        "BTC": x,
        "ETH": y}
      )
    return json.dumps(to_json)

  def risk(self, input_data):
    return self.model.predict_proba(input_data)

  def sentiment(self, input_data):
    return self.model.predict_proba(input_data)

if __name__ == "__main__":
  model = Model()
  print(model.prediction(10))