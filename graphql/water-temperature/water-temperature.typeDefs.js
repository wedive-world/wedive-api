const { gql } = require('apollo-server')

module.exports = gql`

type Query {
  QUERY____________________________WaterTemperature: Response
}

type Mutation {
  MUTATION_________________________WaterTemperature: Response
  collectWaterTemperature: Response
}

type DiveSite {
  waterTemperature: WaterTemperature @cacheControl(maxAge: 3600)
}

type DivePoint {
  waterTemperature: WaterTemperature @cacheControl(maxAge: 3600)
}

type DiveCenter {
  waterTemperature: WaterTemperature @cacheControl(maxAge: 3600)
}

type WaterTemperature {
  _id: ID!
  name: String
  currentSeaTemperature: String
  weatherText: String
  temperatureC: Float
  temperatureF: Float
  weatherDescription: String
  weatherIcon: String
  humidity: String
  windSpeed: String
  temperatureDetail: TemperatureDetail
  weekTideForecast: weekTideForecast

  latitude: Float
  longitude: Float
  
  createdAt: Date
}

type TemperatureDetail {
  MinC: [Float]
  MaxC: [Float]
  MinF: [Float]
  MaxF: [Float]
}

type weekTideForecast {
  daysOfWeek: [String],
  tideForecasts: [[[String]]]
}

`;