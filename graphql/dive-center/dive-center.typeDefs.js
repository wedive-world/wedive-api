const { gql } = require('apollo-server')

module.exports = gql`

type Query {
    QUERY____________________________DiveCenters: DiveCenter
    getDiveCenters(skip: Int = 0, limit: Int = 100): [DiveCenter]
    getAllDiveCenters: [DiveCenter]
    getDiveCenterById(_id: ID!): DiveCenter @cacheControl(maxAge: 60)
    getDiveCenterByUniqueName(uniqueName: String!): DiveCenter @cacheControl(maxAge: 60)
    getDiveCentersNearBy(lat1: Float!, lon1: Float!, lat2: Float!, lon2: Float!, limit: Int = 20): [DiveCenter] @cacheControl(maxAge: 60)
    searchDiveCentersByName(query: String!): [DiveCenter] @cacheControl(maxAge: 60)
    getNearByDiveCenters(lat: Float!, lng: Float!, limit: Int! = 5, maxDistance: Int! = 30000): [DiveCenter] @cacheControl(maxAge: 60)
}

type Mutation {
    MUTATION_______DiveCenters_______: DiveCenter
    upsertDiveCenter(input: DiveCenterInput!): DiveCenter!
    deleteDiveCenterById(_id: ID!): ID
}

type DiveCenter  {

    _id: ID!

    managers: [User]
    clerks: [User]

    divingType: [DivingType]
    enteranceLevelFree: String
    enteranceLevelScuba: String

    enteranceFee: String

    phoneNumber: String
    email: String
    webPageUrl: String
    geoAddress: String
    openingHours: [[String]]

    adminScore: Int
    viewScore: Int
    educationScore: Int
    facilityScore: Int
    serviceScore: Int

    wediveComments: [String]

    weeklyHolidays: [DayType]
    monthlyHolidays: [MonthlyHoliday]
    annualHolidays: [AnnualHoliday]
    customHolidays: [CustomHoliday]
    annualLunarHolidays: [AnnualHoliday]
    customLunarHolidays: [CustomHoliday]
    openingTimes: [OpeningTime]
    customOpeningTimes: [CustomOpeningTime]
    isOpened: Boolean
    isBookable: Boolean

    createdAt: Date
    updatedAt: Date
    typeDef: String
}

input DiveCenterInput {
    _id: ID

    publishStatus: PublishStatus

    managers: [ID]
    clerks: [ID]

    divingType: [DivingType]
    enteranceLevelFree: String
    enteranceLevelScuba: String

    enteranceFee: String

    phoneNumber: String
    email: String
    webPageUrl: String
    geoAddress: String
    openingHours: [[String]]

    adminScore: Int
    viewScore: Int
    educationScore: Int
    facilityScore: Int
    serviceScore: Int

    wediveComments: [String]

    isBookable: Boolean
    
    weeklyHolidays: [DayType]
    monthlyHolidays: [MonthlyHolidayInput]
    annualHolidays: [AnnualHolidayInput]
    customLunarHolidays: [CustomHolidayInput]
    annualLunarHolidays: [AnnualHolidayInput]
    customHolidays: [CustomHolidayInput]
    openingTimes: [OpeningTimeInput]
    customOpeningTimes: [CustomOpeningTimeInput]
}

type DiveSite {
    diveShops: [DiveShop]
    diveCenters: [DiveCenter]
}

type DivePoint {
    diveShops: [DiveShop]
    diveCenters: [DiveCenter]
}

type Diving {
    diveShops: [DiveShop]
    diveCenters: [DiveCenter]
}

input DivingInput {
    diveShops: [ID]
    diveCenters: [ID]
}

type Reservation {
    diveCenter: DiveCenter
}

input ReservationInput {
    diveCenter: ID
}

enum DayType {
    mon
    tue
    wed
    thu
    fri
    sat
    sun
    holiday
}

type MonthlyHoliday {
    nWeek: Int
    dayTypes: [DayType]
}

input MonthlyHolidayInput {
    nWeek: Int
    dayTypes: [DayType]
}

type AnnualHoliday {
    month: Int
    day: Int
}

input AnnualHolidayInput {
    month: Int
    day: Int
}

type CustomHoliday {
    year: Int
    month: Int
    day: Int
}

input CustomHolidayInput {
    year: Int
    month: Int
    day: Int
}

type OpeningTime {
    dayType: DayType
    startHour: Int
    startMinute: Int
    finishHour: Int
    finishMinute: Int
    description: String
}

input OpeningTimeInput {
    dayType: DayType
    startHour: Int
    startMinute: Int
    finishHour: Int
    finishMinute: Int
    description: String
}

type CustomOpeningTime {

    year: Int
    month: Int
    day: Int

    startHour: Int
    startMinute: Int
    finishHour: Int
    finishMinute: Int
    description: String
}

input CustomOpeningTimeInput {
    year: Int
    month: Int
    day: Int

    dayType: DayType
    startHour: Int
    startMinute: Int
    finishHour: Int
    finishMinute: Int
    description: String
}

`;